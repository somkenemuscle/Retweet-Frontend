'use client'
import '../home.css'
import Sidebar from '@/components/shared/Sidebar';

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <main style={{ backgroundColor: 'black', color: 'white' }}>
            <Sidebar />
            {children}
        </main>
    );
}
