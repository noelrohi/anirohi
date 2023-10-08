import { Icons } from "@/components/icons";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import Link from "next/link";

// export const runtime = "edge"

export default function IndexPage() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-7xl lg:leading-[1.1] [text-wrap:balance]">
            An anime streaming app built using Nextjs 13 Server Components.
          </h1>
          <div className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl [text-wrap:balance]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
            maxime consectetur ab. Dicta magnam quas saepe.
          </div>
          <div className="space-x-4">
            <Link href="/home">
              <ShimmerButton>
                <span className="whitespace-pre bg-gradient-to-b from-black from-30% to-gray-300/80 bg-clip-text text-center text-sm lg:text-2xl font-semibold leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 dark:text-transparent z-10">
                  Start Watching
                </span>
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
            Features
          </h2>
          <div className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 [text-wrap:balance]">
            Just like any anime streaming site, this app includes videos,
            watchlist and comments.
          </div>
        </div>
        <div className="mx-auto text-center md:max-w-[58rem]">
          <div className="leading-normal text-muted-foreground sm:text-lg sm:leading-7 [text-wrap:balance]">
            Velit sit laborum laboris officia. Commodo ad in ut aliqua tempor
            nisi Lorem ullamco.
          </div>
        </div>
      </section>
      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
            Proudly Open Source
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            {siteConfig.name} is open source and powered by open source
            software. <br /> The code is available on{" "}
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              GitHub
            </Link>
            .{" "}
          </p>

          <Button asChild>
            <Link href={siteConfig.links.github}>
              <Icons.gitHub className="mr-2 h-4 w-4" />
              Star on Github
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
