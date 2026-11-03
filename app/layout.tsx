import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'OBW JO17-1 | Teamdashboard', description: 'De werkruimte voor OBW JO17-1, seizoen 2026–2027' };
export default function Layout({children}:Readonly<{children:React.ReactNode}>){return <html lang="nl"><body>{children}</body></html>}
