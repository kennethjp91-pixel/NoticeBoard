"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NoticeCard } from "@/components/NoticeCard";
import type { Notice } from "@/types";

const DEMO_NOTICES: Notice[] = [
    {
        id: "1",
        userId: "demo1",
        category: "question",
        title: "Drilling noise?",
        body: "Is anyone else hearing drilling at 3am near Soi 24? It's keeping me up.",
        createdAt: new Date().toISOString(),
        location: { lat: 0, lng: 0, city: "Bangkok", description: "Soi 24" },
        isTimeSensitive: false,
        isActive: true,
    },
    {
        id: "2",
        userId: "demo2",
        category: "help",
        body: "Can anyone nearby help me call my landlord in Thai? My sink is leaking.",
        createdAt: new Date().toISOString(),
        location: { lat: 0, lng: 0, city: "Bangkok", description: "~0.5km away" },
        isTimeSensitive: true,
        isActive: true,
    },
];

export function Hero() {
    return (
        <section className="relative overflow-hidden py-20 md:py-32 bg-paper">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div className="max-w-2xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl font-bold tracking-tight sm:text-6xl font-marker text-ink mb-6"
                        >
                            Social media is loud. <br />
                            <span className="text-muted-blue">This is local and quiet.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-lg text-ink/80 mb-8 leading-relaxed max-w-md"
                        >
                            An anonymous notice board for the people around you — questions, needs, and thoughts within a few kilometers.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href="/board">
                                <Button size="lg" className="w-full sm:w-auto text-base">
                                    View notices near me
                                </Button>
                            </Link>
                            <Link href="/board?action=post">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                                    Post a notice
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    <div className="relative hidden lg:block h-[500px]">
                        {/* Decorative elements */}
                        <div className="absolute top-10 right-10 w-72 rotate-3 transform transition-transform hover:rotate-0 hover:scale-105 duration-300 z-20">
                            <NoticeCard notice={DEMO_NOTICES[0]} />
                        </div>
                        <div className="absolute top-40 right-40 w-72 -rotate-2 transform transition-transform hover:rotate-0 hover:scale-105 duration-300 z-10 opacity-90">
                            <NoticeCard notice={DEMO_NOTICES[1]} />
                        </div>
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-paper via-transparent to-transparent z-30 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Background texture hint */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] mix-blend-multiply"></div>
        </section>
    );
}
