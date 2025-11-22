"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Search, Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "@/lib/location-context";
import { cn } from "@/lib/utils";

interface LocationSearchProps {
    onLocationSelect?: (location: { lat: number; lng: number; city: string }) => void;
    className?: string;
    placeholder?: string;
}

export function LocationSearch({ onLocationSelect, className, placeholder = "Search city..." }: LocationSearchProps) {
    const { location, requestLocation } = useLocation();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 3) {
                setResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data);
                setIsOpen(true);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (item: any) => {
        const city = item.address?.city || item.address?.town || item.address?.village || item.display_name.split(',')[0];
        const newLoc = {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            city: city
        };

        if (onLocationSelect) {
            onLocationSelect(newLoc);
        }
        setQuery("");
        setIsOpen(false);
    };

    const handleCurrentLocation = () => {
        requestLocation();
        // We rely on the context to update, but if onLocationSelect is passed, 
        // we might want to trigger it after location is found. 
        // For now, simpler to just let context handle the global state.
        if (onLocationSelect && location.lat && location.lng) {
            onLocationSelect({ lat: location.lat, lng: location.lng, city: location.city || "Current Location" });
        }
    };

    return (
        <div ref={wrapperRef} className={cn("relative group", className)}>
            <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-ink/40 pointer-events-none" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="pl-9 pr-9 bg-white/80 border-ink/10 focus:bg-white transition-all hover:border-ink/30 rounded-full shadow-sm"
                />
                {isSearching ? (
                    <Loader2 className="absolute right-3 w-4 h-4 animate-spin text-ink/40" />
                ) : (
                    <button
                        onClick={handleCurrentLocation}
                        className="absolute right-2 p-1.5 rounded-full hover:bg-ink/10 text-ink/40 hover:text-muted-blue transition-colors"
                        title="Use Current Location"
                    >
                        <Navigation className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-ink/10 overflow-hidden z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                    <button
                        onClick={handleCurrentLocation}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-3 text-sm font-medium text-muted-blue border-b border-ink/5 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Navigation className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="block">Use Current Location</span>
                            <span className="text-xs text-ink/40 font-normal">Find posts near me</span>
                        </div>
                    </button>

                    {results.length > 0 ? (
                        results.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => handleSelect(item)}
                                className="w-full text-left px-4 py-3 hover:bg-ink/5 text-sm text-ink flex items-center gap-3 transition-colors"
                            >
                                <MapPin className="w-4 h-4 text-ink/30" />
                                <span className="truncate">{item.display_name}</span>
                            </button>
                        ))
                    ) : query.length > 2 && !isSearching ? (
                        <div className="px-4 py-3 text-sm text-ink/40 text-center">No results found</div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
