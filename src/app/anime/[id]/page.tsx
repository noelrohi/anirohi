import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/blocks/navbar";
import { Footer } from "@/components/blocks/footer";
import { getAnimeById, generateEpisodes, animeList } from "@/lib/mock-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const anime = getAnimeById(id);

  if (!anime) {
    notFound();
  }

  const episodes = generateEpisodes(anime.id, anime.episodes);
  const relatedAnime = animeList
    .filter((a) => a.id !== anime.id && a.genres.some((g) => anime.genres.includes(g)))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-14">
        <div className="relative h-[50vh] overflow-hidden">
          <Image
            src={anime.bannerImage}
            alt={anime.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Info */}
        <div className="relative -mt-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cover */}
            <div className="relative w-40 md:w-52 aspect-[3/4] rounded-lg overflow-hidden shadow-xl flex-shrink-0">
              <Image
                src={anime.coverImage}
                alt={anime.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Details */}
            <div className="flex-1 pt-4 md:pt-20">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                {anime.type} · {anime.status} · {anime.year}
              </p>

              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-2">
                {anime.title}
              </h1>

              <p className="text-sm text-muted-foreground/60 mb-4">
                {anime.japaneseTitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <span>{anime.episodes} episodes</span>
                <span>{anime.duration}</span>
                <span>{anime.studio}</span>
                <span className="text-yellow-500">{anime.rating}</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <Link
                  href={`/watch/${anime.id}/1`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-background text-sm font-medium hover:bg-white/90 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch
                </Link>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 text-sm font-medium hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 rounded-full bg-white/5 text-xs text-muted-foreground"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Synopsis & Episodes */}
      <section className="py-10 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Synopsis */}
              <div>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  Synopsis
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {anime.synopsis}
                </p>
              </div>

              {/* Episodes */}
              <div>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  Episodes
                </h2>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {episodes.map((episode) => (
                    <Link
                      key={episode.id}
                      href={`/watch/${anime.id}/${episode.number}`}
                      className="aspect-square rounded-lg bg-white/5 flex items-center justify-center text-sm text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                    >
                      {episode.number}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/[0.02] rounded-xl p-5 border border-white/5">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  Information
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground/60">Type</dt>
                    <dd>{anime.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground/60">Episodes</dt>
                    <dd>{anime.episodes}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground/60">Status</dt>
                    <dd>{anime.status}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground/60">Year</dt>
                    <dd>{anime.year}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground/60">Duration</dt>
                    <dd>{anime.duration}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground/60">Studio</dt>
                    <dd>{anime.studio}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground/60">Rating</dt>
                    <dd>{anime.rating}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {relatedAnime.length > 0 && (
        <section className="py-10 px-4 border-t border-white/5">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
              You may also like
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {relatedAnime.map((item) => (
                <Link key={item.id} href={`/anime/${item.id}`} className="group block">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-white/5">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-2 text-sm text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
