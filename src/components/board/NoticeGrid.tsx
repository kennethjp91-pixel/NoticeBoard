"use client";

import { NoticeCard } from "@/components/NoticeCard";
import type { Notice } from "@/types";

interface NoticeGridProps {
    notices: Notice[];
    isLoading: boolean;
    onNoticeClick?: (notice: Notice) => void;
}

export function NoticeGrid({ notices, isLoading, onNoticeClick }: NoticeGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-48 bg-black/5 rounded-sm animate-pulse" />
                ))}
            </div>
        );
    }

    if (notices.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-16 h-16 bg-ink/5 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">📌</span>
                </div>
                <h3 className="text-xl font-marker mb-2">The board is empty here.</h3>
                <p className="text-ink/60 max-w-md">
                    Be the first to pin something. Your neighbors will see it when they pass by.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 pb-20">
            {notices.map((notice) => (
                <NoticeCard
                    key={notice.id}
                    notice={notice}
                    onClick={() => onNoticeClick?.(notice)}
                />
            ))}
        </div>
    );
}
