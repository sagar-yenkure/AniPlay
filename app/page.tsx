import { Suspense } from "react";
import { HeroSection } from "@/components/anime/hero-section";
import { AnimeSection } from "@/components/anime/anime-section";
import { fetchAnimeList, fetchUpcomingAnime } from "@/lib/anilist";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const [trendingData, popularData, upcomingData] = await Promise.all([
    fetchAnimeList({
      sort: "TRENDING_DESC",
      perPage: 5,
    }),
    fetchAnimeList({
      sort: "POPULARITY_DESC",
      perPage: 10,
    }),
    fetchUpcomingAnime(),
  ]);

  const trendingAnime = trendingData.Page.media;
  const popularAnime = popularData.Page.media;
  const upcomingAnime = upcomingData.Page.media;

  const featuredAnime = trendingAnime[4];

  return (
    <>
      <HeroSection anime={featuredAnime} />

      <section className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="container py-8">Loading trending anime...</div>
          }
        >
          <AnimeSection
            title="Trending Now"
            animeList={trendingAnime}
            viewAllLink="/explore?sort=TRENDING_DESC"
          />
        </Suspense>

        <Suspense
          fallback={
            <div className="container py-8">Loading popular anime...</div>
          }
        >
          <AnimeSection
            title="Popular Anime"
            animeList={popularAnime}
            viewAllLink="/explore?sort=POPULARITY_DESC"
          />
        </Suspense>

        <Suspense
          fallback={
            <div className="container py-8">Loading upcoming anime...</div>
          }
        >
          <AnimeSection
            title="Upcoming Releases"
            animeList={upcomingAnime}
            viewAllLink="/upcoming"
          />
        </Suspense>
      </section>
    </>
  );
}
