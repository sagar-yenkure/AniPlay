"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Anime } from "@/lib/anilist";
import { cn } from "@/lib/utils";

interface AnimeCardProps {
  anime: Anime;
  priority?: boolean;
}

export function AnimeCard({ anime, priority = false }: AnimeCardProps) {
  const title = anime.title.english || anime.title.romaji || "Unknown Title";

  return (
    <Link href={`/anime/${anime.id}`} passHref>
      <motion.div
        whileHover={{ y: -8 }}
        className="group h-full overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-lg"
      >
        <div className="relative aspect-[2/2] w-full overflow-hidden">
          <Image
            src={anime.coverImage.large || "/placeholder.png"}
            alt={title}
            fill
            quality={100}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />

          {anime.averageScore && (
            <div
              className="absolute right-2 top-2 rounded-full px-2 py-1 text-xs font-bold"
              style={{
                backgroundColor: getScoreColor(anime.averageScore),
                color: anime.averageScore > 70 ? "#000" : "#fff",
              }}
            >
              {anime.averageScore}%
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="line-clamp-2 font-semibold leading-tight">{title}</h3>

          <div className="mt-1 flex flex-wrap gap-1">
            {anime.season && anime.seasonYear && (
              <span className="text-xs text-muted-foreground">
                {anime.season.charAt(0) + anime.season.slice(1).toLowerCase()}{" "}
                {anime.seasonYear}
              </span>
            )}

            {anime.format && (
              <span className="text-xs text-muted-foreground">
                • {formatAnimeType(anime.format)}
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {anime.genres &&
              anime.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs font-medium"
                >
                  {genre}
                </span>
              ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// Helper function to get color based on score
function getScoreColor(score: number): string {
  if (score >= 85) return "#4ade80"; // green
  if (score >= 70) return "#facc15"; // yellow
  if (score >= 60) return "#fb923c"; // orange
  return "#f87171"; // red
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
