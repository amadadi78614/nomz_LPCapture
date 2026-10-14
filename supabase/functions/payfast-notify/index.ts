import { Buffer } from 'node:buffer';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { createHash, timingSafeEqual } from 'node:crypto';
const enc=(v:string)=>encodeURIComponent(v.trim()).replace(/[!'()*]/g,c=>'%'+c.charCodeAt(0).toString(16).toUpperCase()).replace(/%20/g,'+');
Deno.serve(async(req)=>{
 if(req.method!=='POST')return new Response('Method not allowed',{status:405});
 try{
  const mode=Deno.env.get('LP_PAYFAST_MODE'),pass=Deno.env.get('PAYFAST_PASSPHRASE'),merchant=Deno.env.get('PAYFAST_MERCHANT_ID');
  if(!['live','sandbox'].includes(mode||'')||!pass||!merchant)return new Response('Not configured',{status:503});
  const raw=await req.text();if(raw.length>20000)return new Response('Too large',{status:413});
  const params=new URLSearchParams(raw);const fields=Object.fromEntries(params);
  if([...params.keys()].length!==Object.keys(fields).length)throw Error('Duplicate fields');
  const pairs=[...params].filter(([k])=>k!=='signature').map(([k,v])=>`${k}=${enc(v)}`).join('&');
  const signature=createHash('md5').update(pairs+'&passphrase='+enc(pass)).digest('hex');
  if(!/^[a-f0-9]{32}$/.test(fields.signature||'')||!timingSafeEqual(Buffer.from(signature),Buffer.from(fields.signature)))throw Error('Signature mismatch');
  if(fields.merchant_id!==merchant||!/^[0-9a-f-]{36}$/i.test(fields.m_payment_id||'')||!/^\d+$/.test(fields.pf_payment_id||'')||!/^\d+\.\d{2}$/.test(fields.amount_gross||''))throw Error('Invalid payment data');
  // Match the documented Payfast-domain check; TLS server validation below is authoritative.
  const ref=req.headers.get('referer');
  const hosts=mode==='sandbox'?['sandbox.payfast.co.za']:['www.payfast.co.za','w1w.payfast.co.za','w2w.payfast.co.za'];
  if(!ref||!hosts.includes(new URL(ref).hostname))throw Error('Invalid Payfast origin');
  const host=mode==='live'?'www.payfast.co.za':'sandbox.payfast.co.za';
  const response=await fetch(`https://${host}/eng/query/validate`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:pairs,signal:AbortSignal.timeout(15000)});
  if(!response.ok||(await response.text()).trim()!=='VALID')throw Error('Payfast validation failed');
  if(fields.payment_status!=='COMPLETE')return new Response('OK');
  const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
  const {error}=await db.rpc('lp_settle_order',{p_id:fields.m_payment_id,p_amount:Math.round(Number(fields.amount_gross)*100),p_pf:fields.pf_payment_id,p_note:'Verified Payfast ITN'});
  if(error)throw Error('Order verification failed');
  return new Response('OK');
 }catch{return new Response('Payment notification rejected',{status:400});}
});
