'use client'
import '../home.css'
import Navbar from '@/components/shared/Sidebar';


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <main  style={{ backgroundColor: 'black', color: 'white' }}>
      <Navbar />
            {children}
        </main>
    );
}
