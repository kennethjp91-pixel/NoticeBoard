"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-ink/5 bg-paper/80 backdrop-blur-md">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-marker text-xl font-bold">Human Notice Board</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink/80">
                    <Link href="#how-it-works" className="hover:text-ink transition-colors">How it Works</Link>
                    <Link href="#pricing" className="hover:text-ink transition-colors">Membership</Link>
                    <Link href="#faq" className="hover:text-ink transition-colors">FAQ</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" size="sm">Log in</Button>
                    </Link>
                    <Link href="/board">
                        <Button size="sm">Open Board</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
