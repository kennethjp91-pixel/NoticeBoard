"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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
        // Simulate checking session
        const timer = setTimeout(() => {
            const storedUser = localStorage.getItem("hnb_user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const signIn = async () => {
        setIsLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockUser: User = {
            id: "user_" + Math.random().toString(36).substr(2, 9),
            email: "demo@example.com",
            isPro: false,
            createdAt: new Date().toISOString(),
        };

        setUser(mockUser);
        localStorage.setItem("hnb_user", JSON.stringify(mockUser));
        setIsLoading(false);
    };

    const signOut = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setUser(null);
        localStorage.removeItem("hnb_user");
        setIsLoading(false);
    };

    const upgradeToPro = async () => {
        if (!user) return;
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedUser = { ...user, isPro: true };
        setUser(updatedUser);
        localStorage.setItem("hnb_user", JSON.stringify(updatedUser));
        setIsLoading(false);
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
