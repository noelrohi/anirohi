import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";

interface LobbyLayoutProps {
  children: React.ReactNode;
}

export default async function LobbyLayout({ children }: LobbyLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader className="bg-transparent" />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
