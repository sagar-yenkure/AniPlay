import { format } from "date-fns";

export const formatAnimeType = (format: string): string => {
    switch (format) {
        case "TV":
            return "TV";
        case "TV_SHORT":
            return "TV Short";
        case "MOVIE":
            return "Movie";
        case "SPECIAL":
            return "Special";
        case "OVA":
            return "OVA";
        case "ONA":
            return "ONA";
        case "MUSIC":
            return "Music";
        default:
            return format;
    }
}

export const formatDate = (year?: number, month?: number, day?: number) => {
    if (!year) return "Unknown";
    try {
        return format(new Date(year, (month || 1) - 1, day || 1), "MMMM d, yyyy");
    } catch {
        return `${year}${month ? `-${month}` : ""}${day ? `-${day}` : ""}`;
    }
};

export const formatStatus = (status: string) => {
    switch (status) {
        case "FINISHED":
            return "Finished";
        case "RELEASING":
            return "Airing";
        case "NOT_YET_RELEASED":
            return "Coming Soon";
        case "CANCELLED":
            return "Cancelled";
        default:
            return status;
    }
};

export const getCurrentAndNextSeason = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let currentSeason;

    const month = currentDate.getMonth() + 1;

    if (month >= 1 && month <= 3) {
        currentSeason = "Winter";
    } else if (month >= 4 && month <= 6) {
        currentSeason = "Spring";
    } else if (month >= 7 && month <= 9) {
        currentSeason = "Summer";
    } else {
        currentSeason = "Fall";
    }

    let nextSeason;
    let nextSeasonYear = currentYear;

    switch (currentSeason) {
        case "Winter":
            nextSeason = "Spring";
            break;
        case "Spring":
            nextSeason = "Summer";
            break;
        case "Summer":
            nextSeason = "Fall";
            break;
        case "Fall":
            nextSeason = "Winter";
            nextSeasonYear = currentYear + 1;
            break;
    }

    return {
        current: `${currentSeason} ${currentYear}`,
        next: `${nextSeason} ${nextSeasonYear}`,
    };
};