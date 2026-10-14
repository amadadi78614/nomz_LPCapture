import {createContext,useContext,useState,useEffect} from 'react';
import {supabase} from '../lib/supabase';
const CartContext=createContext(null);
export const money=cents=>new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR'}).format((cents||0)/100);
export async function commerce(action,body={}){
 const {data,error}=await supabase.functions.invoke('commerce',{body:{action,...body}});
 if(error){let message=error.message;try{message=(await error.context.json()).error||message;}catch{}throw Error(message);}
 if(data?.error)throw Error(data.error);return data;
}
export async function catalog(){const {data,error}=await supabase.from('lp_catalog').select('*').eq('published',true).order('title');if(error)throw error;return data||[];}
export function CartProvider({children}){
 // The site's reliability guard uses full-page navigation. Keep a short-lived cart
 // in this tab so registrations survive moving between events, shop and checkout.
 const [items,setItems]=useState(()=>{try{const saved=JSON.parse(sessionStorage.getItem('lp-cart')||'null');return saved?.expires>Date.now()&&Array.isArray(saved.items)?saved.items:[];}catch{return [];}});
 useEffect(()=>{try{sessionStorage.setItem('lp-cart',JSON.stringify({items,expires:Date.now()+2*60*60*1000}));}catch{}},[items]);
 const add=(item,details={})=>setItems(old=>[...old,{key:crypto.randomUUID(),id:item.id,title:item.title,kind:item.kind,price:item.price_cents,quantity:1,details}]);
 const remove=key=>setItems(old=>old.filter(i=>i.key!==key));
 const quantity=(key,q)=>setItems(old=>old.map(i=>i.key===key?{...i,quantity:Math.max(1,Math.min(20,Number(q)||1))}:i));
 return <CartContext.Provider value={{items,add,remove,quantity,clear:()=>setItems([])}}>{children}</CartContext.Provider>;
}
export const useCart=()=>useContext(CartContext);
export function CartCount(){const {items}=useCart();return <>Cart{items.length?` (${items.length})`:''}</>;}
