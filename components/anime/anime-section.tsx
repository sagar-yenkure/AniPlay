"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimeGrid } from "@/components/anime/anime-grid";
import { Anime } from "@/lib/anilist";
import { motion } from "framer-motion";

interface AnimeSectionProps {
  title: string;
  animeList: Anime[];
  viewAllLink?: string;
  isLoading?: boolean;
}

export function AnimeSection({
  title,
  animeList,
  viewAllLink,
  isLoading = false,
}: AnimeSectionProps) {
  return (
    <section className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          className="text-2xl font-bold tracking-tight"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        
        {viewAllLink && (
          <Link href={viewAllLink} passHref>
            <Button variant="outline" className="group">
              View All
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        )}
      </div>
      
      <AnimeGrid animeList={animeList} isLoading={isLoading} />
    </section>
  );
}