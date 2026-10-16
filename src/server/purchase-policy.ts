export type CaktoOrder = {id?:string;status?:string;product?:{id?:string};customer?:{email?:string};refundedAt?:string|null;chargedbackAt?:string|null;canceledAt?:string|null};
export function grantsSeason(order:CaktoOrder,productId:string,email?:string):boolean {
 return !!productId && order.status==='paid' && order.product?.id===productId && !order.refundedAt && !order.chargedbackAt && !order.canceledAt && (!email || order.customer?.email?.trim().toLowerCase()===email.trim().toLowerCase());
}
export const validOrderId=(id:string)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
