"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";
import type { User } from "@/types";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    upgradeToPro: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
    updatePassword: (password: string) => Promise<void>;
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

    const signIn = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } catch (error: any) {
            console.error("Error signing in:", error);
            // Throw error so the UI can display it
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            console.error("Error signing up:", error);
            throw error;
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

    const updateProfile = async (updates: Partial<User>) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    username: updates.username,
                    avatar_url: updates.avatarUrl,
                    // radius_preference will be added here later
                })
                .eq('id', user.id);

            if (error) throw error;

            setUser({ ...user, ...updates });
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    };

    const updatePassword = async (password: string) => {
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
        } catch (error) {
            console.error("Error updating password:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, upgradeToPro, updateProfile, updatePassword }}>
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
