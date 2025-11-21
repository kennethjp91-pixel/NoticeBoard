"use client";

import { LocationProvider } from "@/lib/location-context";

export default function BoardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LocationProvider>
            <div className="min-h-screen bg-paper">
                {children}
            </div>
        </LocationProvider>
    );
}
