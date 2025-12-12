"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { Spinner } from "@/components/ui/spinner";

type SpotlightAnime = {
  id: string;
  name: string;
  poster: string;
  rank?: number | null;
  description?: string | null;
};

interface SpotlightCarouselProps {
  anime: SpotlightAnime[];
  isLoading?: boolean;
}

export function SpotlightCarousel({
  anime,
  isLoading,
}: SpotlightCarouselProps) {
  const [current, setCurrent] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({
      delay: 6000,
      playOnInit: true,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  ]);

  useEffect(() => {
    if (!emblaApi) return;

    setCurrent(emblaApi.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const spotlight = anime[current];

  return (
    <section className="relative pt-16">
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <Spinner className="size-8 text-muted-foreground" />
          </div>
        ) : (
          <div className="h-full" ref={emblaRef}>
            <div className="h-full flex">
              {anime.map((item, index) => (
                <div
                  key={item.id}
                  className="h-full flex-[0_0_100%] min-w-0 relative"
                >
                  <Image
                    src={item.poster}
                    alt={item.name}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent" />
                  <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {spotlight && (
          <div className="absolute inset-0 flex items-end pb-16 pointer-events-none">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-xl pointer-events-auto">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  #{spotlight.rank} Spotlight
                </p>

                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-3">
                  {spotlight.name}
                </h1>

                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {spotlight.description}
                </p>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/watch/${spotlight.id}/1`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Watch
                  </Link>
                  <Link
                    href={`/anime/${spotlight.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground/10 text-sm font-medium hover:bg-foreground/20 transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dots */}
        {anime.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {anime.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === current ? "bg-foreground w-4" : "bg-foreground/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
