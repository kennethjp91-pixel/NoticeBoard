"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { signIn, signUp } = useAuth();
    const router = useRouter();

    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            if (mode === 'login') {
                await signIn(email, password);
                // Force a router refresh to ensure auth state is picked up
                router.refresh();
                router.push('/board');
            } else {
                await signUp(email, password);
                setSuccessMessage("Account created! Please check your email to confirm your account.");
                setMode('login');
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            if (err.message === "Invalid login credentials") {
                setError("Incorrect email or password.");
            } else {
                setError(err.message || "An error occurred. Please try again.");
            }
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
            setError("Failed to start Google login.");
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
                                ? 'Sign in to access your notices.'
                                : 'Create an account to start posting.'}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-11 font-medium border-ink/10 hover:bg-white relative"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            <svg className="mr-2 h-4 w-4 absolute left-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                            <span className="w-full text-center">
                                {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                            </span>
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-ink/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-paper px-2 text-ink/40">Or continue with email</span>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-green-50 text-green-600 text-sm p-3 rounded-md flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
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

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-ink/80">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
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
                                        {mode === 'login' ? "Signing in..." : "Creating Account..."}
                                    </>
                                ) : (
                                    mode === 'login' ? "Log In" : "Sign Up"
                                )}
                            </Button>
                        </form>

                        <div className="text-center pt-2">
                            {mode === 'login' ? (
                                <div className="space-y-2">
                                    <p className="text-ink/60 text-sm">
                                        Don't have an account?
                                    </p>
                                    <button
                                        onClick={() => { setMode('signup'); setError(null); }}
                                        className="text-base font-bold text-ink hover:text-muted-blue transition-colors"
                                    >
                                        Sign up here!
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-ink/60 text-sm">
                                        Already have an account?
                                    </p>
                                    <button
                                        onClick={() => { setMode('login'); setError(null); }}
                                        className="text-base font-bold text-ink hover:text-muted-blue transition-colors"
                                    >
                                        Log in here!
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
