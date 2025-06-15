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