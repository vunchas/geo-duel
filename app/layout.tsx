import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Atlas dvikova · Geografija dviem",description:"Atpažink 86 valstybes žemėlapyje ir išmok 68 sostines. Dvikova dviem telefonams ir asmeninė treniruotė.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export const viewport: Viewport = {themeColor:"#0a092d"};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="lt" className="dark"><body>{children}</body></html>}
