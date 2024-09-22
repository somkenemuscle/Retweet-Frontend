import '../home.css'

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <main  style={{ backgroundColor: 'black', color: 'white' }}>
            {children}
        </main>
    );
}
