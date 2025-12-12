"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { orpc } from "@/lib/query/orpc";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Spinner } from "@/components/ui/spinner";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  const { data: searchData, isLoading } = useQuery({
    ...orpc.anime.search.queryOptions({
      input: { query: debouncedQuery, page: 1 },
    }),
    enabled: debouncedQuery.length >= 2,
  });

  const searchResults = (searchData?.animes ?? []).filter(
    (
      item,
    ): item is typeof item & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null,
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback(
    (animeId: string) => {
      setOpen(false);
      setQuery("");
      router.push(`/anime/${animeId}`);
    },
    [router],
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search Anime"
      description="Search for your favorite anime"
      showCloseButton={false}
    >
      <CommandInput
        placeholder="Search anime..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {debouncedQuery.length < 2 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Type to search...
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Spinner className="size-5 text-muted-foreground" />
          </div>
        ) : searchResults.length === 0 ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : (
          <CommandGroup heading="Results">
            {searchResults.map((anime) => (
              <CommandItem
                key={anime.id}
                value={anime.name}
                onSelect={() => handleSelect(anime.id)}
                className="gap-3 py-3 border border-transparent transition-colors data-[selected=true]:bg-card data-[selected=true]:border-input data-[selected=true]:text-card-foreground"
              >
                <div className="relative h-12 w-9 overflow-hidden rounded bg-muted shrink-0">
                  <Image
                    src={anime.poster}
                    alt={anime.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-medium truncate">{anime.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {anime.type} · {anime.duration}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
