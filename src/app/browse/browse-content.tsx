"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsStringLiteral, useQueryStates } from "nuqs";
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
  const [{ category, page }, setQueryStates] = useQueryStates({
    category: parseAsStringLiteral(categoryIds).withDefault("most-popular"),
    page: parseAsInteger.withDefault(1),
  });

  const { data, isLoading } = useQuery(
    orpc.anime.getCategoryAnime.queryOptions({
      input: { category: category as CategoryId, page },
    })
  );

  const animes = (data?.animes ?? []).filter(
    (
      item
    ): item is typeof item & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null
  );

  const handleCategoryChange = (newCategory: CategoryId) => {
    setQueryStates({ category: newCategory, page: 1 });
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
            {data && (
              <span className="text-xs text-muted-foreground/60">
                Page {page} of {data.totalPages}
              </span>
            )}
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
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-foreground/5">
                      <Image
                        src={anime.poster}
                        alt={anime.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button
                    onClick={() =>
                      setQueryStates({ page: Math.max(1, page - 1) })
                    }
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-foreground/5 hover:bg-foreground/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(5, data.totalPages) },
                      (_, i) => {
                        let pageNum: number;
                        if (data.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= data.totalPages - 2) {
                          pageNum = data.totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setQueryStates({ page: pageNum })}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                              page === pageNum
                                ? "bg-foreground text-background"
                                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    onClick={() => setQueryStates({ page: page + 1 })}
                    disabled={!data.hasNextPage}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-foreground/5 hover:bg-foreground/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
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
