"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Create new search params for navigation
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  // Handle page navigation
  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      router.push(createPageUrl(page));
    }
  };

  // Calculate pagination range
  const paginationRange = useMemo(() => {
    const delta = 1;
    const range = [];
    
    const rangeWithDots = [];
    let l;
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        i >= currentPage - delta && i <= currentPage + delta
      ) {
        range.push(i);
      }
    }
    
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("dots");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    
    return rangeWithDots;
  }, [totalPages, currentPage]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <motion.nav
      className="flex justify-center py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {paginationRange.map((pageNumber, idx) =>
          pageNumber === "dots" ? (
            <span key={`dots-${idx}`} className="flex h-10 w-10 items-center justify-center">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </span>
          ) : (
            <Button
              key={pageNumber}
              variant={pageNumber === currentPage ? "default" : "outline"}
              className={cn(
                "h-10 w-10",
                pageNumber === currentPage && "pointer-events-none"
              )}
              onClick={() => handlePageChange(pageNumber as number)}
              aria-label={`Page ${pageNumber}`}
              aria-current={pageNumber === currentPage ? "page" : undefined}
            >
              {pageNumber}
            </Button>
          )
        )}
        
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          aria-label="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.nav>
  );
}