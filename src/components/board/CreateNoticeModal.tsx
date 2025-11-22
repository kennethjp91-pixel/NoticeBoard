"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "@/lib/location-context";
import { LocationSearch } from "@/components/LocationSearch";
import type { NoticeCategory } from "@/types";

const CATEGORIES: NoticeCategory[] = ['personals', 'help', 'alert', 'market', 'musings', 'appreciation', 'question'];

interface CreateNoticeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export function CreateNoticeModal({ isOpen, onClose, onSubmit }: CreateNoticeModalProps) {
    const { user } = useAuth();
    const { location: globalLocation } = useLocation();
    const [category, setCategory] = useState<NoticeCategory>('question');
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [isTimeSensitive, setIsTimeSensitive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lng: number; city: string } | null>(null);

    useEffect(() => {
        if (isOpen && globalLocation.lat && globalLocation.lng) {
            setLocation({
                lat: globalLocation.lat,
                lng: globalLocation.lng,
                city: globalLocation.city || "Unknown"
            });
        }
    }, [isOpen, globalLocation]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!body) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        onSubmit({
            category,
            title,
            body,
            isTimeSensitive,
            location: location || { lat: 0, lng: 0, city: "Unknown" } // Fallback
        });

        setIsSubmitting(false);
        onClose();
        // Reset form
        setTitle("");
        setBody("");
        setCategory('question');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Post a Notice">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-ink/70">Category</label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategory(cat)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${category === cat
                                    ? "bg-ink text-paper border-ink"
                                    : "bg-transparent text-ink border-ink/20 hover:border-ink/50"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-ink/70">Title (Optional)</label>
                    <Input
                        placeholder="e.g. Lost Cat"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={50}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-ink/70">Message</label>
                    <Textarea
                        placeholder="Write like you're pinning a note on a wall..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        maxLength={400}
                        className="min-h-[120px] resize-none"
                    />
                    <div className="text-xs text-right text-ink/40">
                        {body.length}/400
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-ink/70">Location</label>
                    <LocationSearch
                        onLocationSelect={(loc) => setLocation(loc)}
                        placeholder={location?.city || "Search city..."}
                        className="w-full"
                    />
                    <p className="text-xs text-ink/40">
                        Where is this happening? Defaults to your current location.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="urgent"
                        checked={isTimeSensitive}
                        onChange={(e) => setIsTimeSensitive(e.target.checked)}
                        className="rounded border-ink/20 text-muted-red focus:ring-muted-red"
                    />
                    <label htmlFor="urgent" className="text-sm text-ink/80 cursor-pointer select-none">
                        This is time-sensitive / urgent
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={!body || isSubmitting}>
                        {isSubmitting ? "Posting..." : "Post Notice"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
