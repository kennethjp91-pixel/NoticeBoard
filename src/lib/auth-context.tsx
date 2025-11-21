"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";
import type { User } from "@/types";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    upgradeToPro: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check active session
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    // Fetch profile
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    setUser({
                        id: session.user.id,
                        email: session.user.email!,
                        isPro: profile?.is_pro || false,
                        createdAt: session.user.created_at,
                    });
                }
            } catch (error) {
                console.error("Error checking session:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                setUser({
                    id: session.user.id,
                    email: session.user.email!,
                    isPro: profile?.is_pro || false,
                    createdAt: session.user.created_at,
                });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async () => {
        setIsLoading(true);
        // For MVP, we'll use anonymous sign-in or magic link. 
        // Let's use anonymous for "quiet" feel if possible, or just Google/Email.
        // The user didn't specify auth method, but "light auth" implies easy.
        // Let's try Google for now as it's standard, or just a simple email OTP.
        // Actually, for "Human Notice Board", maybe just anonymous?
        // But we need to track users.
        // Let's stick to Google for simplicity in this demo, or just warn if not configured.
        // Wait, the prompt said "Light auth... Users don't need to show any identity publicly".
        // I'll implement a simple "Sign in with Google" or just a placeholder that *calls* supabase.auth.signInWithOAuth.

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/board`
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error signing in:", error);
            alert("Failed to sign in. Make sure Google Auth is enabled in Supabase.");
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        setIsLoading(true);
        await supabase.auth.signOut();
        setUser(null);
        setIsLoading(false);
    };

    const upgradeToPro = async () => {
        if (!user) return;
        // In a real app, this would redirect to Stripe.
        // For MVP, we'll just update the profile in Supabase.
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_pro: true })
                .eq('id', user.id);

            if (error) throw error;

            // Optimistic update
            setUser({ ...user, isPro: true });
        } catch (error) {
            console.error("Error upgrading:", error);
            alert("Failed to upgrade.");
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut, upgradeToPro }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
