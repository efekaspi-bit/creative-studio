// Server-only: the browser never receives API credentials.
export const instructions = `You are Creative Studio, a thoughtful collaborator for creative industry students. Help with film, games, music, design, exhibitions, events, writing, research, and other creative work. Never assume the project is a campaign, brand, product or Stussy brief. Match the user's language. Start by understanding their idea and what help they need. If necessary ask at most two specific questions; if there is enough detail, offer useful work immediately. Offer distinct directions with reasons and practical trade-offs when asked. Respect budget, equipment, time and other constraints. Help the student choose, test and refine; do not make every decision for them. Label assumptions. You cannot browse, verify current facts, generate images or create files; do not claim otherwise. Do not invent research, quotes, sources or completed work. Keep replies focused, normally under 350 words. Use simple paragraphs or short lists. Never ask for API keys or other secrets.`;
export function validateMessages(body) {
  if (!body || !Array.isArray(body.messages) || !body.messages.length || body.messages.length > 24) throw new Error('Send between 1 and 24 messages.');
  let size=0;
  const messages=body.messages.map(m=>{
    if (!m || !['user','assistant'].includes(m.role) || typeof m.content!=='string' || !m.content.trim() || m.content.length>6000) throw new Error('Each message must contain 1–6,000 characters.');
    size+=m.content.length;return {role:m.role,content:m.content.trim()};
  });
  if(size>24000)throw new Error('This conversation is long. Start a new project or shorten your message.');
  if(messages.at(-1).role!=='user')throw new Error('The last message must be yours.');
  return messages;
}
export function errorFor(status,code,type){
 if(code==='insufficient_quota'||code==='credit_balance_exhausted'||type==='insufficient_quota')return {status:402,error:'The API account has no available credit or quota. Your draft is saved; the owner needs to check API billing.'};
 if(status===401||status===403)return {status:503,error:'The AI connection needs attention. The owner should check the API key and project access.'};
 if(status===429)return {status:429,error:'The AI service is busy or rate-limited. Wait a little before trying again.'};
 return {status:502,error:'The AI service could not complete this request. Your draft is still here. Please try again.'};
}
export async function askAI({messages,key,model='gpt-5-mini',fetcher=fetch}){
 if(!key)return {status:503,error:'AI is not connected yet. Your project is saved locally. The owner needs to configure the server API key.'};
 try{
  const response=await fetcher('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({model,instructions,input:messages,max_output_tokens:2400,reasoning:{effort:'low'},store:false}),signal:AbortSignal.timeout(60000)});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)return errorFor(response.status,data?.error?.code,data?.error?.type);
  if(data.status==='incomplete')return {status:502,error:'The response reached its limit. Try a smaller question; your draft is saved.'};
  const text=(data.output||[]).flatMap(o=>o.content||[]).filter(c=>c.type==='output_text').map(c=>c.text).join('\n').trim();
  if(!text)return {status:502,error:'No text response was returned. Try rephrasing your request.'};
  return {status:200,text,model};
 }catch{return {status:504,error:'The connection timed out or was interrupted. Your draft is saved. Please try again.'};}
}
