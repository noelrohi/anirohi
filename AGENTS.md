# AGENTS.md

## Documentation
- `docs/platform.md` - UI screens, components, user flows, features
- `docs/architecture.md` - App startup, storage, data lifecycle, technical flows

## Commands
```bash
bun run dev      # Start dev server (localhost:3000)
bun run build    # Production build
bun run lint     # Run ESLint
```
No test framework configured.

## Code Style
- **File naming**: kebab-case (e.g., `use-watch-progress.ts`, `browse-content.tsx`)
- **Imports**: Use `@/*` alias for `src/*`. Group: external deps, then `@/` imports, then relative
- **Types**: Strict mode enabled. Use `type` imports where possible. Prefer interfaces for objects
- **Formatting**: No semicolons in UI components, semicolons in other files. 2-space indent
- **Components**: Function declarations, not arrow functions. Export at bottom of file
- **Styling**: Use `cn()` from `@/lib/utils` for class merging. Tailwind CSS v4 with oklch colors

## Architecture
- Next.js 16 App Router with React 19 and React Compiler
- `src/components/ui/` - shadcn/ui primitives (add via `bunx shadcn@latest add <component>`)
- `src/components/blocks/` - Page sections and reusable blocks
- `src/hooks/` - Custom hooks for watch progress, saved series, player preferences
- `src/lib/orpc/` - oRPC router and procedures (API layer)
- `src/lib/query/` - TanStack Query setup
- Pages should compose blocks and stay under 500 lines
