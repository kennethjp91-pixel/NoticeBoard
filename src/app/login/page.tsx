"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/board`,
                },
            });

            if (error) throw error;
            setIsSent(true);
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Failed to send magic link. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link
                    href="/"
                    className="inline-flex items-center text-ink/50 hover:text-ink mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <div className="bg-white/50 backdrop-blur-sm border border-ink/10 rounded-xl p-8 shadow-sm">
                    <div className="text-center mb-8">
                        <h1 className="font-marker text-3xl text-ink mb-2">Welcome Back</h1>
                        <p className="text-ink/60">Sign in to post notices and manage your profile.</p>
                    </div>

                    {isSent ? (
                        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-ink">Check your inbox!</h3>
                            <p className="text-ink/70">
                                We sent a magic link to <strong>{email}</strong>.<br />
                                Click it to sign in instantly.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => setIsSent(false)}
                            >
                                Use a different email
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-ink/80">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white border-ink/10 focus:border-ink/30"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-ink text-paper hover:bg-ink/90 font-medium h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending Link...
                                    </>
                                ) : (
                                    "Send Magic Link"
                                )}
                            </Button>

                            <p className="text-xs text-center text-ink/40 mt-4">
                                No password required. We'll send you a secure link to log in.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
