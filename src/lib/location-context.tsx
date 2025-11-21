"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { LocationState } from "@/types";

interface LocationContextType {
    location: LocationState;
    setLocation: (location: LocationState) => void;
    requestLocation: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const DEFAULT_LOCATION: LocationState = {
    lat: 13.7563, // Bangkok default
    lng: 100.5018,
    city: "Bangkok",
    isManual: false,
};

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [location, setLocation] = useState<LocationState>(DEFAULT_LOCATION);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestLocation = async () => {
        setIsLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    city: "Current Location", // In a real app, we'd reverse geocode this
                    isManual: false,
                });
                setIsLoading(false);
            },
            (err) => {
                setError("Unable to retrieve your location");
                setIsLoading(false);
                console.error(err);
            }
        );
    };

    return (
        <LocationContext.Provider value={{ location, setLocation, requestLocation, isLoading, error }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error("useLocation must be used within a LocationProvider");
    }
    return context;
}
