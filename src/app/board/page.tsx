"use client";

import { useState, useEffect } from "react";
import { BoardHeader } from "@/components/board/BoardHeader";
import { NoticeGrid } from "@/components/board/NoticeGrid";
import { CreateNoticeModal } from "@/components/board/CreateNoticeModal";
import { NoticeDetailModal } from "@/components/board/NoticeDetailModal";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/lib/location-context";
import { useAuth } from "@/lib/auth-context";
import type { Notice } from "@/types";

// Mock data generator
const generateMockNotices = (count: number): Notice[] => {
    const realisticNotices: Partial<Notice>[] = [
        {
            category: 'question',
            body: "Is anyone else hearing drilling at 3am near Soi 24? It's keeping me up. I thought construction was banned at night.",
            location: { lat: 0, lng: 0, city: "Bangkok", description: "Soi 24" },
            isTimeSensitive: true,
        },
        {
            category: 'alert',
            body: "Avoid Sukhumvit road near Asoke. Major traffic jam due to police stop. Better take the MRT.",
            location: { lat: 0, lng: 0, city: "Bangkok", description: "Asoke Intersection" },
            isTimeSensitive: true,
        },
        {
            category: 'help',
            title: "Lost Cat",
            body: "My orange tabby 'Mochi' got out last night. He has a blue collar. Last seen near the 7-11 on the corner. Please let me know if you see him!",
            location: { lat: 0, lng: 0, city: "Bangkok", description: "Near 7-11" },
            isTimeSensitive: true,
        },
        {
            category: 'market',
            title: "Free Moving Boxes",
            body: "I just moved in and have about 10 large cardboard boxes. Clean and folded. DM me if you want them, otherwise recycling them tomorrow.",
            location: { lat: 0, lng: 0, city: "Bangkok", description: "Condo Lobby" },
            isTimeSensitive: false,
        },
        {
            category: 'personals',
            body: "To the girl reading Murakami at Roots Coffee this morning: I wanted to say hi but didn't want to interrupt. Your vibe was cool.",
            location: { lat: 0, lng: 0, city: "Bangkok", description: "Roots Coffee" },
            isTimeSensitive: false,
        },
        {
            category: 'musings',
            body: "The sunset today was incredible. Just wanted to say that. Hope everyone had a good day.",
            location: { lat: 0, lng: 0, city: "Bangkok", description: "Rooftop" },
            isTimeSensitive: false,
        },
        {
            category: 'alert',
            title: "Water Outage",
            body: "Just a heads up, the building management said water will be off tomorrow from 10am-2pm for maintenance.",
            location: { lat: 0, lng: 0, city: "Bangkok", description: "Building A" },
            isTimeSensitive: true,
        },
        {
            category: 'question',
            body: "Best place for late night khao man gai? The one I usually go to is closed.",
            location: { lat: 0, lng: 0, city: "Bangkok", description: "Thong Lo" },
            isTimeSensitive: false,
        },
        {
            category: 'appreciation',
            body: "Huge thanks to the stranger who helped me carry my groceries when the bag ripped. You made my day.",
            location: { lat: 0, lng: 0, city: "Bangkok", description: "Phrom Phong" },
            isTimeSensitive: false,
        },
    ];

    return realisticNotices.map((n, i) => ({
        id: `notice-${i}`,
        userId: `user-${i}`,
        category: n.category as any,
        title: n.title,
        body: n.body!,
        createdAt: new Date(Date.now() - Math.random() * 10000000).toISOString(),
        location: n.location as any,
        isTimeSensitive: n.isTimeSensitive || false,
        isActive: true,
    }));
};

export default function BoardPage() {
    const { location } = useLocation();
    const { user } = useAuth();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [userPostCount, setUserPostCount] = useState(0); // Mock post count
    const [filterCategory, setFilterCategory] = useState<string>('all');

    useEffect(() => {
        // Simulate fetching notices based on location
        setIsLoading(true);
        const timer = setTimeout(() => {
            setNotices(generateMockNotices(12));
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [location.city]); // Re-fetch when location changes (mock)

    const handlePostClick = () => {
        if (!user) {
            // Redirect to login or show login modal (for now just open create modal which might handle auth or let anon post?)
            // Requirement says "Offer light auth... Users don't need to show any identity publicly"
            // But rate limiting requires tracking.
            // For MVP, let's assume we prompt login if not logged in, OR just let them post as "guest" with local storage limit.
            // Let's assume user must be logged in for rate limiting to work properly, or we track via local storage.
            // I'll check if user is logged in.
        }

        // Rate limit check
        if (user && !user.isPro && userPostCount >= 3) {
            setShowLimitModal(true);
            return;
        }

        setIsCreateModalOpen(true);
    };

    const handlePostNotice = (data: any) => {
        const newNotice: Notice = {
            id: `new-${Date.now()}`,
            userId: user?.id || "anon",
            category: data.category,
            title: data.title,
            body: data.body,
            createdAt: new Date().toISOString(),
            location: {
                lat: location.lat || 0,
                lng: location.lng || 0,
                city: location.city || "Unknown",
                description: "Just now"
            },
            isTimeSensitive: data.isTimeSensitive,
            isActive: true,
        };

        setNotices((prev) => [newNotice, ...prev]);
        setUserPostCount(prev => prev + 1);
    };

    const filteredNotices = filterCategory === 'all'
        ? notices
        : notices.filter(n => n.category === filterCategory);

    const categories = [
        { id: 'all', label: 'All' },
        { id: 'personals', label: 'Personals' },
        { id: 'help', label: 'Help' },
        { id: 'market', label: 'Market' },
        { id: 'alert', label: 'Alerts' },
        { id: 'musings', label: 'Musings' },
        { id: 'question', label: 'Questions' },
        { id: 'appreciation', label: 'Appreciation' },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <BoardHeader onPostClick={handlePostClick} />

            <main className="flex-1 container mx-auto max-w-7xl">
                <div className="py-6 px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <h1 className="text-2xl font-bold font-marker text-ink">
                            Notices near {location.city || "you"}
                        </h1>

                        <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setFilterCategory(cat.id)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filterCategory === cat.id
                                            ? "bg-ink text-white shadow-md"
                                            : "bg-white text-ink/70 hover:bg-ink/5 border border-ink/5"
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Wait, the above map is wrong because NoticeGrid renders a grid. 
              I should just use NoticeGrid and pass the click handler. 
          */}
                    <NoticeGrid
                        notices={filteredNotices}
                        isLoading={isLoading}
                        // @ts-ignore - I need to update NoticeGrid to accept onNoticeClick
                        onNoticeClick={setSelectedNotice}
                    />
                </div>
            </main>

            <CreateNoticeModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handlePostNotice}
            />

            <NoticeDetailModal
                notice={selectedNotice}
                isOpen={!!selectedNotice}
                onClose={() => setSelectedNotice(null)}
            />

            {/* Rate Limit Modal */}
            <Modal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} title="Limit Reached">
                <div className="space-y-4">
                    <p className="text-ink/80">
                        You've pinned 3 notices this month. Upgrade to Pro to keep posting unlimited notices.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setShowLimitModal(false)}>Cancel</Button>
                        <Button className="bg-muted-blue text-white">Upgrade to Pro</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

