import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";

interface StickyLayoutProps {
  children: React.ReactNode;
}

export default async function StickyLayout({ children }: StickyLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader sticky />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
