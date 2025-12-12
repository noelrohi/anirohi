<p align="center">
  <img src="src/app/favicon.ico" alt="Anirohi Logo" width="80" height="80" />
</p>

<h1 align="center">Anirohi</h1>

<p align="center">
  <strong>Stream anime. No interruptions.</strong>
</p>

<p align="center">
  <a href="https://github.com/noelrohi/anirohi/stargazers">
    <img src="https://img.shields.io/github/stars/noelrohi/anirohi?style=flat&color=06b6d4" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/noelrohi/anirohi/network/members">
    <img src="https://img.shields.io/github/forks/noelrohi/anirohi?style=flat&color=06b6d4" alt="GitHub Forks" />
  </a>
  <a href="https://github.com/noelrohi/anirohi/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/noelrohi/anirohi?style=flat&color=06b6d4" alt="License" />
  </a>
</p>

<p align="center">
  <img src="src/app/opengraph-image.png" alt="Anirohi Screenshot" width="100%" />
</p>

## Features

- **Clean UI** — Minimalist design focused on content
- **Fast Search** — Quick anime discovery with command menu (⌘K)
- **Trending** — Stay updated with currently popular anime
- **Schedule** — Track upcoming episode releases
- **PWA Support** — Install as a native app on any device

## Tech Stack

- [Next.js 15](https://nextjs.org/) — React framework with App Router
- [React 19](https://react.dev/) — UI library with React Compiler
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) — Accessible component primitives
- [oRPC](https://orpc.dev/) — End-to-end typesafe APIs
- [TanStack Query](https://tanstack.com/query) — Async state management
- [Aniwatch API](https://github.com/ghoshRitesh12/aniwatch-api) — Anime data provider

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/noelrohi/anirohi.git
cd anirohi

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_PROXY_URL` | Yes | URL of the [m3u8proxy](https://github.com/noelrohi/m3u8proxy) Cloudflare Worker |

### Running

```bash
# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Commands

```bash
bun dev       # Start development server
bun build     # Build for production
bun start     # Start production server
bun lint      # Run ESLint
```

## Star History

<a href="https://star-history.com/#noelrohi/anirohi&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=noelrohi/anirohi&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=noelrohi/anirohi&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=noelrohi/anirohi&type=Date" />
 </picture>
</a>

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/noelrohi">noelrohi</a>
</p>
