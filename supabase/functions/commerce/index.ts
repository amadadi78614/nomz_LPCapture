import { Buffer } from 'node:buffer';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { createHash, timingSafeEqual } from 'node:crypto';
const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
const site='https://www.lowveldpadel.co.za';
const allowed=new Set([site,'https://lowveldpadel.co.za','http://localhost:5173']);
const bank={holder:'LOWVELD PADEL (PTY)LTD',bank:'FNB',account:'63112387097',type:'Gold Business Account',branch:'250955'};
const sha=(v:string)=>createHash('sha256').update(v).digest('hex');
const enc=(v:string)=>encodeURIComponent(v.trim()).replace(/[!'()*]/g,c=>'%'+c.charCodeAt(0).toString(16).toUpperCase()).replace(/%20/g,'+');
const uuid=(v:any)=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
const tokenOk=(v:any)=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
function config(){const mode=Deno.env.get('LP_PAYFAST_MODE');return {ready:['sandbox','live'].includes(mode||'')&&!!Deno.env.get('PAYFAST_MERCHANT_ID')&&!!Deno.env.get('PAYFAST_MERCHANT_KEY')&&!!Deno.env.get('PAYFAST_PASSPHRASE'),mode};}
function sign(fields:Record<string,string>){return createHash('md5').update(Object.entries(fields).filter(([,v])=>v!=='').map(([k,v])=>`${k}=${enc(v)}`).join('&')+'&passphrase='+enc(Deno.env.get('PAYFAST_PASSPHRASE')!)).digest('hex');}
async function admin(req:Request){const jwt=req.headers.get('authorization')?.replace(/^Bearer /,'');if(!jwt)throw Error('Sign in as an LP administrator.');const {data:{user},error}=await db.auth.getUser(jwt);if(error||!user)throw Error('Sign in as an LP administrator.');const {data}=await db.from('app_admin_users').select('user_id').eq('user_id',user.id).eq('access_level','admin').maybeSingle();if(!data)throw Error('Administrator access required.');return user;}
async function emailReceipt(id:string){
 const key=Deno.env.get('RESEND_API_KEY'),from=Deno.env.get('LP_CONFIRMATION_FROM');if(!key||!from)return;
 const {data:o}=await db.from('lp_orders').select('id,reference,customer_name,email,total_cents,method,expires_at,email_status,created_at,lp_order_items(title,quantity,unit_cents)').eq('id',id).single();
 if(!o||o.email_status==='sent'||Date.now()-new Date(o.created_at).getTime()>3600000)return;
 const lines=o.lp_order_items.map((i:any)=>`${i.title} × ${i.quantity}: R${(i.quantity*i.unit_cents/100).toFixed(2)}`).join('\n');
 const text=`Hi ${o.customer_name},\n\nYour LP order ${o.reference} has been received.\n\n${lines}\n\nTotal: R${(o.total_cents/100).toFixed(2)}\n\n${o.method==='eft'?`FNB EFT: ${bank.holder}\n${bank.type}\nAccount ${bank.account} / branch ${bank.branch}\nUse reference ${o.reference}.`:'Return to your order in the browser where you checked out to complete Payfast payment.'}\n\nReservation expires: ${new Date(o.expires_at).toLocaleString('en-ZA',{timeZone:'Africa/Johannesburg'})} South Africa time. Do not pay after expiry without contacting LP.\n\nThis confirms receipt of your order, not payment or final event acceptance. Event eligibility remains subject to LP approval.\n\nQuestions: admin@lowveldpadel.co.za`;
 try{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':`lp-order-${id}`},body:JSON.stringify({from,to:[o.email],subject:`LP order received · ${o.reference}`,text}),signal:AbortSignal.timeout(10000)});await db.from('lp_orders').update({email_status:r.ok?'sent':'failed'}).eq('id',id);}catch{await db.from('lp_orders').update({email_status:'failed'}).eq('id',id);}
}
const clean=(v:any,n=160)=>typeof v==='string'?v.trim().slice(0,n):'';
Deno.serve(async(req)=>{
 const origin=req.headers.get('origin');const headers={'Content-Type':'application/json','Cache-Control':'no-store','Access-Control-Allow-Origin':allowed.has(origin||'')?origin!:site,'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin'};
 const reply=(data:any,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(req.method==='OPTIONS')return new Response('ok',{headers});
 if(req.method!=='POST'||(origin&&!allowed.has(origin)))return reply({error:'Request not allowed'},403);
 try{
  // Publishable API key gates public requests; order receipts additionally require a 256-bit capability.
  const api=req.headers.get('apikey');
  if(api!=='sb_publishable_U6nbcH9-z7u_mth63-isbw_QwuVIWyr' && api!==Deno.env.get('SUPABASE_ANON_KEY'))return reply({error:'Application key required'},401);
  const raw=await req.text();if(raw.length>40000)return reply({error:'Request too large'},413);const b=JSON.parse(raw);
  if(b.action==='config')return reply({ok:true,payfast:config(),bank});
  if(b.action==='admin-list'){
   await admin(req);const {data,error}=await db.from('lp_orders').select('id,reference,customer_name,email,mobile,total_cents,method,status,expires_at,paid_at,created_at,email_status,payment_note,lp_order_items(*)').order('created_at',{ascending:false}).limit(200);if(error)throw error;return reply({ok:true,orders:data});
  }
  if(b.action==='admin-paid'){
   const user=await admin(req);if(!uuid(b.id)||!Number.isSafeInteger(b.amount)||clean(b.note).length<3)throw Error('Enter the bank amount and reconciliation note.');
   const {data,error}=await db.rpc('lp_settle_order',{p_id:b.id,p_amount:b.amount,p_admin:user.id,p_note:clean(b.note,500)});if(error)throw Error(error.message);return reply({ok:true,status:data});
  }
  if(b.action==='admin-fulfil'){
   await admin(req);if(!uuid(b.id)||!['confirmed','ready','dispatched','completed'].includes(b.status))throw Error('Invalid fulfilment update');
   const {data:item}=await db.from('lp_order_items').select('order_id').eq('id',b.id).single();if(!item)throw Error('Item not found');
   const {data:o}=await db.from('lp_orders').select('status').eq('id',item.order_id).single();if(o?.status!=='paid')throw Error('Verify payment before fulfilment.');
   const {error}=await db.from('lp_order_items').update({fulfilment_status:b.status}).eq('id',b.id);if(error)throw error;return reply({ok:true});
  }
  if(!tokenOk(b.token))throw Error('Your private order access key is missing. Please use the browser where you checked out.');
  const hash=sha(b.token);
  if(b.action==='create'){
   if(!uuid(b.requestKey)||!['eft','payfast'].includes(b.method)||b.consent!==true)throw Error('Complete checkout and consent.');
   if(b.method==='payfast'&&!config().ready)throw Error('Payfast is not enabled yet. Choose FNB EFT.');
   const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';
   const {data:permitted,error:rateError}=await db.rpc('lp_checkout_limit',{p_bucket:sha(ip+':'+Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))});
   if(rateError||!permitted)return reply({error:'Too many checkout attempts. Please try again later.'},429);
   const customer={name:clean(b.customer?.name),email:clean(b.customer?.email).toLowerCase(),mobile:clean(b.customer?.mobile,30)};
   if(!Array.isArray(b.items))throw Error('Your cart is empty.');
   const items=b.items.map((item:any)=>({id:item.id,quantity:item.quantity,details:{
    division:clean(item.details?.division,80),rulesAccepted:item.details?.rulesAccepted===true,
    participants:Array.isArray(item.details?.participants)?item.details.participants.slice(0,2).map((p:any)=>({name:clean(p.name),dob:clean(p.dob,10),level:clean(p.level,30)})):[],
    guardianName:clean(item.details?.guardianName),guardianMobile:clean(item.details?.guardianMobile,30),guardianConsent:item.details?.guardianConsent===true,
   }}));
   for(const i of items)for(const p of i.details.participants){const dt=new Date(p.dob);if(!/^\d{4}-\d{2}-\d{2}$/.test(p.dob)||!Number.isFinite(dt.getTime())||dt.toISOString().slice(0,10)!==p.dob||dt>new Date()||dt.getUTCFullYear()<1900)throw Error('Enter a valid participant date of birth.');}
   const {data,error}=await db.rpc('lp_create_order',{p_request:b.requestKey,p_hash:hash,p_customer:customer,p_method:b.method,p_items:items});
   if(error)throw Error(error.message);await emailReceipt(data.id);return reply({ok:true,order:data,bank});
  }
  if(b.action==='recover'){if(!uuid(b.requestKey))throw Error('Invalid request');const {data}=await db.from('lp_orders').select('id').eq('request_key',b.requestKey).eq('token_hash',hash).maybeSingle();return reply({ok:true,id:data?.id||null});}
  if(!uuid(b.id))throw Error('Invalid order reference');
  const {data:o,error}=await db.from('lp_orders').select('id,reference,token_hash,total_cents,status,method,expires_at,customer_name,email,email_status,lp_order_items(id,title,kind,quantity,unit_cents,details,fulfilment_status)').eq('id',b.id).maybeSingle();
  if(error||!o||!timingSafeEqual(Buffer.from(o.token_hash),Buffer.from(hash)))return reply({error:'Order not found or access key invalid'},404);
  if(b.action==='receipt'){const {token_hash,...safe}=o;return reply({ok:true,order:{...safe,status:o.status==='pending'&&new Date(o.expires_at)<new Date()?'expired':o.status},bank});}
  if(b.action==='payfast'){
   const conf=config();if(!conf.ready||o.method!=='payfast'||o.status!=='pending'||new Date(o.expires_at)<new Date())throw Error('This order is not available for Payfast payment.');
   const fields={merchant_id:Deno.env.get('PAYFAST_MERCHANT_ID')!,merchant_key:Deno.env.get('PAYFAST_MERCHANT_KEY')!,return_url:`${site}/cart?order=${o.id}`,cancel_url:`${site}/cart?order=${o.id}&cancelled=1`,notify_url:`${Deno.env.get('SUPABASE_URL')}/functions/v1/payfast-notify`,name_first:o.customer_name.slice(0,100),email_address:o.email,m_payment_id:o.id,amount:(o.total_cents/100).toFixed(2),item_name:`LP order ${o.reference}`};
   return reply({ok:true,url:conf.mode==='live'?'https://www.payfast.co.za/eng/process':'https://sandbox.payfast.co.za/eng/process',fields:{...fields,signature:sign(fields)}});
  }
  return reply({error:'Unknown action'},400);
 }catch(error){return reply({error:error instanceof Error?error.message:'Checkout failed. Please retry.'},400);}
});
