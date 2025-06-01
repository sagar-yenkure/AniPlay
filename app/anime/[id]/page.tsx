"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAnimeDetails } from "@/lib/anilist";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Film,
  Star,
  TrendingUp,
  Users,
  PlayCircle,
} from "lucide-react";

export default function AnimeDetailsPage() {
  const { id } = useParams();
  const animeId = parseInt(id as string);

  const { data, error, isLoading } = useSWR(["animeDetails", animeId], () =>
    fetchAnimeDetails(animeId)
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="container grid gap-6 py-8 md:grid-cols-[300px_1fr] md:gap-12 lg:gap-16">
        <div className="animate-pulse">
          <div className="aspect-[2/3] w-full rounded-lg bg-muted"></div>
        </div>
        <div className="space-y-4 animate-pulse">
          <div className="h-10 w-3/4 rounded-lg bg-muted"></div>
          <div className="h-6 w-1/2 rounded-lg bg-muted"></div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted"></div>
            <div className="h-4 w-full rounded bg-muted"></div>
            <div className="h-4 w-3/4 rounded bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-destructive">
            Error loading anime details. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!data?.Media) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-dashed p-4 text-center">
          <p className="text-muted-foreground">Anime not found</p>
        </div>
      </div>
    );
  }

  const anime = data.Media;
  const title = anime.title.english || anime.title.romaji || "Unknown Title";

  // Format dates
  const formatDate = (year?: number, month?: number, day?: number) => {
    if (!year) return "Unknown";
    try {
      return format(new Date(year, (month || 1) - 1, day || 1), "MMMM d, yyyy");
    } catch {
      return `${year}${month ? `-${month}` : ""}${day ? `-${day}` : ""}`;
    }
  };

  const startDate = formatDate(
    anime.startDate?.year,
    anime.startDate?.month,
    anime.startDate?.day
  );

  const endDate =
    anime.status === "FINISHED"
      ? formatDate(
          anime.endDate?.year,
          anime.endDate?.month,
          anime.endDate?.day
        )
      : anime.status === "RELEASING"
      ? "Ongoing"
      : anime.status === "NOT_YET_RELEASED"
      ? "TBA"
      : "Unknown";

  // Format status
  const formatStatus = (status: string) => {
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

  return (
    <AnimatePresence>
      <div className="min-h-screen">
        {/* Banner Image */}
        {anime.bannerImage && (
          <motion.div
            className="relative h-[200px] w-full md:h-[300px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={anime.bannerImage}
              alt={title}
              fill
              priority
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)",
              }}
            />
          </motion.div>
        )}

        <div className="container relative py-8">
          {/* Main Content */}
          <div className="grid gap-6 md:grid-cols-[300px_1fr] md:gap-12 lg:gap-16">
            {/* Left Column - Cover Image & Stats */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`relative aspect-[2/3] w-full overflow-hidden rounded-lg border shadow-md ${
                  anime.bannerImage ? "-mt-16 md:-mt-24" : ""
                }`}
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
                      <span className="text-sm text-muted-foreground">
                        Score
                      </span>
                      <span className="text-base font-semibold">
                        {anime.averageScore}%
                      </span>
                    </div>
                  )}

                  {anime.popularity && (
                    <div className="flex flex-col items-center justify-center rounded-md border border-border/50 bg-background p-2">
                      <TrendingUp className="mb-1 h-5 w-5 text-green-500" />
                      <span className="text-sm text-muted-foreground">
                        Popularity
                      </span>
                      <span className="text-base font-semibold">
                        {anime.popularity.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {anime.format && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Format</span>
                      <span className="font-medium">
                        {formatAnimeType(anime.format)}
                      </span>
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
                      <span className="font-medium">
                        {formatStatus(anime.status)}
                      </span>
                    </div>
                  )}

                  {anime.season && anime.seasonYear && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Season</span>
                      <span className="font-medium">
                        {anime.season.charAt(0) +
                          anime.season.slice(1).toLowerCase()}{" "}
                        {anime.seasonYear}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Aired</span>
                    <span className="font-medium text-right">
                      {startDate}
                      {anime.status !== "NOT_YET_RELEASED" &&
                        endDate !== startDate && <> to {endDate}</>}
                    </span>
                  </div>

                  {anime.studios?.nodes?.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Studio</span>
                      <span className="font-medium">
                        {anime.studios.nodes
                          .filter((studio) => studio.isAnimationStudio)
                          .map((studio) => studio.name)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                  {title}
                </h1>

                {anime.title.native && (
                  <p className="text-lg text-muted-foreground">
                    {anime.title.native}
                  </p>
                )}
              </div>

              {anime.genres && (
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              {anime.description && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Synopsis</h2>
                  <p
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: anime.description }}
                  ></p>
                </div>
              )}

              {/* Trailer */}
              {anime.trailer && anime.trailer.site === "youtube" && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Trailer</h2>
                  <div className="overflow-hidden rounded-lg border aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                      title={`${title} Trailer`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Characters */}
              {anime.characters?.nodes?.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Main Characters</h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {anime.characters.nodes.map((character) => (
                      <motion.div
                        key={character.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center"
                      >
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                          <Image
                            src={character.image.large || "/placeholder.png"}
                            alt={character.name.full}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="mt-2 text-center">
                          <p className="line-clamp-1 font-medium">
                            {character.name.full}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {character.role.charAt(0) +
                              character.role.slice(1).toLowerCase()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {anime.tags && anime.tags.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {anime.tags
                      .sort((a, b) => b.rank - a.rank)
                      .slice(0, 12)
                      .map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}

// Helper function to format anime type
function formatAnimeType(format: string): string {
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
