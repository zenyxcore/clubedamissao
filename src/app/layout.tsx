import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Clube da Missão · Grandes aventuras começam em casa', description: 'Uma carta misteriosa. Seis desafios. Um tesouro esperando por vocês. Transforme sua casa em uma aventura em família.', manifest:'/manifest.webmanifest', appleWebApp:{capable:true,statusBarStyle:'default',title:'Clube da Missão'}, icons: { icon: '/favicon.png',apple:'/icons/apple-touch-icon.png' } };
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#082b2e',viewportFit:'cover'};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="pt-BR"><body>{children}</body></html>; }
