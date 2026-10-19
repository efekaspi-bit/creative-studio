import { getChatGPTUser } from '../../chatgpt-auth';
import { env } from 'cloudflare:workers';
import { askAI, validateMessages } from '../../../lib/creative-core.mjs';
export const dynamic = 'force-dynamic';
const recent = new Map<string, number[]>();
const inFlight = new Set<string>();
const json = (body: object, status = 200) => Response.json(body, {status, headers:{'Cache-Control':'no-store'}});
export async function POST(request: Request) {
 const user = await getChatGPTUser();
 if(!user)return json({error:'Please sign in to use Creative Studio.'},401);
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'This request must come from Creative Studio.'},403);
 if(!request.headers.get('content-type')?.includes('application/json'))return json({error:'JSON is required.'},415);
 const now=Date.now();
 for(const [id,times] of recent)if(!times.some(t=>now-t<60000))recent.delete(id);
 const times=(recent.get(user.userId)||[]).filter(t=>now-t<60000);
 if(times.length>=5||inFlight.has(user.userId))return json({error:'Please wait for the current reply, or try again in a minute.'},429);
 let messages;
 try{const raw=await request.text();if(raw.length>32000)return json({error:'This request is too large.'},413);messages=validateMessages(JSON.parse(raw));}
 catch(e){return json({error:e instanceof Error?e.message:'Invalid request.'},400);}
 const settings=env as unknown as Record<string,string|undefined>;
 const key=settings.OPENAI_API_KEY;
 if(!key)return json({error:'AI is not connected yet. Your draft stays in this browser. Server setup is still required.'},503);
 times.push(now);recent.set(user.userId,times);inFlight.add(user.userId);
 try{const result=await askAI({messages,key,model:settings.OPENAI_MODEL||'gpt-5-mini'});return json(result,result.status);}
 finally{inFlight.delete(user.userId);}
}
