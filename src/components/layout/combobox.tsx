"use client";

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
import { cn, isMacOs } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import * as React from "react";
import { searchAnime } from "@/_actions";

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

  const { ref, inView } = useInView();

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
      });
    }
  }, [inView, hasMore]);

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
        <Icons.search className="h-4 w-4 xl:mr-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex">Search anime...</span>
        <span className="sr-only">Search anime</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">{isMacOs() ? "⌘" : "Ctrl"}</span>K
        </kbd>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search anime..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty
            className={cn(isPending ? "hidden" : "py-6 text-center text-sm")}
          >
            No anime found.
          </CommandEmpty>
          {isPending ? (
            <div className="space-y-1 overflow-hidden px-1 py-2">
              <LoadingFragment />
              <LoadingFragment />
            </div>
          ) : data ? (
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
                    className="w-10 h-14 mr-4 rounded-sm"
                  />
                  <div className="flex flex-col justify-center">
                    <h3 className="text-sm font-medium leading-none">
                      {title}
                    </h3>
                    <p className="text-xs leading-none text-muted-foreground">
                      {year}
                    </p>
                  </div>
                </CommandItem>
              ))}
              {isLoadingMore && <LoadingFragment />}
            </CommandGroup>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  );
}

function LoadingFragment() {
  return (
    <div className="flex flex-row">
      <Skeleton className="w-10 h-16 mr-4 rounded-sm" />
      <div className="flex flex-col gap-2 justify-center h-15">
        <Skeleton className="w-40 h-3" />
        <Skeleton className="w-20 h-3" />
      </div>

      <Skeleton className="h-8 rounded-sm" />
    </div>
  );
}
