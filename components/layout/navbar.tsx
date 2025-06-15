"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Explore", path: "/explore" },
  { name: "Upcoming", path: "/upcoming" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm px-4">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2"
          aria-label="Go to Home"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="text-2xl font-bold">AniPlay</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center space-x-6"
          role="navigation"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.name}
                </motion.div>
                {isActive && (
                  <motion.div
                    className="h-0.5 bg-primary mt-0.5"
                    layoutId="navbar-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4 justify-center">
          <form
            onSubmit={handleSearch}
            className="relative hidden md:flex items-center"
            role="search"
          >
            <Input
              type="search"
              placeholder="Search anime..."
              className="w-[200px] lg:w-[300px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search anime"
            />
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          </form>

          <ThemeToggle />

          {/* Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Menu"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-black"
            role="dialog"
            aria-modal="true"
          >
            <div className="container space-y-6 h-screen bg-black px-6 py-2">
              <div className="flex justify-end py-3">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close Menu"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search anime..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search anime"
                />
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </form>

              {/* Mobile Navigation */}
              <nav
                className="flex flex-col space-y-6 bg-black"
                aria-label="Mobile navigation"
              >
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors",
                        isActive
                          ? "text-primary underline underline-offset-4"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
