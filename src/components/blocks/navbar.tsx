"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-heading text-xl text-foreground">
              ani<span className="text-cyan">rohi</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/home"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/home"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse
              </Link>
              <Link
                href="/home"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Schedule
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <button className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors">
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-b border-white/5">
          <div className="mx-auto max-w-xl">
            <input
              type="text"
              placeholder="Search anime..."
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-white/20 transition-colors"
              autoFocus
            />
          </div>
        </div>
      )}
    </nav>
  );
}
