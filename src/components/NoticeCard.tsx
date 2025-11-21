"use client";

import * as React from "react";
import { MapPin, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns"; // We might need to install date-fns or just use a simple helper
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Notice } from "@/types";

interface NoticeCardProps {
    notice: Notice;
    onClick?: () => void;
    className?: string;
}

export function NoticeCard({ notice, onClick, className }: NoticeCardProps) {
    // Deterministic color variant based on category
    const colorClass = React.useMemo(() => {
        const colors = {
            'help': 'bg-[var(--color-cat-help-bg)] border-[var(--color-cat-help-border)] text-[var(--color-cat-help-text)]',
            'personals': 'bg-[var(--color-cat-personals-bg)] border-[var(--color-cat-personals-border)] text-[var(--color-cat-personals-text)]',
            'alert': 'bg-[var(--color-cat-alert-bg)] border-[var(--color-cat-alert-border)] text-[var(--color-cat-alert-text)]',
            'market': 'bg-[var(--color-cat-market-bg)] border-[var(--color-cat-market-border)] text-[var(--color-cat-market-text)]',
            'musings': 'bg-[var(--color-cat-musings-bg)] border-[var(--color-cat-musings-border)] text-[var(--color-cat-musings-text)]',
            'appreciation': 'bg-[var(--color-cat-appreciation-bg)] border-[var(--color-cat-appreciation-border)] text-[var(--color-cat-appreciation-text)]',
            'question': 'bg-[var(--color-cat-question-bg)] border-[var(--color-cat-question-border)] text-[var(--color-cat-question-text)]',
        };
        return colors[notice.category] || 'bg-card border-ink/10';
    }, [notice.category]);

    const timeAgo = new Date(notice.createdAt).toLocaleDateString();

    return (
        <Card
            className={cn(
                "cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border shadow-sm rounded-lg overflow-hidden group",
                colorClass,
                className
            )}
            onClick={onClick}
        >
            <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex justify-between items-start">
                    <Badge
                        variant="outline"
                        className="bg-white/50 backdrop-blur-sm border-ink/10 text-ink/70 font-medium uppercase tracking-wide text-[10px]"
                    >
                        {notice.category}
                    </Badge>
                    {notice.isTimeSensitive && (
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-muted-red opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-muted-red"></span>
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pb-3 px-4">
                {notice.title && (
                    <h3 className="font-sans font-semibold text-lg mb-2 text-ink leading-tight">{notice.title}</h3>
                )}
                <p className="text-sm text-ink/80 line-clamp-4 leading-relaxed font-sans">
                    {notice.body}
                </p>
            </CardContent>
            <CardFooter className="px-4 py-3 border-t border-ink/5 bg-ink/[0.02] flex justify-between items-center text-[11px] text-ink/50 font-medium">
                <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 opacity-70" />
                    <span>{notice.location.description || "Nearby"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 opacity-70" />
                    <span>{timeAgo}</span>
                </div>
            </CardFooter>
        </Card>
    );
}
