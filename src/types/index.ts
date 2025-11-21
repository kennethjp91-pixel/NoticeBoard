export type User = {
    id: string;
    email: string;
    isPro: boolean;
    createdAt: string;
};

export type NoticeCategory = 'help' | 'personals' | 'alert' | 'market' | 'musings' | 'appreciation' | 'question';

export type Notice = {
    id: string;
    userId: string;
    category: NoticeCategory;
    title?: string;
    body: string;
    createdAt: string;
    location: {
        lat: number;
        lng: number;
        city: string;
        description?: string; // e.g. "Near Soi 39"
    };
    isTimeSensitive: boolean;
    isActive: boolean;
    replyCount?: number;
};

export type LocationState = {
    lat: number | null;
    lng: number | null;
    city: string | null;
    isManual: boolean;
};
