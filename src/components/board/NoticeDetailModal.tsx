"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, MessageSquare, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { Notice } from "@/types";

interface NoticeDetailModalProps {
    notice: Notice | null;
    isOpen: boolean;
    onClose: () => void;
}

export function NoticeDetailModal({ notice, isOpen, onClose }: NoticeDetailModalProps) {
    const { user } = useAuth();

    if (!notice) return null;

    const timeAgo = new Date(notice.createdAt).toLocaleDateString();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" className="max-w-2xl">
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex gap-2 items-center">
                            <Badge variant={notice.category}>{notice.category}</Badge>
                            {notice.isTimeSensitive && (
                                <span className="text-xs font-bold text-muted-red animate-pulse">
                                    Urgent
                                </span>
                            )}
                        </div>
                        {notice.title && (
                            <h2 className="text-2xl font-bold font-marker">{notice.title}</h2>
                        )}
                    </div>
                    <div className="text-right text-xs text-ink/50 space-y-1">
                        <div className="flex items-center justify-end gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{timeAgo}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{notice.location.description}</span>
                        </div>
                    </div>
                </div>

                <div className="text-lg leading-relaxed text-ink/90 whitespace-pre-wrap">
                    {notice.body}
                </div>

                <div className="border-t border-ink/10 pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Replies
                    </h3>

                    {/* Mock Replies */}
                    <div className="space-y-4 mb-6">
                        <div className="bg-ink/5 p-3 rounded-sm text-sm">
                            <p className="text-ink/80">"I saw something similar near the 7-11. Hope you find it!"</p>
                            <span className="text-xs text-ink/40 mt-1 block">Neighbor • 2h ago</span>
                        </div>
                        <div className="bg-ink/5 p-3 rounded-sm text-sm">
                            <p className="text-ink/80">"Can help with this if you still need it."</p>
                            <span className="text-xs text-ink/40 mt-1 block">Neighbor • 5h ago</span>
                        </div>
                    </div>

                    {/* Private Reply CTA */}
                    <div className="bg-muted-blue/5 border border-muted-blue/20 rounded-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-muted-blue/10 p-2 rounded-full">
                                <Lock className="w-5 h-5 text-muted-blue" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-blue">Send a private reply</p>
                                <p className="text-xs text-ink/60">Only visible to the author.</p>
                            </div>
                        </div>
                        {user?.isPro ? (
                            <Button variant="default" className="bg-muted-blue hover:bg-muted-blue/90 text-white">
                                Reply Privately
                            </Button>
                        ) : (
                            <Button variant="outline" className="border-muted-blue text-muted-blue hover:bg-muted-blue/10">
                                Upgrade to Reply
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
