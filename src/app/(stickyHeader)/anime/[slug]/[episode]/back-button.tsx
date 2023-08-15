"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  useParams,
  usePathname,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useTransition } from "react";

export function BackButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Button variant={"ghost"} className="max-w-fit">
      <Icons.left
        className="mr-2"
        onClick={() => {
          startTransition(() => {
            console.log("going back");
            router.back();
          });
        }}
      />
      Back
    </Button>
  );
}

export function NextButton({
  episodeNumber,
  slug,
}: {
  episodeNumber: number;
  slug: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant={"secondary"}
      onClick={() => {
        // const newPath = pathname.split[0] + pathname.split("/")[-1];
        startTransition(() => router.push(`/anime/${slug}/${episodeNumber}`));
      }}
    >
      Next <Icons.right className="ml-2" />
    </Button>
  );
}
