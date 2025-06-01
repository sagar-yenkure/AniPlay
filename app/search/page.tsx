"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { fetchAnimeList } from "@/lib/anilist";
import { AnimeGrid } from "@/components/anime/anime-grid";
import { Pagination } from "@/components/anime/pagination";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  
  const { data, error, isLoading } = useSWR(
    query ? ["search", query, page] : null,
    () => fetchAnimeList({
      search: query,
      page,
      perPage: 25,
    })
  );

  return (
    <div className="container py-8">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
        </div>
        
        {query && (
          <p className="mt-2 text-muted-foreground">
            Showing results for <span className="font-medium text-foreground">"{query}"</span>
          </p>
        )}
      </motion.div>

      {!query ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">Enter a search term to find anime</p>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-destructive">
            Error searching for anime. Please try again later.
          </p>
        </div>
      ) : (
        <>
          <AnimeGrid 
            animeList={data?.Page?.media || []} 
            isLoading={isLoading} 
          />
          
          {data?.Page?.pageInfo && data.Page.media.length > 0 && (
            <Pagination
              totalPages={data.Page.pageInfo.lastPage}
              currentPage={page}
            />
          )}
          
          {data?.Page?.media && data.Page.media.length === 0 && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No results found for "{query}"</p>
              <p className="mt-2 text-sm text-muted-foreground">Try a different search term</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}