import { NextRequest, NextResponse } from 'next/server';
import { createSeasonSession, clearSeasonSession, getOrder, hasSeason, seasonConfigured } from '@/server/season-access';
import { grantsSeason, validOrderId } from '@/server/purchase-policy';
export const runtime='nodejs';
const headers={'Cache-Control':'private, no-store'};
export async function GET(){try{return NextResponse.json({unlocked:await hasSeason(),configured:seasonConfigured()},{headers});}catch{return NextResponse.json({unlocked:false,error:'Não foi possível conferir seu acesso agora. Tente novamente.'},{status:503,headers});}}
export async function POST(request:NextRequest){
 if(request.headers.get('origin')!==request.nextUrl.origin)return NextResponse.json({error:'Solicitação inválida.'},{status:403,headers});
 if(!seasonConfigured())return NextResponse.json({error:'A ativação está temporariamente indisponível. Seu pagamento não será solicitado novamente. Tente mais tarde ou fale com o suporte da compra.'},{status:503,headers});
 if(Number(request.headers.get('content-length')||0)>4096)return NextResponse.json({error:'Dados inválidos.'},{status:400,headers});
 try{const body=await request.json();const email=typeof body.email==='string'?body.email.trim():'';const orderId=typeof body.orderId==='string'?body.orderId.trim():'';
 if(!validOrderId(orderId)||!/^\S+@\S+\.\S+$/.test(email)||email.length>254)return NextResponse.json({error:'Confira o e-mail e o ID completo do pedido do pacote.'},{status:400,headers});
 const order=await getOrder(orderId);if(!order||!grantsSeason(order,process.env.CAKTO_SEASON_PRODUCT_ID!,email))return NextResponse.json({error:'Não foi possível validar uma compra aprovada do pacote com esses dados. Confira o pedido do upsell e aguarde a aprovação do pagamento.'},{status:403,headers});
 await createSeasonSession(orderId);return NextResponse.json({unlocked:true},{headers});
 }catch{return NextResponse.json({error:'Não foi possível consultar sua compra agora. Aguarde e tente novamente.'},{status:503,headers});}
}
export async function DELETE(request:NextRequest){if(request.headers.get('origin')!==request.nextUrl.origin)return NextResponse.json({error:'Solicitação inválida.'},{status:403,headers});await clearSeasonSession();return NextResponse.json({unlocked:false},{headers});}
