import Link from "next/link";
import Balance from "react-wrap-balancer";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";

// export const runtime = "edge"

export default function IndexPage() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            An anime streaming app built with everything new in Next.js 13
          </h1>
          <Balance className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
            maxime consectetur ab. Dicta magnam quas saepe? Illum aspernatur
            quos laborum doloribus ea, eum praesentium itaque, commodi magni
            beatae facere reiciendis.
          </Balance>
          <div className="space-x-4">
            <Link href="/home" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              GitHub
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
          <Balance className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Just like any anime streaming site, this app includes videos,
            watchlist and comments.
          </Balance>
        </div>
        <div className="mx-auto text-center md:max-w-[58rem]">
          <Balance className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Velit sit laborum laboris officia. Commodo ad in ut aliqua tempor
            nisi Lorem ullamco.
          </Balance>
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
