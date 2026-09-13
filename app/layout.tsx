import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Atlas dvikova · Geografija dviem",description:"Atpažink 86 valstybes žemėlapyje ir išmok 68 sostines. Dvikova dviem telefonams ir asmeninė treniruotė.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="lt"><body>{children}</body></html>}
