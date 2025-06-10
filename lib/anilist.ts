import { ANILIST_URL } from "./constants";

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY_MS = 2000;

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

const defaultOptions: FilterOptions = {
  page: 1,
  perPage: 20,
};

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function executeFetchWithRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY_MS
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Too Many Requests" ||
        error.message.includes("rate limit")) &&
      retries > 0
    ) {
      await sleep(delay);
      return executeFetchWithRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function handleApiResponse(response: Response): Promise<any> {
  if (response.status === 429) {
    throw new Error("Too Many Requests");
  }

  const json = await response.json();

  if (json.errors) {
    const errorMessage = json.errors[0].message;
    if (
      errorMessage.toLowerCase().includes("rate limit") ||
      errorMessage.toLowerCase().includes("too many requests")
    ) {
      throw new Error("Too Many Requests");
    }
    throw new Error(errorMessage);
  }

  return json.data;
}

export async function fetchAnimeList(
  options: FilterOptions = {}
): Promise<AnimeListResponse> {
  const mergedOptions = { ...defaultOptions, ...options };

  const query = `
    query ($page: Int, $perPage: Int, $search: String, $season: MediaSeason, $seasonYear: Int, $format: MediaFormat, $status: MediaStatus, $genres: [String], $sort: [MediaSort]) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(
          type: ANIME, 
          search: $search, 
          season: $season, 
          seasonYear: $seasonYear,
          format: $format,
          status: $status,
          genre_in: $genres,
          sort: $sort
        ) {
          id
          title {
            english
            romaji
            native
          }
          coverImage {
            extraLarge
            large
            medium
            color
          }
          season
          seasonYear
          description
          episodes
          genres
          averageScore
          popularity
          status
          format
          startDate {
            year
            month
            day
          }
        }
      }
    }
  `;

  const variables = {
    page: mergedOptions.page,
    perPage: mergedOptions.perPage,
    search: mergedOptions.search,
    season: mergedOptions.season,
    seasonYear: mergedOptions.seasonYear,
    format: mergedOptions.format,
    status: mergedOptions.status,
    genres: mergedOptions.genres,
    sort: mergedOptions.sort ? [mergedOptions.sort] : ["POPULARITY_DESC"],
  };

  return executeFetchWithRetry(async () => {
    const response = await fetch(ANILIST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    return handleApiResponse(response);
  });
}

export async function fetchAnimeDetails(id: number): Promise<AnimeResponse> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          english
          romaji
          native
        }
        coverImage {
          extraLarge
          large
          medium
          color
        }
        bannerImage
        season
        seasonYear
        description
        episodes
        duration
        genres
        averageScore
        popularity
        status
        format
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        studios {
          nodes {
            id
            name
            isAnimationStudio
          }
        }
        characters(sort: ROLE, page: 1, perPage: 8) {
          nodes {
            id
            name {
              full
            }
            image {
              large
            }
            gender
            description
            role
          }
        }
        trailer {
          id
          site
        }
        tags {
          id
          name
          rank
        }
      }
    }
  `;

  const variables = {
    id,
  };

  return executeFetchWithRetry(async () => {
    const response = await fetch(ANILIST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    return handleApiResponse(response);
  });
}

export async function fetchGenres(): Promise<string[]> {
  const query = `
    query {
      genres
    }
  `;

  return executeFetchWithRetry(async () => {
    const response = await fetch(ANILIST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    return handleApiResponse(response);
  });
}

export async function fetchUpcomingAnime(): Promise<AnimeListResponse> {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  let currentSeason;

  const month = currentDate.getMonth() + 1;

  if (month >= 1 && month <= 3) {
    currentSeason = "WINTER";
  } else if (month >= 4 && month <= 6) {
    currentSeason = "SPRING";
  } else if (month >= 7 && month <= 9) {
    currentSeason = "SUMMER";
  } else {
    currentSeason = "FALL";
  }

  let nextSeason;
  let nextSeasonYear = currentYear;

  switch (currentSeason) {
    case "WINTER":
      nextSeason = "SPRING";
      break;
    case "SPRING":
      nextSeason = "SUMMER";
      break;
    case "SUMMER":
      nextSeason = "FALL";
      break;
    case "FALL":
      nextSeason = "WINTER";
      nextSeasonYear = currentYear + 1;
      break;
  }

  return fetchAnimeList({
    season: nextSeason,
    seasonYear: nextSeasonYear,
    status: "NOT_YET_RELEASED",
    sort: "POPULARITY_DESC",
    perPage: 20,
    
  });
}
