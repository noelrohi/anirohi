import { Icons } from "@/components/icons";
import ShimmerButton from "@/components/magicui/shimmer-button";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function IndexPage() {
  return (
    <>
      <section className="space-y-6 pt-6 pb-8 lg:py-32 md:pt-10 md:pb-12">
        <div className="container flex max-w-5xl flex-col items-center gap-4 text-center">
          {/* <Link href={"/notifications"}>
            <Badge variant={"pill"}>We added anilist notifications 🎉</Badge>
          </Link> */}
          <h1 className="text-balance font-bold text-3xl leading-tight tracking-tighter lg:text-7xl md:text-5xl lg:leading-[1.1]">
            An anime streaming app built using Nextjs Server Components.
          </h1>
          <div className="text-balance text-lg text-muted-foreground sm:text-xl">
            This ad-free app aims to provide a seamless experience for users who
            want to utilize Anilist without the need for additional browser
            extensions.
          </div>
          <Link href="/home">
            <ShimmerButton>
              <span className="z-10 whitespace-pre bg-gradient-to-b from-30% from-black to-gray-300/80 bg-clip-text text-center font-semibold text-sm text-white leading-none tracking-tight dark:from-white dark:to-slate-900/10 dark:text-transparent lg:text-2xl">
                Start Watching
              </span>
            </ShimmerButton>
          </Link>
        </div>
      </section>
      <section
        id="features"
        className="space-y-6 bg-slate-50 py-8 dark:bg-slate-950 lg:py-24 md:py-12"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-bold text-3xl leading-[1.1] md:text-5xl sm:text-3xl">
            Features
          </h2>
          <div className="max-w-[85%] text-balance text-muted-foreground leading-normal sm:text-lg sm:leading-7">
            Tracking progress, history, comments section for enhanced
            interaction and detailed statistics to keep users informed about
            their anime-watching habits. Check author&apos;s stats{" "}
            <Link href={"/u/nrohi"} className="underline underline-offset-4">
              here.
            </Link>
          </div>
        </div>
        <div className="mx-auto text-center md:max-w-[58rem]">
          <div className="text-balance text-muted-foreground leading-normal sm:text-lg sm:leading-7">
            Experience all these superb functionalities in one convenient
            application.
          </div>
        </div>
      </section>
      <section id="open-source" className="container py-8 lg:py-24 md:py-12">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-bold text-3xl leading-[1.1] md:text-5xl sm:text-3xl">
            Proudly Open Source
          </h2>
          <p className="max-w-[85%] text-muted-foreground leading-normal sm:text-lg sm:leading-7">
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
              <Icons.gitHub className="mr-2 size-4" />
              Star on Github
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
