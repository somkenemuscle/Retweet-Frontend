'use client';

import { useState, useEffect, useRef } from 'react';
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
    MoreHorizontal,
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from "@/lib/toast";
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
    const username = useUsername();
    const { isDialogOpen, setIsDialogOpen } = useDialogStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpen) return;
        const onClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [menuOpen]);

    const handleLogout = async () => {
        setMenuOpen(false);
        try {
            const res = await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
            localStorage.removeItem('username');
            window.dispatchEvent(new Event('storage'));
            toast.success(res.data.message);
        } catch (error) {
            console.error('Error occurred during logout:', error);
            toast.error('An error occurred during logout. Please try again.');
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
            <nav className="sticky top-0 hidden h-dvh w-[72px] shrink-0 flex-col items-center gap-1 px-2 py-3 sm:flex lg:w-[264px] lg:items-stretch lg:px-3">
                <Link
                    href="/"
                    aria-label="Retweet home"
                    className="mb-1 inline-flex w-fit items-center rounded-full p-2 transition-colors hover:bg-accent lg:mb-2"
                >
                    <span className="lg:hidden">
                        <LogoMark size={28} />
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
                            title={label}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                'group flex items-center gap-4 rounded-full p-3 text-[17px] transition-colors lg:w-fit lg:py-2.5 lg:pl-3 lg:pr-6',
                                active
                                    ? 'font-semibold text-foreground lg:bg-accent'
                                    : 'text-foreground/75 hover:bg-accent hover:text-foreground'
                            )}
                        >
                            <Icon
                                className={cn(
                                    'h-[26px] w-[26px] shrink-0 transition-transform group-active:scale-90',
                                    active && 'text-primary'
                                )}
                                strokeWidth={active ? 2.5 : 1.9}
                            />
                            <span className="hidden lg:inline">{label}</span>
                        </Link>
                    );
                })}

                <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="mt-3 h-12 w-12 rounded-full p-0 text-base font-semibold shadow-sm lg:w-full lg:px-6"
                >
                    <Feather className="h-5 w-5 lg:hidden" />
                    <span className="hidden lg:inline">Post</span>
                </Button>

                <div className="relative mt-auto" ref={menuRef}>
                    {menuOpen && username && (
                        <div className="absolute bottom-full left-0 mb-2 w-56 animate-scale-in overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl">
                            <Link
                                href={`/${username}`}
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                            >
                                <User className="h-4 w-4" /> View profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                            >
                                <LogOut className="h-4 w-4" /> Log out @{username}
                            </button>
                        </div>
                    )}

                    {username ? (
                        <button
                            onClick={() => setMenuOpen((o) => !o)}
                            className="flex w-full items-center gap-3 rounded-full p-2 transition-colors hover:bg-accent lg:pr-2"
                        >
                            <Avatar username={username} size={36} />
                            <div className="hidden min-w-0 flex-1 text-left lg:block">
                                <p className="truncate text-sm font-semibold">{username}</p>
                                <p className="truncate text-xs text-muted-foreground">@{username}</p>
                            </div>
                            <MoreHorizontal className="hidden h-4 w-4 text-muted-foreground lg:block" />
                        </button>
                    ) : (
                        <Link
                            href="/sign-in"
                            title="Sign in"
                            className="flex items-center gap-4 rounded-full p-3 text-[17px] text-foreground/75 transition-colors hover:bg-accent hover:text-foreground lg:py-2.5"
                        >
                            <LogIn className="h-[26px] w-[26px] shrink-0" strokeWidth={1.9} />
                            <span className="hidden lg:inline">Sign in</span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Create dialog */}
            {isDialogOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center bg-background/70 p-4 pt-[7vh] backdrop-blur-sm"
                    onClick={() => setIsDialogOpen(false)}
                >
                    <div
                        className="relative w-full max-w-xl animate-scale-in overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center px-3 py-2.5">
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
            <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-card/90 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden">
                {nav.map(({ href, label, icon: Icon }) => {
                    const active = isActive(href);
                    return (
                        <Link key={label} href={href} aria-label={label} className="relative p-3.5">
                            <Icon
                                className={cn('h-6 w-6', active ? 'text-primary' : 'text-muted-foreground')}
                                strokeWidth={active ? 2.5 : 1.9}
                            />
                            {active && (
                                <span className="absolute inset-x-0 -bottom-0 mx-auto h-[3px] w-6 rounded-full bg-primary" />
                            )}
                        </Link>
                    );
                })}
                <button onClick={() => setIsDialogOpen(true)} aria-label="Post" className="p-3.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Feather className="h-[18px] w-[18px]" />
                    </span>
                </button>
            </div>
        </>
    );
}
