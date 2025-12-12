# Video Proxy - Cloudflare Worker

This project uses the `m3u8proxy` Cloudflare Worker for video streaming proxy.

## Location

```
~/sandbox/m3u8proxy
```

## Why Use Cloudflare Workers?

| Aspect | Vercel Serverless | Cloudflare Workers |
|--------|-------------------|-------------------|
| Bandwidth (Free) | 100GB/month | 100GB/month |
| Bandwidth (Paid) | $40/100GB overage | $0.05/GB |
| Execution Time | 10s hobby / 60s pro | 30s+ |
| Cold Starts | ~250ms | ~0ms (edge) |
| Global Distribution | Limited regions | 300+ edge locations |

## Usage

The proxy is integrated via `src/lib/proxy.ts`:

```ts
import { getProxyUrl } from "@/lib/proxy";

// Generates URL using NEXT_PUBLIC_PROXY_URL if set, otherwise falls back to /api/proxy
getProxyUrl("https://example.com/video.m3u8");
```

## V2 Endpoint Format

The m3u8proxy V2 endpoint accepts:

```
/v2?url={encoded_url}&headers={encoded_json_headers}
```

Example:
```
/v2?url=https%3A%2F%2Fexample.com%2Fvideo.m3u8&headers=%7B%22Referer%22%3A%22https%3A%2F%2Fmegacloud.blog%2F%22%7D
```

## Configuration

### Environment Variable (Required)

Set in `.env.local`:

```env
NEXT_PUBLIC_PROXY_URL=https://your-m3u8proxy.workers.dev
```

The app will throw an error if this is not set.

### Deploy m3u8proxy

```bash
cd ~/sandbox/m3u8proxy

# Development
bunx wrangler dev

# Production
bunx wrangler deploy
```

## Features

The m3u8proxy handles:

- HLS manifest (`.m3u8`) URL rewriting
- Custom headers (Referer, Origin, User-Agent)
- Range requests for seeking
- CORS headers (`Access-Control-Allow-Origin: *`)
- `#EXT-X-MAP:URI` metadata rewriting

## Default Headers

The `getProxyUrl` function automatically includes:

```ts
{
  Referer: "https://megacloud.blog/",
  Origin: "https://megacloud.blog",
}
```
