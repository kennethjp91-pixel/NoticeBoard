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
        // Use Magic Link (Email OTP) as it works out of the box without Google Cloud setup
        const email = prompt("Enter your email to sign in (Magic Link):");
        if (!email) {
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/board`
                }
            });
            if (error) throw error;
            alert("Check your email for the magic link!");
        } catch (error) {
            console.error("Error signing in:", error);
            alert("Failed to send magic link.");
        } finally {
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
