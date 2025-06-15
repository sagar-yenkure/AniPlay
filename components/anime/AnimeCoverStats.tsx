import Image from "next/image";
import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import { formatAnimeType, formatDate, formatStatus } from "@/helpers/animeHelper";

interface AnimeCoverStatsProps {
    anime: any;
}

const AnimeCoverStats = ({ anime }: AnimeCoverStatsProps) => {
    const title = anime.title.english || anime.title.romaji || "Unknown Title";
    const startDate = formatDate(
        anime.startDate?.year,
        anime.startDate?.month,
        anime.startDate?.day
    );
    const endDate = anime.status === "FINISHED"
        ? formatDate(anime.endDate?.year, anime.endDate?.month, anime.endDate?.day)
        : anime.status === "RELEASING"
            ? "Ongoing"
            : anime.status === "NOT_YET_RELEASED"
                ? "TBA"
                : "Unknown";

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`relative aspect-[2/3] w-full overflow-hidden rounded-lg border shadow-md ${anime.bannerImage ? "-mt-16 md:-mt-24" : ""}`}
            >
                <Image
                    src={anime.coverImage.large || "/placeholder.png"}
                    alt={title}
                    fill
                    priority
                    className="object-cover"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4 rounded-lg border bg-card p-4"
            >
                <div className="grid grid-cols-2 gap-4">
                    {anime.averageScore && (
                        <div className="flex flex-col items-center justify-center rounded-md border border-border/50 bg-background p-2">
                            <Star className="mb-1 h-5 w-5 text-yellow-500" />
                            <span className="text-sm text-muted-foreground">Score</span>
                            <span className="text-base font-semibold">{anime.averageScore}%</span>
                        </div>
                    )}
                    {anime.popularity && (
                        <div className="flex flex-col items-center justify-center rounded-md border border-border/50 bg-background p-2">
                            <TrendingUp className="mb-1 h-5 w-5 text-green-500" />
                            <span className="text-sm text-muted-foreground">Popularity</span>
                            <span className="text-base font-semibold">{anime.popularity.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    {anime.format && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Format</span>
                            <span className="font-medium">{formatAnimeType(anime.format)}</span>
                        </div>
                    )}
                    {anime.episodes && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Episodes</span>
                            <span className="font-medium">{anime.episodes}</span>
                        </div>
                    )}
                    {anime.duration && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Duration</span>
                            <span className="font-medium">{anime.duration} min</span>
                        </div>
                    )}
                    {anime.status && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Status</span>
                            <span className="font-medium">{formatStatus(anime.status)}</span>
                        </div>
                    )}
                    {anime.season && anime.seasonYear && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Season</span>
                            <span className="font-medium">
                                {anime.season.charAt(0) + anime.season.slice(1).toLowerCase()} {anime.seasonYear}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Aired</span>
                        <span className="font-medium text-right">
                            {startDate}
                            {anime.status !== "NOT_YET_RELEASED" && endDate !== startDate && <> to {endDate}</>}
                        </span>
                    </div>
                    {anime.studios?.nodes?.length > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Studio</span>
                            <span className="font-medium">
                                {anime.studios.nodes
                                    .filter((studio: any) => studio.isAnimationStudio)
                                    .map((studio: any) => studio.name)
                                    .join(", ")}
                            </span>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AnimeCoverStats;