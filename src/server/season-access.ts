import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { grantsSeason, validOrderId, type CaktoOrder } from './purchase-policy';
const COOKIE='clube-season';
let token:{value:string;until:number}|undefined;
let pendingToken:Promise<string>|undefined;
export function seasonConfigured(){return !!(process.env.CAKTO_CLIENT_ID&&process.env.CAKTO_CLIENT_SECRET&&process.env.CAKTO_SEASON_PRODUCT_ID&&process.env.SEASON_SESSION_SECRET&&process.env.SEASON_SESSION_SECRET.length>=32);}
async function accessToken(){
 if(token&&token.until>Date.now())return token.value;
 if(pendingToken)return pendingToken;
 pendingToken=(async()=>{const response=await fetch('https://api.cakto.com.br/public_api/token/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:process.env.CAKTO_CLIENT_ID!,client_secret:process.env.CAKTO_CLIENT_SECRET!}),cache:'no-store',signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw new Error('provider_unavailable');const data=await response.json();if(typeof data.access_token!=='string'||!data.access_token)throw new Error('provider_unavailable');token={value:data.access_token,until:Date.now()+Math.max(0,Math.min(Number(data.expires_in)||0,36000)-60)*1000};return token.value;})();
 try{return await pendingToken;}finally{pendingToken=undefined;}
}
export async function getOrder(id:string):Promise<CaktoOrder|null>{
 if(!seasonConfigured()||!validOrderId(id))return null;
 const bearer=await accessToken();const response=await fetch(`https://api.cakto.com.br/public_api/orders/${encodeURIComponent(id)}/`,{headers:{Authorization:`Bearer ${bearer}`},cache:'no-store',signal:AbortSignal.timeout(10000)});
 if(response.status===404)return null;if(response.status===401){token=undefined;throw new Error('provider_unavailable');}if(!response.ok)throw new Error('provider_unavailable');return response.json();
}
const secret=()=>new TextEncoder().encode(process.env.SEASON_SESSION_SECRET!);
export async function createSeasonSession(orderId:string){
 if(!seasonConfigured())throw new Error('not_configured');
 const session=await new SignJWT({orderId}).setProtectedHeader({alg:'HS256'}).setIssuer('clube-da-missao').setAudience('season').setIssuedAt().setExpirationTime('7d').sign(secret());
 (await cookies()).set(COOKIE,session,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:7*86400});
}
export async function hasSeason(){
 if(!seasonConfigured())return false;
 const value=(await cookies()).get(COOKIE)?.value;if(!value)return false;
 let id:string;try{const {payload}=await jwtVerify(value,secret(),{algorithms:['HS256'],issuer:'clube-da-missao',audience:'season'});if(typeof payload.orderId!=='string')return false;id=payload.orderId;}catch{return false;}
 const order=await getOrder(id);return !!order&&grantsSeason(order,process.env.CAKTO_SEASON_PRODUCT_ID!);
}
export async function clearSeasonSession(){(await cookies()).delete(COOKIE);}
