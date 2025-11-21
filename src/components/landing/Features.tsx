"use client";

import { NoticeCard } from "@/components/NoticeCard";
import type { Notice } from "@/types";

const EXAMPLES: Notice[] = [
    {
        id: "e1",
        userId: "u1",
        category: "help",
        body: "Need someone to water my plants while I'm away next week. In exchange for cookies!",
        createdAt: new Date().toISOString(),
        location: { lat: 0, lng: 0, city: "Local", description: "Nearby" },
        isTimeSensitive: false,
        isActive: true,
    },
    {
        id: "e2",
        userId: "u2",
        category: "personals",
        body: "Anyone down to swap houseplants this weekend near EmQuartier?",
        createdAt: new Date().toISOString(),
        location: { lat: 0, lng: 0, city: "Local", description: "Nearby" },
        isTimeSensitive: false,
        isActive: true,
    },
    {
        id: "e3",
        userId: "u3",
        category: "alert",
        title: "Lost Cat",
        body: "Orange tabby seen wandering near the park entrance. Looks scared.",
        createdAt: new Date().toISOString(),
        location: { lat: 0, lng: 0, city: "Local", description: "Nearby" },
        isTimeSensitive: true,
        isActive: true,
    },
];

export function Features() {
    return (
        <section className="py-20 bg-white/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold font-marker mb-4">What is Human Notice Board?</h2>
                    <p className="text-lg text-ink/70">
                        It's a place to connect with your immediate surroundings without the noise of social media.
                        No algorithms, no influencers, just neighbors.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-center text-muted-blue">Ask for Help</h3>
                        <NoticeCard notice={EXAMPLES[0]} className="transform rotate-1" />
                        <p className="text-center text-sm text-ink/60 px-4">
                            Find a localized solution to a small problem.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-center text-mustard">Connect</h3>
                        <NoticeCard notice={EXAMPLES[1]} className="transform -rotate-1" />
                        <p className="text-center text-sm text-ink/60 px-4">
                            Find people with shared interests right around the corner.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-center text-muted-red">Alert & Inform</h3>
                        <NoticeCard notice={EXAMPLES[2]} className="transform rotate-1" />
                        <p className="text-center text-sm text-ink/60 px-4">
                            Share time-sensitive information with those who need to know.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
