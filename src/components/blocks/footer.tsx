import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Atmospheric gradient backdrop */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 100%, oklch(0.75 0.18 195 / 12%) 0%, transparent 60%)`,
        }}
      />

      {/* Decorative top line */}
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-foreground/10 to-transparent" />
          <div className="h-1.5 w-1.5 rotate-45 bg-cyan/60" />
          <div className="h-px flex-1 bg-linear-to-l from-transparent via-foreground/10 to-transparent" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-start">
          {/* Brand column */}
          <div className="space-y-6">
            <Link href="/" className="group inline-block">
              <span className="font-heading text-3xl tracking-tight text-foreground/90 transition-colors group-hover:text-foreground">
                ani<span className="text-cyan glow-text">rohi</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground/50">
              Your portal to endless anime. <br />
              No ads. No interruptions. Just stories.
            </p>
          </div>

          {/* Navigation columns */}
          <div className="flex gap-12 text-sm sm:gap-16 lg:gap-24">
            <nav className="space-y-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/30">
                Explore
              </p>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/browse"
                    className="text-muted-foreground/60 transition-colors hover:text-cyan"
                  >
                    Browse
                  </Link>
                </li>
                <li>
                  <Link
                    href="/schedule"
                    className="text-muted-foreground/60 transition-colors hover:text-cyan"
                  >
                    Schedule
                  </Link>
                </li>
              </ul>
            </nav>

            <nav className="space-y-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/30">
                Legal
              </p>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/dmca"
                    className="text-muted-foreground/60 transition-colors hover:text-cyan"
                  >
                    DMCA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground/60 transition-colors hover:text-cyan"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground/60 transition-colors hover:text-cyan"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </nav>

            <nav className="space-y-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/30">
                Connect
              </p>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground/60 transition-colors hover:text-cyan"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/noelrohi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground/60 transition-colors hover:text-cyan"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/noelrohi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground/60 transition-colors hover:text-cyan"
                  >
                    X (Formerly Twitter)
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-[11px] text-muted-foreground/30">
            © 2025 Anirohi
          </p>
          <p className="text-[11px] text-muted-foreground/20">
            Made with love for anime fans
          </p>
        </div>
      </div>
    </footer>
  );
}
