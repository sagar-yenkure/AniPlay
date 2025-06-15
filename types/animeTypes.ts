export interface Anime {
    id: number;
    title: {
        english: string;
        romaji: string;
        native: string;
    };
    coverImage: {
        extraLarge: string;
        large: string;
        medium: string;
        color: string;
    };
    bannerImage: string;
    season: string;
    seasonYear: number;
    description: string;
    episodes: number;
    duration: number;
    genres: string[];
    averageScore: number;
    popularity: number;
    status: string;
    format: string;
    startDate: {
        year: number;
        month: number;
        day: number;
    };
    endDate: {
        year: number;
        month: number;
        day: number;
    };
    studios: {
        nodes: {
            id: number;
            name: string;
            isAnimationStudio: boolean;
        }[];
    };
    characters: {
        nodes: {
            id: number;
            name: {
                full: string;
            };
            image: {
                large: string;
            };
            gender: string;
            description: string;
            role: string;
        }[];
    };
    trailer: {
        id: string;
        site: string;
    };
    tags: {
        id: number;
        name: string;
        rank: number;
    }[];
}

export interface PageInfo {
    total: number;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
    perPage: number;
}

export interface AnimeListResponse {
    Page: {
        pageInfo: PageInfo;
        media: Anime[];
    };
}

export interface AnimeResponse {
    Media: Anime;
}

export interface FilterOptions {
    page?: number;
    perPage?: number;
    search?: string;
    season?: string;
    seasonYear?: number;
    format?: string;
    status?: string;
    genres?: string[];
    sort?: string;
}
