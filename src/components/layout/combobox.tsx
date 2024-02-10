"use client";

import { searchAnime } from "@/_actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { isMacOs } from "@/lib/utils";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useInView } from "react-intersection-observer";

interface Data {
  title: string;
  slug: string;
  year: string;
  image: string;
}

export function Combobox() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [data, setData] = React.useState<Data[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const [hasMore, setHasMore] = React.useState(false);
  const [isLoadingMore, startLoadingMore] = React.useTransition();
  const [page, setPage] = React.useState(1);
  const { ref, inView, entry } = useInView();

  React.useEffect(() => {
    if (debouncedQuery.length === 0) {
      setData([]);
      setPage(1);
    }

    if (debouncedQuery.length > 0) {
      startTransition(async () => {
        const searchedData = await searchAnime({ q: debouncedQuery, page: 1 });
        setData(searchedData.results);
        setHasMore(searchedData.hasNextPage);
        setPage(Number(searchedData.currentPage) + 1);
      });
    }
  }, [debouncedQuery]);

  React.useEffect(() => {
    if (inView && hasMore) {
      startLoadingMore(async () => {
        const moreData = await searchAnime({
          q: debouncedQuery,
          page,
        });
        setData([...data, ...moreData.results]);
        setPage(Number(moreData.currentPage) + 1);
        setHasMore(moreData.hasNextPage);
        entry?.target.scrollIntoView({ behavior: "instant" });
      });
    }
  }, [inView, hasMore, data, entry, debouncedQuery, page]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((isOpen) => !isOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = React.useCallback((callback: () => unknown) => {
    setIsOpen(false);
    callback();
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setIsOpen(true)}
      >
        <Icons.search className="size-4 xl:mr-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex">Search anime...</span>
        <span className="sr-only">Search anime</span>
        <kbd className="pointer-events-none absolute top-2 right-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-100 xl:flex">
          <span className="text-xs">{isMacOs() ? "⌘" : "Ctrl"}</span>K
        </kbd>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search anime..."
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
        {isPending && (
          <div className="space-y-1 overflow-hidden px-1 py-2">
            <LoadingFragment />
            <LoadingFragment />
          </div>
        )}
        <CommandList>
          {!isPending && query.length > 0 && (
            <CommandEmpty className={"py-6 text-center text-sm"}>
              No anime found.
            </CommandEmpty>
          )}
          {data && (
            <CommandGroup>
              {data?.map(({ slug, title, image, year }, index) => (
                <CommandItem
                  key={index}
                  value={title}
                  ref={index === data.length - 1 ? ref : undefined}
                  onSelect={() =>
                    handleSelect(() => {
                      startTransition(() => {
                        setQuery("");
                        router.push(`/anime/${slug}`);
                      });
                    })
                  }
                >
                  <img
                    src={image}
                    alt={title}
                    className="mr-4 h-14 w-10 rounded-sm"
                  />
                  <div className="flex flex-col justify-center">
                    <h3 className="font-medium text-sm leading-none">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-none">
                      {year}
                    </p>
                  </div>
                </CommandItem>
              ))}
              {isLoadingMore && <LoadingFragment />}
            </CommandGroup>
          )}
          {!debouncedQuery.length && !query && (
            <div className="p-4 text-center text-sm">
              Start typing to see results..
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

function LoadingFragment() {
  return (
    <div className="flex flex-row">
      <Skeleton className="mr-4 h-16 w-10 rounded-sm" />
      <div className="flex h-15 flex-col justify-center gap-2">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-20" />
      </div>

      <Skeleton className="h-8 rounded-sm" />
    </div>
  );
}
