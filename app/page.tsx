import { Suspense } from "react";
import { HeroSection } from "@/components/anime/hero-section";
import { AnimeSection } from "@/components/anime/anime-section";
import { fetchAnimeList, fetchUpcomingAnime } from "@/lib/anilist";
import Error from "@/components/layout/Error";

const ANIME_LIST_CONFIGS = {
  trending: { sort: "TRENDING_DESC", perPage: 5 },
  popular: { sort: "POPULARITY_DESC", perPage: 10 },
};

const LoadingFallback = ({ message }: { message: string }) => (
  <div className="container py-8">{message}</div>
);

const Home = async () => {

  const [
    { Page: { media: trendingAnime } },
    { Page: { media: popularAnime } },
    { Page: { media: upcomingAnime } },
  ] = await Promise.all([
    fetchAnimeList(ANIME_LIST_CONFIGS.trending),
    fetchAnimeList(ANIME_LIST_CONFIGS.popular),
    fetchUpcomingAnime(),
  ]);

  if (!trendingAnime?.length || !popularAnime?.length || !upcomingAnime?.length) return <Error error="Error loading anime data" />;


  // Anime section configurations
  const sections = [
    {
      title: "Trending Now",
      animeList: trendingAnime,
      viewAllLink: "/explore?sort=TRENDING_DESC",
      fallbackMessage: "Loading trending anime...",
    },
    {
      title: "Popular Anime",
      animeList: popularAnime,
      viewAllLink: "/explore?sort=POPULARITY_DESC",
      fallbackMessage: "Loading popular anime...",
    },
    {
      title: "Upcoming Releases",
      animeList: upcomingAnime,
      viewAllLink: "/upcoming",
      fallbackMessage: "Loading upcoming anime...",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection anime={trendingAnime[4]} />
      {sections.map((section) => (
        <Suspense
          key={section.title}
          fallback={<LoadingFallback message={section.fallbackMessage} />}
        >
          <AnimeSection {...section} />
        </Suspense>
      ))}
    </div>
  );
}

export default Home;