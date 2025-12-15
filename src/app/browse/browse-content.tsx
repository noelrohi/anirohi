"use client";

import Image from "next/image";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/lib/query/orpc";

const categories = [
  { id: "most-popular", label: "Popular" },
  { id: "most-favorite", label: "Favorite" },
  { id: "top-airing", label: "Airing" },
  { id: "recently-updated", label: "Updated" },
  { id: "recently-added", label: "New" },
  { id: "top-upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "subbed-anime", label: "Sub" },
  { id: "dubbed-anime", label: "Dub" },
  { id: "movie", label: "Movies" },
  { id: "tv", label: "TV" },
  { id: "ova", label: "OVA" },
  { id: "ona", label: "ONA" },
  { id: "special", label: "Special" },
] as const;

const categoryIds = categories.map((c) => c.id);
type CategoryId = (typeof categories)[number]["id"];

export function BrowseContent() {
  const [category, setCategory] = useQueryState(
    "category",
    parseAsStringLiteral(categoryIds).withDefault("most-popular"),
  );

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery(
      orpc.anime.getCategoryAnime.infiniteOptions({
        input: (pageParam: number) => ({
          category: category as CategoryId,
          page: pageParam,
        }),
        getNextPageParam: (lastPage) =>
          lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
        initialPageParam: 1,
      }),
    );

  const animes =
    data?.pages.flatMap((page) =>
      (page.animes ?? []).filter(
        (
          item,
        ): item is typeof item & { id: string; name: string; poster: string } =>
          item.id !== null && item.name !== null && item.poster !== null,
      ),
    ) ?? [];

  const handleCategoryChange = (newCategory: CategoryId) => {
    setCategory(newCategory);
  };

  const currentCategory = categories.find((c) => c.id === category);

  return (
    <>
      {/* Category Filter */}
      <section className="sticky top-14 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  category === cat.id
                    ? "bg-cyan text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {currentCategory?.label}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="size-8 text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {animes.map((anime) => (
                  <Link
                    key={anime.id}
                    href={`/anime/${anime.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-foreground/5">
                      <Image
                        src={anime.poster}
                        alt={anime.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="mt-2 text-sm text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">
                      {anime.name}
                    </h3>
                    <p className="text-xs text-muted-foreground/60">
                      {anime.type} ·{" "}
                      {anime.episodes?.sub ?? anime.episodes?.dub ?? "?"} ep
                    </p>
                  </Link>
                ))}
              </div>

              {/* Load More */}
              {hasNextPage && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-6 py-2.5 rounded-lg text-sm font-medium bg-foreground/5 hover:bg-foreground/10 disabled:opacity-50 transition-colors"
                  >
                    {isFetchingNextPage ? (
                      <span className="flex items-center gap-2">
                        <Spinner className="size-4" />
                        Loading...
                      </span>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
