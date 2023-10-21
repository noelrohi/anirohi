"use client";
import { signIn, signOut } from "@/_actions";
import { useTransition } from "react";
import { toast } from "sonner";

interface AuthButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function SignIn({ children, className }: AuthButtonProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => {
        toast.loading("Signing in...");
        startTransition(async () => {
          await signIn().then(() => toast.dismiss());
        });
      }}
      className={className}
      aria-disabled={isPending}
    >
      {isPending ? "Signing in..." : children}
    </button>
  );
}

export function SignOut({ children, className }: AuthButtonProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => {
        toast.loading("Signing out...");
        startTransition(async () => {
          await signOut().then(() => {
            toast.dismiss();
            toast.success("Signed out successfully");
          });
        });
      }}
      className={className}
      aria-disabled={isPending}
    >
      {isPending ? "Logging out..." : children}
    </button>
  );
}
