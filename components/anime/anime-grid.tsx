"use client";

import { useEffect } from "react";
import { Anime } from "@/lib/anilist";
import { AnimeCard } from "@/components/anime/anime-card";
import { motion, AnimatePresence } from "framer-motion";
import Error from "../layout/Error";
import CardSkeleton from "../layout/CardSkeleton";

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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [animeList]);

  if (isLoading) return <CardSkeleton number={10} />;

  if (animeList?.length === 0) return <Error error="No anime found" />;

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
