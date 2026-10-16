import { NextResponse } from 'next/server';
import { hasSeason } from '@/server/season-access';
import content from '@/server/season-content.json';
export const runtime='nodejs';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){
 const headers={'Cache-Control':'private, no-store'};
 try{if(!await hasSeason())return NextResponse.json({error:'Ative sua compra para abrir esta aventura.'},{status:403,headers});
 const {id}=await params;if(!Object.hasOwn(content,id))return NextResponse.json({error:'Missão não encontrada.'},{status:404,headers});return NextResponse.json(content[id as keyof typeof content],{headers});
 }catch{return NextResponse.json({error:'Não foi possível conferir o acesso. Tente novamente.'},{status:503,headers});}
}
