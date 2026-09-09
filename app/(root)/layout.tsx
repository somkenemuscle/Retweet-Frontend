import Sidebar from '@/components/shared/Sidebar';
import RightRail from '@/components/shared/RightRail';

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="dark min-h-dvh bg-background text-foreground">
            <div className="mx-auto flex w-full max-w-[1290px] justify-center">
                <Sidebar />

                {/* Feed column */}
                <main className="min-h-dvh w-full min-w-0 max-w-[600px] border-border pb-20 sm:border-x sm:pb-0">
                    {children}
                </main>

                {/* Right rail */}
                <aside className="sticky top-0 hidden w-[340px] shrink-0 lg:block">
                    <RightRail />
                </aside>
            </div>
        </div>
    );
}
