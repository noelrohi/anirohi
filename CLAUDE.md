# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation

- `docs/platform.md` - UI screens, components, user flows, features
- `docs/architecture.md` - App startup, storage, data lifecycle, technical flows

## Commands

```bash
bun run dev          # Start development server (localhost:3000)
bun run build        # Production build
bun run start        # Start production server
bun run lint         # Run ESLint
```

## Architecture

This is a Next.js 16 anime streaming application using the App Router with React 19 and Tailwind CSS v4.

### Key Technologies
- **React Compiler** enabled via `next.config.ts` (`reactCompiler: true`)
- **Tailwind CSS v4** with PostCSS plugin (`@tailwindcss/postcss`)
- **shadcn/ui** components (new-york style) with Radix UI primitives
- **oRPC** for typesafe client-server API communication
- **TanStack Query** for server state management and caching
- **Vidstack** for video player with HLS.js support
- **Aniwatch** library for anime data scraping (HiAnime)

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/blocks/` - Reusable page blocks/sections (navbar, footer, carousel)
- `src/components/ui/` - shadcn/ui components (button, carousel, tabs, etc.)
- `src/hooks/` - Custom hooks (use-watch-progress, use-saved-series, use-player-preferences)
- `src/lib/orpc/` - oRPC router and procedures
- `src/lib/query/` - TanStack Query setup
- `src/lib/aniwatch/` - HiAnime scraper singleton
- `src/lib/utils.ts` - `cn()` utility for merging Tailwind classes

### Conventions
- **File naming**: Use kebab-case for all file names (e.g., `user-profile.tsx`, `auth-form.tsx`)
- **Page structure**: Pages should be clean and compose blocks from `src/components/blocks/`
- **Page size limit**: Pages should not exceed 500 lines of code

### Path Aliases
- `@/*` maps to `./src/*`

### Styling
- CSS variables defined in `src/app/globals.css` using oklch colors
- Dark mode via `.dark` class with `@custom-variant dark`
- Design tokens: `--background`, `--foreground`, `--primary`, `--cyan`, `--pink`, etc.

### Adding UI Components
Use shadcn CLI: `bunx shadcn@latest add <component>`
