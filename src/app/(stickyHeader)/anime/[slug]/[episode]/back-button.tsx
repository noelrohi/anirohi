"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function BackButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Button variant={"ghost"}>
      <Icons.left
        className="mr-2"
        onClick={() => {
          startTransition(() => router.back());
        }}
      />{" "}
      Back
    </Button>
  );
}
