"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetchAnimeDetails } from "@/lib/anilist";
import { AnimatePresence } from "framer-motion";
import DetailSkeleton from "@/components/layout/DetailSkeleton";
import Error from "@/components/layout/Error";
import AnimeBanner from "@/components/anime/AnimeBanner";
import AnimeCoverStats from "@/components/anime/AnimeCoverStats";
import AnimeDetails from "@/components/anime/AnimeDetails";


const AnimeDetailsPage = () => {
  const { id } = useParams();
  const animeId = parseInt(id as string);

  const { data, error, isLoading } = useSWR(["animeDetails", animeId], () =>
    fetchAnimeDetails(animeId)
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) return <DetailSkeleton />;
  if (!data?.Media) return <Error error="Anime not found" />;
  if (error) return <Error error="Error loading anime details. Please try again later." />;

  const anime = data.Media;

  return (
    <AnimatePresence>
      <div className="min-h-screen px-4 md:px-4">
        <AnimeBanner anime={anime} />
        <div className="container relative py-8">
          <div className="grid gap-6 md:grid-cols-[300px_1fr] md:gap-12 lg:gap-16">
            <AnimeCoverStats anime={anime} />
            <AnimeDetails anime={anime} />
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default AnimeDetailsPage;