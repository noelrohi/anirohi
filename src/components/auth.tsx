"use client";
import { OAuthProviders } from "@/lib/nextauth";
import { signIn, signOut } from "next-auth/react";
import { toast } from "sonner";

interface AuthButtonProps {
  provider?: OAuthProviders;
  children: React.ReactNode;
  className?: string;
}

export function SignIn({ provider, children, className }: AuthButtonProps) {
  return (
    <button
      onClick={() => {
        toast.loading("Signing in...");
        signIn(provider).then(() => {
          toast.dismiss();
        });
      }}
      className={className}
    >
      {children}
    </button>
  );
}

export function SignOut({ children, className }: AuthButtonProps) {
  return (
    <button
      onClick={() => {
        toast.loading("Signing out...");
        signOut().then(() => {
          toast.dismiss();
          toast.success("Signed out successfully");
        });
      }}
      className={className}
    >
      {children}
    </button>
  );
}
