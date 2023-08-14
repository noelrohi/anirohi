"use client";
import { OAuthProviders } from "@/lib/nextauth";
import { signIn, signOut } from "next-auth/react";

interface AuthButtonProps {
  provider?: OAuthProviders;
  children: React.ReactNode;
  className?: string;
}

export function SignIn({ provider, children, className }: AuthButtonProps) {
  return (
    <button onClick={() => signIn(provider)} className={className}>
      {children}
    </button>
  );
}

export function SignOut({ children, className }: AuthButtonProps) {
  return (
    <button onClick={() => signOut()} className={className}>
      {children}
    </button>
  );
}
