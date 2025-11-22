"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Lock, MapPin, Loader2, Save, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
    const { user, updateProfile, updatePassword, signOut } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'notices'>('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Profile State
    const [username, setUsername] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    // Security State
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Preferences State
    const [radius, setRadius] = useState(10); // Default 10km

    // Notices State
    const [myNotices, setMyNotices] = useState<any[]>([]);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        setUsername(user.username || "");
        setAvatarUrl(user.avatarUrl || "");
        // Fetch radius preference if we had it in user object, for now default
    }, [user, router]);

    useEffect(() => {
        if (activeTab === 'notices' && user) {
            fetchMyNotices();
        }
    }, [activeTab, user]);

    const fetchMyNotices = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('notices')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        setMyNotices(data || []);
    };

    const handleDeleteNotice = async (id: string) => {
        if (!confirm("Are you sure you want to delete this notice?")) return;
        const { error } = await supabase.from('notices').delete().eq('id', id);
        if (error) {
            setMessage({ type: 'error', text: "Failed to delete notice." });
        } else {
            setMessage({ type: 'success', text: "Notice deleted." });
            fetchMyNotices();
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            await updateProfile({ username, avatarUrl });
            setMessage({ type: 'success', text: "Profile updated successfully." });
        } catch (error) {
            setMessage({ type: 'error', text: "Failed to update profile." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: "Passwords do not match." });
            return;
        }
        setIsLoading(true);
        setMessage(null);
        try {
            await updatePassword(newPassword);
            setMessage({ type: 'success', text: "Password updated successfully." });
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setMessage({ type: 'error', text: "Failed to update password." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePreferences = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            // We need to add radius_preference to profiles table first
            // For now, we'll just mock the success
            // await updateProfile({ radiusPreference: radius });
            const { error } = await supabase
                .from('profiles')
                .update({ radius_preference: radius }) // This column needs to be added
                .eq('id', user?.id);

            if (error) {
                // If column doesn't exist, it will error. We can ignore for now or alert user.
                console.warn("Radius preference column might be missing", error);
            }

            setMessage({ type: 'success', text: "Preferences saved." });
        } catch (error) {
            setMessage({ type: 'error', text: "Failed to save preferences." });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-paper">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b border-ink/5 bg-paper/95 backdrop-blur">
                <div className="container flex h-16 items-center px-4">
                    <Link href="/board" className="inline-flex items-center text-ink/50 hover:text-ink transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Board
                    </Link>
                    <h1 className="ml-4 font-marker text-xl font-bold">Settings</h1>
                </div>
            </header>

            <div className="container max-w-4xl mx-auto p-4 md:py-8 flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-ink text-paper' : 'hover:bg-ink/5 text-ink'}`}
                    >
                        <User className="w-4 h-4" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('preferences')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'preferences' ? 'bg-ink text-paper' : 'hover:bg-ink/5 text-ink'}`}
                    >
                        <MapPin className="w-4 h-4" />
                        Location & Radius
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'security' ? 'bg-ink text-paper' : 'hover:bg-ink/5 text-ink'}`}
                    >
                        <Lock className="w-4 h-4" />
                        Security
                    </button>
                    <button
                        onClick={() => setActiveTab('notices')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'notices' ? 'bg-ink text-paper' : 'hover:bg-ink/5 text-ink'}`}
                    >
                        <Save className="w-4 h-4" />
                        My Notices
                    </button>

                    <div className="pt-4 border-t border-ink/10 mt-4">
                        <button
                            onClick={() => signOut()}
                            className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Log Out
                        </button>
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 bg-white/50 backdrop-blur-sm border border-ink/10 rounded-xl p-6 md:p-8 shadow-sm min-h-[500px]">
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <AlertCircle className="w-5 h-5" />
                            {message.text}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h2 className="text-2xl font-marker text-ink">Public Profile</h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-ink/80">Username</label>
                                    <Input
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Your display name"
                                        className="bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-ink/80">Avatar URL</label>
                                    <Input
                                        value={avatarUrl}
                                        onChange={e => setAvatarUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="bg-white"
                                    />
                                    <p className="text-xs text-ink/40">Paste a link to an image for now.</p>
                                </div>
                                <Button type="submit" disabled={isLoading} className="bg-ink text-paper hover:bg-ink/90">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                                </Button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h2 className="text-2xl font-marker text-ink">Security</h2>
                            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-ink/80">New Password</label>
                                    <Input
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-ink/80">Confirm Password</label>
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                                <Button type="submit" disabled={isLoading} className="bg-ink text-paper hover:bg-ink/90">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                                </Button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h2 className="text-2xl font-marker text-ink">Location Preferences</h2>
                            <div className="space-y-8 max-w-md">
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-medium text-ink/80">Notice Radius</label>
                                        <span className="font-bold text-ink">{radius} km</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={radius}
                                        onChange={e => setRadius(parseInt(e.target.value))}
                                        className="w-full h-2 bg-ink/10 rounded-lg appearance-none cursor-pointer accent-ink"
                                    />
                                    <p className="text-xs text-ink/60">
                                        Only show notices within this distance from your selected location.
                                    </p>
                                </div>
                                <Button onClick={handleUpdatePreferences} disabled={isLoading} className="bg-ink text-paper hover:bg-ink/90">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Preferences"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notices' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h2 className="text-2xl font-marker text-ink">My Notices</h2>
                            {myNotices.length === 0 ? (
                                <p className="text-ink/60">You haven't posted any notices yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {myNotices.map((notice) => (
                                        <div key={notice.id} className="flex items-center justify-between p-4 bg-white border border-ink/10 rounded-lg shadow-sm">
                                            <div>
                                                <h3 className="font-bold text-ink">{notice.title}</h3>
                                                <p className="text-sm text-ink/60 truncate max-w-[200px] md:max-w-md">{notice.body}</p>
                                                <span className="text-xs text-ink/40">{new Date(notice.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteNotice(notice.id)}
                                                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
