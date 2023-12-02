import { Icons } from "@/components/icons";
import ShimmerButton from "@/components/magicui/shimmer-button";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function IndexPage() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex flex-col items-center gap-4 text-center max-w-5xl">
          {/* <Link href={"/notifications"}>
            <Badge variant={"pill"}>We added anilist notifications 🎉</Badge>
          </Link> */}
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-7xl lg:leading-[1.1] [text-wrap:balance]">
            An anime streaming app built using Nextjs Server Components.
          </h1>
          <div className="text-lg text-muted-foreground sm:text-xl [text-wrap:balance]">
            This ad-free app aims to provide a seamless experience for users who
            want to utilize Anilist without the need for additional browser
            extensions.
          </div>
          <Link href="/home">
            <ShimmerButton>
              <span className="whitespace-pre bg-gradient-to-b from-black from-30% to-gray-300/80 bg-clip-text text-center text-sm lg:text-2xl font-semibold leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 dark:text-transparent z-10">
                Start Watching
              </span>
            </ShimmerButton>
          </Link>
        </div>
      </section>
      <section
        id="features"
        className="space-y-6 bg-slate-50 py-8 dark:bg-slate-950 md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
            Features
          </h2>
          <div className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 [text-wrap:balance]">
            Tracking progress, history, comments section for enhanced
            interaction and detailed statistics to keep users informed about
            their anime-watching habits. Check author&apos;s stats{" "}
            <Link href={`/u/nrohi`} className="underline underline-offset-4">
              here.
            </Link>
          </div>
        </div>
        <div className="mx-auto text-center md:max-w-[58rem]">
          <div className="leading-normal text-muted-foreground sm:text-lg sm:leading-7 [text-wrap:balance]">
            Experience all these superb functionalities in one convenient
            application.
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
