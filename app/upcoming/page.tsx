"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { fetchUpcomingAnime } from "@/lib/anilist";
import { AnimeGrid } from "@/components/anime/anime-grid";
import Error from "@/components/layout/Error";
import { getCurrentAndNextSeason } from "@/helpers/animeHelper";

export default function UpcomingPage() {
  const { data, error, isLoading } = useSWR(
    "upcoming-anime",
    fetchUpcomingAnime
  );

  if (error) return <Error error="Error loading upcoming anime. Please try again later." />;
  const seasons = getCurrentAndNextSeason();

  return (
    <div className="container py-8 px-4 md:px-4">
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

      <AnimeGrid animeList={data?.Page?.media || []} isLoading={isLoading} />

    </div>
  );
}
