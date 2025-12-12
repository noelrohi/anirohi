import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <Link href="/" className="font-heading text-xl text-foreground">
              ani<span className="text-cyan">rohi</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground/60 max-w-xs">
              Stream anime. No ads. No interruptions.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
            <Link href="/home" className="text-muted-foreground hover:text-foreground transition-colors">
              Browse
            </Link>
            <Link href="/home" className="text-muted-foreground hover:text-foreground transition-colors">
              Schedule
            </Link>
            <Link href="/dmca" className="text-muted-foreground hover:text-foreground transition-colors">
              DMCA
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-muted-foreground/40">
            © 2024 AniRohi. For educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
