import { Suspense } from "react";
import Image from "next/image";
import { Navbar } from "@/components/blocks/navbar";
import { Footer } from "@/components/blocks/footer";
import { Spinner } from "@/components/ui/spinner";
import { ScheduleContent } from "./schedule-content";

function ScheduleLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner className="size-8 text-muted-foreground" />
    </div>
  );
}

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-14">
        <div className="relative h-[30vh] md:h-[35vh] overflow-hidden">
          <Image
            src="/images/schedule-hero.webp"
            alt=""
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/40" />

          <div className="absolute inset-0 flex items-end pb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2">
                Airing
              </p>
              <h1 className="font-heading text-4xl md:text-5xl text-foreground">
                Schedule
              </h1>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<ScheduleLoading />}>
        <ScheduleContent />
      </Suspense>

      <Footer />
    </div>
  );
}
