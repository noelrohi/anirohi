import { SiteFooter } from "@/components/layout/site-footer";
import GridPattern from "@/components/magicui/grid-pattern";
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
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={
          "-z-10 stroke-gray-300/30 [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] "
        }
      />
    </div>
  );
}
