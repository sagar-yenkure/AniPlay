"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { fetchUpcomingAnime } from "@/lib/anilist";
import { AnimeGrid } from "@/components/anime/anime-grid";

export default function UpcomingPage() {
  const { data, error, isLoading } = useSWR(
    "upcoming-anime",
    fetchUpcomingAnime
  );

  // Get current season and next season for display
  const getCurrentAndNextSeason = () => {
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

  const seasons = getCurrentAndNextSeason();

  return (
    <div className="container py-8 px-4">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Upcoming Anime</h1>
        </div>

        <p className="mt-2 text-muted-foreground">
          Discover upcoming anime releases for the {seasons.next} season
        </p>
      </motion.div>

      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-destructive">
            Error loading upcoming anime. Please try again later.
          </p>
        </div>
      ) : (
        <AnimeGrid animeList={data?.Page?.media || []} isLoading={isLoading} />
      )}
    </div>
  );
}
