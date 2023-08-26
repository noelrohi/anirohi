"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-8">
      <h2 className="font-bold leading-tight text-3xl">
        Oops! {error.message}
      </h2>
      <div className="flex flex-row gap-4">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
        <Button
          disabled={isPending}
          variant={"secondary"}
          onClick={() => {
            startTransition(() => {
              router.push("/home");
            });
          }}
        >
          {isPending ? "Going" : "Go "} to Home
        </Button>
      </div>
    </div>
  );
}
