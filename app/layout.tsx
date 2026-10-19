import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Creative Studio — Your ideas, developed',description:'An open creative workspace for creative industry students. Explore, develop and reflect on your own ideas.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
