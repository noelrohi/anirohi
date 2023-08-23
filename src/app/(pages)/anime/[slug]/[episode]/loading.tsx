import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function EpisodeLoading() {
  return <LoadingEpisode />;
}

export function LoadingEpisode() {
  return (
    <main className="container">
      <div className="flex flex-col flex-end gap-4 justify-center min-h-[50vh]">
        <Skeleton className="w-20 h-6" />
        <div className="grid grid-cols-5">
          <section className="col-span-5 lg:col-span-4">
            <AspectRatio ratio={16 / 9}>
              <Skeleton className="w-full h-full" />
            </AspectRatio>
          </section>
          <aside className="lg:col-span-1">
            <div className="hidden lg:block ml-4">
              <div className="flex gap-4 items-center mb-4">
                <Skeleton className="w-16 h-16 rounded-md" />
              </div>
              <div className="h-[10rem] lg:h-[25rem] xl:h-[37rem] w-full rounded-md border">
                <Skeleton className="w-full h-full ok1" />
              </div>
            </div>
          </aside>
        </div>
        <div className="flex flex-row gap-1 p-4 justify-end w-fit">
          <Skeleton className="w-20 h-6 rounded-md" />
          <Skeleton className="w-20 h-6 rounded-md" />
          <Skeleton className="w-20 h-6 rounded-md" />
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col gap-4 justify-center p-4 w-fit">
            <Skeleton className="w-40 h-10 rounded-md" />
            <Skeleton className="w-[17rem] lg:w-[36rem] h-40 rounded-md" />
            <Separator className="my-2" />
            <div className="block lg:hidden">
              <div className="hidden lg:block ml-4">
                <div className="flex gap-4 items-center mb-4">
                  <Skeleton className="w-16 h-16 rounded-md" />
                </div>
                {/* aside */}
                <div className="h-[10rem] lg:h-[32rem] xl:h-[37rem] w-full rounded-md border">
                  <Skeleton className="w-full h-full ok" /> sd
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
