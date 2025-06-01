"use client";

import { useEffect } from "react";
import { Anime } from "@/lib/anilist";
import { AnimeCard } from "@/components/anime/anime-card";
import { motion, AnimatePresence } from "framer-motion";

interface AnimeGridProps {
  animeList: Anime[];
  isLoading?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function AnimeGrid({ animeList, isLoading = false }: AnimeGridProps) {
  // Use useEffect to scroll to top when animeList changes (filter/sort/pagination)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [animeList]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lx:grid-cols-5">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[2/3] w-full rounded-lg bg-muted"></div>
            <div className="mt-2 h-4 w-3/4 rounded bg-muted"></div>
            <div className="mt-2 h-3 w-1/2 rounded bg-muted"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!animeList || animeList.length === 0) {
    return (
      <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No anime found.</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
        key={animeList.map((anime) => anime.id).join("-")}
      >
        {animeList.map((anime, index) => (
          <motion.div key={anime.id} variants={item}>
            <AnimeCard anime={anime} priority={index < 10} />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
