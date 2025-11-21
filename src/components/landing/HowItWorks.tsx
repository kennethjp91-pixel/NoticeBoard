"use client";

import { MapPin, Eye, PenTool } from "lucide-react";

export function HowItWorks() {
    return (
        <section className="py-20 bg-paper">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold font-marker mb-4">How it Works</h2>
                    <p className="text-ink/60">Simple, anonymous, and local.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-white border border-ink/10 flex items-center justify-center mb-6 shadow-sm">
                            <MapPin className="w-8 h-8 text-muted-red" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">1. Open the board</h3>
                        <p className="text-ink/70">
                            We use your location to show you a digital notice board for your immediate area (5-10km radius).
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-white border border-ink/10 flex items-center justify-center mb-6 shadow-sm">
                            <Eye className="w-8 h-8 text-muted-blue" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">2. Read notices</h3>
                        <p className="text-ink/70">
                            See what your neighbors are asking, offering, or feeling. No algorithms, just chronological notes.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-white border border-ink/10 flex items-center justify-center mb-6 shadow-sm">
                            <PenTool className="w-8 h-8 text-mustard" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">3. Post anonymously</h3>
                        <p className="text-ink/70">
                            Pin your own notice. No profile, no followers. Just your message and a rough location.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
