import { env } from 'cloudflare:workers';
export const dynamic = 'force-dynamic';
export async function GET(){const settings=env as unknown as Record<string,string|undefined>;return Response.json({configured:Boolean(settings.OPENAI_API_KEY)},{headers:{'Cache-Control':'no-store'}});}
