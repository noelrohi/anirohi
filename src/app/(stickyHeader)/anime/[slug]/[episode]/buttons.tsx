"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
