'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Search,
    Bookmark,
    User,
    LogOut,
    LogIn,
    Feather,
    X,
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useToast } from '@/hooks/use-toast';
import { useDialogStore } from '@/store/dialogStore';
import CreateInteractionForm from '../forms/createTweetForm';
import Logo, { LogoMark } from './Logo';
import Avatar from '../ui/Avatar';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

function useUsername() {
    const [username, setUsername] = useState<string | null>(null);
    useEffect(() => {
        setUsername(localStorage.getItem('username'));
        const sync = () => setUsername(localStorage.getItem('username'));
        window.addEventListener('storage', sync);
        return () => window.removeEventListener('storage', sync);
    }, []);
    return username;
}

export default function Sidebar() {
    const pathname = usePathname();
    const { toast } = useToast();
    const username = useUsername();
    const { isDialogOpen, setIsDialogOpen } = useDialogStore();

    const handleLogout = async () => {
        try {
            const res = await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
            localStorage.removeItem('username');
            window.dispatchEvent(new Event('storage'));
            toast({ className: 'shadcn-toast-success', description: res.data.message });
        } catch (error) {
            console.error('Error occurred during logout:', error);
            toast({
                className: 'shadcn-toast-failure',
                description: 'An error occurred during logout. Please try again.',
            });
        }
    };

    const nav = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/search', label: 'Search', icon: Search },
        { href: username ? `/${username}/saved-posts` : '/sign-in', label: 'Saves', icon: Bookmark },
        { href: username ? `/${username}` : '/sign-in', label: 'Profile', icon: User },
    ];

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href.split('?')[0]);

    return (
        <>
            {/* Desktop / tablet rail */}
            <nav className="sticky top-0 hidden h-dvh shrink-0 flex-col gap-1 px-2 py-3 sm:flex lg:w-[264px] lg:px-3">
                <Link
                    href="/"
                    aria-label="Retweet home"
                    className="mb-2 inline-flex items-center rounded-full p-2 transition-colors hover:bg-accent"
                >
                    <span className="lg:hidden">
                        <LogoMark size={30} />
                    </span>
                    <span className="hidden lg:inline-flex">
                        <Logo size={30} />
                    </span>
                </Link>

                {nav.map(({ href, label, icon: Icon }) => {
                    const active = isActive(href);
                    return (
                        <Link
                            key={label}
                            href={href}
                            className={cn(
                                'group flex items-center gap-4 rounded-full px-3 py-2.5 text-[17px] transition-colors hover:bg-accent lg:pr-6',
                                active ? 'font-semibold text-foreground' : 'text-foreground/80'
                            )}
                        >
                            <Icon
                                className={cn('h-6 w-6 shrink-0', active && 'text-primary')}
                                strokeWidth={active ? 2.6 : 2}
                            />
                            <span className="hidden lg:inline">{label}</span>
                        </Link>
                    );
                })}

                <Button
                    onClick={() => setIsDialogOpen(true)}
                    size="lg"
                    className="mt-3 h-12 w-12 rounded-full p-0 lg:h-12 lg:w-full lg:px-6"
                >
                    <Feather className="h-5 w-5 lg:hidden" />
                    <span className="hidden lg:inline">Post</span>
                </Button>

                <div className="mt-auto">
                    {username ? (
                        <div className="flex items-center gap-3 rounded-full p-2 lg:pr-3">
                            <Avatar username={username} size={38} />
                            <div className="hidden min-w-0 flex-1 lg:block">
                                <p className="truncate text-sm font-semibold">{username}</p>
                                <p className="truncate text-xs text-muted-foreground">@{username}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                aria-label="Log out"
                                className="hidden rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:inline-flex"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/sign-in"
                            className="flex items-center gap-4 rounded-full px-3 py-2.5 text-[17px] text-foreground/80 transition-colors hover:bg-accent"
                        >
                            <LogIn className="h-6 w-6 shrink-0" />
                            <span className="hidden lg:inline">Sign in</span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Create dialog */}
            {isDialogOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/40 p-4 pt-[8vh] backdrop-blur-sm"
                    onClick={() => setIsDialogOpen(false)}
                >
                    <div
                        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-4 px-4 py-3">
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                aria-label="Close"
                                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <CreateInteractionForm action="Add" />
                    </div>
                </div>
            )}

            {/* Mobile bottom bar */}
            <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-card/95 backdrop-blur sm:hidden">
                {nav.map(({ href, label, icon: Icon }) => (
                    <Link key={label} href={href} aria-label={label} className="p-3.5">
                        <Icon
                            className={cn(
                                'h-6 w-6',
                                isActive(href) ? 'text-primary' : 'text-muted-foreground'
                            )}
                            strokeWidth={isActive(href) ? 2.6 : 2}
                        />
                    </Link>
                ))}
                <button
                    onClick={() => setIsDialogOpen(true)}
                    aria-label="Post"
                    className="p-3.5"
                >
                    <Feather className="h-6 w-6 text-muted-foreground" />
                </button>
            </div>
        </>
    );
}
