import { NextRequest, NextResponse } from "next/server";
import { ALLOWED_ORIGINS, isAllowedOrigin } from "@/lib/config/cors";

export async function GET(request: NextRequest) {
  // CORS protection
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        Referer: "https://megacloud.blog/",
        Origin: "https://megacloud.blog",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    let body: ArrayBuffer | string = await response.arrayBuffer();

    // If it's an HLS manifest, rewrite URLs to go through our proxy
    if (url.includes(".m3u8") || contentType.includes("mpegurl")) {
      const text = new TextDecoder().decode(body);
      const baseUrl = new URL(url);
      const proxyBase = `${request.nextUrl.origin}/api/proxy?url=`;

      // Rewrite relative and absolute URLs in the manifest
      const rewritten = text
        .split("\n")
        .map((line) => {
          const trimmed = line.trim();
          // Skip comments and empty lines
          if (trimmed.startsWith("#") || trimmed === "") {
            // But check for URI= in EXT-X tags
            if (trimmed.includes("URI=")) {
              return trimmed.replace(/URI="([^"]+)"/g, (_, uri) => {
                const absoluteUrl = uri.startsWith("http")
                  ? uri
                  : new URL(uri, baseUrl).href;
                return `URI="${proxyBase}${encodeURIComponent(absoluteUrl)}"`;
              });
            }
            return line;
          }
          // It's a URL line
          if (trimmed.startsWith("http")) {
            return `${proxyBase}${encodeURIComponent(trimmed)}`;
          }
          // Relative URL
          const absoluteUrl = new URL(trimmed, baseUrl).href;
          return `${proxyBase}${encodeURIComponent(absoluteUrl)}`;
        })
        .join("\n");

      body = rewritten;
    }

    const origin = request.headers.get("origin") || "";
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Access-Control-Allow-Origin", allowedOrigin);
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "*");
    headers.set("Cache-Control", "public, max-age=3600");

    return new NextResponse(body, { headers });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
