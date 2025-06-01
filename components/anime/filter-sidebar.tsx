"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, X, Filter, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  SEASONS,
  FORMATS,
  STATUSES,
  SORT_OPTIONS,
  YEAR_RANGE,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  genres: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function FilterSidebar({ genres, isOpen, onClose }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL parameters
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    searchParams.get("genres")?.split(",") || []
  );
  const [season, setSeason] = useState(searchParams.get("season") || "");
  const [year, setYear] = useState(searchParams.get("year") || "");
  const [format, setFormat] = useState(searchParams.get("format") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [sort, setSort] = useState(
    searchParams.get("sort") || "POPULARITY_DESC"
  );

  // Handle genre selection
  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // Handle filter submit
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.append("search", searchQuery);
    if (selectedGenres.length > 0)
      params.append("genres", selectedGenres.join(","));
    if (season) params.append("season", season);
    if (year) params.append("year", year);
    if (format) params.append("format", format);
    if (status) params.append("status", status);
    if (sort) params.append("sort", sort);

    router.push(`/explore?${params.toString()}`);
    onClose();
  };

  // Handle filter reset
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setSeason("");
    setYear("");
    setFormat("");
    setStatus("");
    setSort("POPULARITY_DESC");
  };

  // Effect to handle click outside to close on desktop
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("filter-sidebar");
      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        window.innerWidth >= 768
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        id="filter-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-full max-w-xs flex-col border-r bg-background p-6 shadow-lg md:z-40 md:flex md:translate-x-0 md:border-0 md:shadow-none",
          isOpen ? "flex" : "hidden"
        )}
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-12 space-y-4">
          {/* Search */}
          <div>
            <Label htmlFor="search">Search</Label>
            <div className="relative mt-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="search"
                placeholder="Search anime..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <Label htmlFor="sort">Sort By</Label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger id="sort" className="mt-1">
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {/* Season & Year */}
            <AccordionItem value="season">
              <AccordionTrigger>Season</AccordionTrigger>
              <AccordionContent className="space-y-2">
                <Select value={season} onValueChange={setSeason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Season</SelectItem>
                    {SEASONS.map((season) => (
                      <SelectItem key={season.value} value={season.value}>
                        {season.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Year</SelectItem>
                    {YEAR_RANGE.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            {/* Format */}
            <AccordionItem value="format">
              <AccordionTrigger>Format</AccordionTrigger>
              <AccordionContent>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Format</SelectItem>
                    {FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            {/* Status */}
            <AccordionItem value="status">
              <AccordionTrigger>Status</AccordionTrigger>
              <AccordionContent>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Status</SelectItem>
                    {STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            {/* Genres */}
            <AccordionItem value="genres">
              <AccordionTrigger>Genres</AccordionTrigger>
              <AccordionContent>
                <div className="max-h-48 overflow-y-auto pr-1">
                  <div className="flex flex-wrap gap-2">
                    {genres?.map((genre) => (
                      <div
                        key={genre}
                        className={cn(
                          "flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors",
                          selectedGenres.includes(genre)
                            ? "border-primary bg-primary/10"
                            : "border-input bg-background hover:bg-accent/50"
                        )}
                        onClick={() => handleGenreChange(genre)}
                      >
                        <span>{genre}</span>
                        {selectedGenres.includes(genre) && (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </motion.div>
    </>
  );
}
