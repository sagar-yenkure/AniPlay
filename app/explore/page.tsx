"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimeGrid } from "@/components/anime/anime-grid";
import { Pagination } from "@/components/anime/pagination";
import { FilterSidebar } from "@/components/anime/filter-sidebar";
import { fetchAnimeList, fetchGenres } from "@/lib/anilist";
import { motion } from "framer-motion";
import useSWR from "swr";

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get filter params from URL
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const genres = searchParams.get("genres")?.split(",") || [];
  const season = searchParams.get("season") || "";
  const year = searchParams.get("year") ? parseInt(searchParams.get("year") as string) : undefined;
  const format = searchParams.get("format") || "";
  const status = searchParams.get("status") || "";
  const sort = searchParams.get("sort") || "POPULARITY_DESC";

  // Fetch genres
  const { data: genreData, error: genreError } = useSWR("genres", fetchGenres);
  
  // Fetch anime with filters
  const { data, error, isLoading } = useSWR(
    ["animeList", page, search, genres, season, year, format, status, sort],
    () => fetchAnimeList({
      page,
      perPage: 25,
      search: search || undefined,
      season: season || undefined,
      seasonYear: year,
      format: format || undefined,
      status: status || undefined,
      genres: genres.length > 0 ? genres : undefined,
      sort: sort,
    })
  );

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (search) count++;
    if (genres.length > 0) count++;
    if (season) count++;
    if (year) count++;
    if (format) count++;
    if (status) count++;
    if (sort && sort !== "POPULARITY_DESC") count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold tracking-tight">Explore Anime</h1>
        <Button 
          variant="outline" 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        {/* Sidebar - Fixed on desktop, slide out on mobile */}
        <FilterSidebar
          genres={genreData || []}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />

        {/* Main Content */}
        <div>
          {error ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
              <p className="text-destructive">
                Error loading anime. Please try again later.
              </p>
            </div>
          ) : (
            <>
              <AnimeGrid 
                animeList={data?.Page?.media || []} 
                isLoading={isLoading} 
              />
              
              {data?.Page?.pageInfo && (
                <Pagination
                  totalPages={data.Page.pageInfo.lastPage}
                  currentPage={page}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}