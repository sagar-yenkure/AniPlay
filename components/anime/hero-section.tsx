"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Anime } from "@/lib/anilist";

interface HeroSectionProps {
  anime: Anime;
}

export function HeroSection({ anime }: HeroSectionProps) {
  const title = anime?.title?.english || anime?.title?.romaji || "";

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={anime?.bannerImage || anime.coverImage.extraLarge}
          alt={title}
          fill
          priority
          quality={100}
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 py-12 sm:px-8 md:px-16 lg:px-24">
        <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-[1fr_2fr]">
          {/* Anime Cover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto hidden md:block w-40 md:w-64 aspect-[2/3] overflow-hidden rounded-lg shadow-2xl"
          >
            <Image
              src={anime.coverImage.large}
              alt={title}
              width={450}
              height={450}
              priority
              quality={100}
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Anime Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-white"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              {title}
            </h1>

            {/* Genres */}
            {anime.genres && (
              <div className="mt-4 flex flex-wrap gap-2">
                {anime.genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="mt-4 line-clamp-2 md:line-clamp-5 pr-2 text-sm text-zinc-200 sm:text-base ">
              {anime.description || "No description available."}
            </p>

            {/* Button */}
            <div className="mt-6">
              <Link href={`/anime/${anime.id}`} passHref>
                <Button className="group">
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
