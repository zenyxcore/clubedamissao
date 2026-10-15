import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Clube da Missão · Grandes aventuras começam em casa', description: 'Uma carta misteriosa. Seis desafios. Um tesouro esperando por vocês. Transforme sua casa em uma aventura em família.', icons: { icon: '/favicon.png' } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="pt-BR"><body>{children}</body></html>; }
