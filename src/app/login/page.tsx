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
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
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

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error with Google login:", error);
            alert("Failed to start Google login.");
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
                        <h1 className="font-marker text-3xl text-ink mb-2">
                            {mode === 'login' ? 'Welcome Back' : 'Join the Community'}
                        </h1>
                        <p className="text-ink/60">
                            {mode === 'login'
                                ? 'Sign in to post notices and manage your profile.'
                                : 'Create an account to start connecting with your neighbors.'}
                        </p>
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
                        <div className="space-y-6">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-11 font-medium border-ink/10 hover:bg-white"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                                {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-ink/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-paper px-2 text-ink/40">Or continue with email</span>
                                </div>
                            </div>

                            <form onSubmit={handleMagicLink} className="space-y-4">
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
                                        mode === 'login' ? "Send Magic Link" : "Sign Up with Email"
                                    )}
                                </Button>
                            </form>

                            <div className="text-center text-sm">
                                {mode === 'login' ? (
                                    <p className="text-ink/60">
                                        Don't have an account?{" "}
                                        <button
                                            onClick={() => setMode('signup')}
                                            className="font-semibold text-ink hover:underline focus:outline-none"
                                        >
                                            Sign up
                                        </button>
                                    </p>
                                ) : (
                                    <p className="text-ink/60">
                                        Already have an account?{" "}
                                        <button
                                            onClick={() => setMode('login')}
                                            className="font-semibold text-ink hover:underline focus:outline-none"
                                        >
                                            Log in
                                        </button>
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
