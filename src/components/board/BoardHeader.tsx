"use client";

import Link from "next/link";
import { MapPin, Bell, User as UserIcon, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/lib/location-context";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
// Actually, I'll just use a simple state-based dropdown here.

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

function UserDropdown() {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) {
        return (
            <Link href="/login">
                <Button size="sm" variant="outline">Log in</Button>
            </Link>
        );
    }

    return (
        <div className="relative" ref={ref}>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full bg-ink/5 hover:bg-ink/10"
            >
                <UserIcon className="h-5 w-5" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50 py-1">
                    <div className="px-4 py-2 border-b border-ink/5">
                        <p className="text-sm font-medium text-ink">{user.email}</p>
                        <p className="text-xs text-ink/50">{user.isPro ? "Pro Member" : "Free Plan"}</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-ink hover:bg-ink/5 transition-colors">
                        Settings
                    </button>
                    {!user.isPro && (
                        <button className="w-full text-left px-4 py-2 text-sm text-muted-blue font-medium hover:bg-muted-blue/5 transition-colors">
                            Upgrade to Pro
                        </button>
                    )}
                    <div className="border-t border-ink/5 my-1"></div>
                    <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2 text-sm text-muted-red hover:bg-muted-red/5 transition-colors flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}

export function BoardHeader({ onPostClick }: { onPostClick: () => void }) {
    const { location, requestLocation } = useLocation();

    return (
        <header className="sticky top-0 z-40 w-full border-b border-ink/5 bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/60">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="font-marker text-xl font-bold hidden md:block">
                        HNB
                    </Link>
                    <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-ink/5 text-sm text-ink/80 cursor-pointer hover:bg-white transition-colors" onClick={requestLocation}>
                        <MapPin className="h-4 w-4 text-muted-red" />
                        <span>{location.city || "Locating..."}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    <Button
                        onClick={onPostClick}
                        className="bg-ink text-paper hover:bg-ink/90 shadow-sm font-marker tracking-wide"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Post Notice
                    </Button>
                    <Button onClick={onPostClick} size="icon" className="md:hidden shadow-sm rounded-full">
                        <Plus className="h-4 w-4" />
                    </Button>
                    <UserDropdown />
                </div>
            </div>
        </header>
    );
}
