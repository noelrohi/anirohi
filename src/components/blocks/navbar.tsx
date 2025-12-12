"use client";

import Link from "next/link";
import { CommandMenu } from "@/components/blocks/command-menu";
import { GitHubIcon, SearchIcon, MenuIcon } from "@/components/ui/icons";
import { Kbd } from "@/components/ui/kbd";

export function Navbar() {
  return (
    <>
      <CommandMenu />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
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
                onClick={() => {
                  const event = new KeyboardEvent("keydown", {
                    key: "k",
                    metaKey: true,
                    bubbles: true,
                  });
                  document.dispatchEvent(event);
                }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-border text-sm text-muted-foreground transition-colors"
              >
                <SearchIcon className="w-4 h-4" />
                <span>Search...</span>
                <Kbd className="ml-2">⌘K</Kbd>
              </button>

              <button
                onClick={() => {
                  const event = new KeyboardEvent("keydown", {
                    key: "k",
                    metaKey: true,
                    bubbles: true,
                  });
                  document.dispatchEvent(event);
                }}
                className="sm:hidden p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                aria-label="Search"
              >
                <SearchIcon className="w-5 h-5 text-muted-foreground" />
              </button>

              <a
                href="https://github.com/noelrohi/anirohi"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-5 h-5 text-muted-foreground" />
              </a>

              <button className="md:hidden p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                <MenuIcon className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
