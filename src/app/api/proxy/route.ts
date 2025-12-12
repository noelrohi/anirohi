import { type NextRequest } from "next/server";
import { getAllowedOrigin, isAllowedOrigin } from "@/lib/config/cors";

function getCorsHeaders(origin: string | null): HeadersInit {
  return {
    "Access-Control-Allow-Origin": getAllowedOrigin(origin),
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Range",
  };
}

const m3u8ContentTypes = [
  "application/vnd.",
  "video/mp2t",
  "application/x-mpegurl",
  "application/mpegurl",
  "application/vnd.apple.mpegurl",
  "audio/mpegurl",
  "audio/x-mpegurl",
  "video/x-mpegurl",
];

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("Origin");
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("Origin");

  if (!isAllowedOrigin(origin)) {
    return Response.json(
      { success: false, message: "Origin not allowed" },
      { status: 403, headers: getCorsHeaders(origin) }
    );
  }

  const url = request.nextUrl.searchParams.get("url");
  const headersParam = request.nextUrl.searchParams.get("headers");

  if (!url) {
    return Response.json(
      { success: false, message: "no url provided" },
      { status: 400, headers: getCorsHeaders(origin) }
    );
  }

  let customHeaders: Record<string, string> = {};
  if (headersParam) {
    try {
      customHeaders = JSON.parse(headersParam);
    } catch {
      console.log("[Proxy] Malformed headers, using defaults");
    }
  }

  const headers: Record<string, string> = {
    ...customHeaders,
  };

  // Forward range header for seeking
  const rangeHeader = request.headers.get("Range");
  if (rangeHeader) {
    headers["Range"] = rangeHeader;
  }

  try {
    const response = await fetch(url, { headers });
    const contentType = response.headers.get("Content-Type")?.toLowerCase() || "";

    const isM3u8 =
      url.endsWith(".m3u8") ||
      m3u8ContentTypes.some((type) => contentType.includes(type));

    let body: string | ArrayBuffer;

    if (isM3u8) {
      const text = await response.text();
      const baseUrl = new URL(url);
      const lines = text.split("\n");
      const rewritten: string[] = [];

      for (const line of lines) {
        const trimmed = line.trim();

        // Handle #EXT-X-MAP:URI
        if (trimmed.startsWith('#EXT-X-MAP:URI="')) {
          const uri = trimmed.match(/URI="([^"]+)"/)?.[1];
          if (uri) {
            const absoluteUrl = resolveUrl(uri, baseUrl);
            const params = new URLSearchParams({ url: absoluteUrl });
            if (headersParam) params.set("headers", headersParam);
            rewritten.push(`#EXT-X-MAP:URI="/api/proxy?${params.toString()}"`);
          } else {
            rewritten.push(line);
          }
          continue;
        }

        // Handle other URI/URL in comments
        if (trimmed.startsWith("#") && (trimmed.toLowerCase().includes("uri") || trimmed.toLowerCase().includes("url"))) {
          const uriMatch = trimmed.match(/URI="([^"]+)"/i);
          if (uriMatch) {
            const absoluteUrl = resolveUrl(uriMatch[1], baseUrl);
            const params = new URLSearchParams({ url: absoluteUrl });
            if (headersParam) params.set("headers", headersParam);
            rewritten.push(trimmed.replace(/URI="[^"]+"/i, `URI="/api/proxy?${params.toString()}"`));
            continue;
          }
        }

        // Skip comments and empty lines
        if (trimmed.startsWith("#") || !trimmed) {
          rewritten.push(line);
          continue;
        }

        // Rewrite segment URLs
        const absoluteUrl = resolveUrl(trimmed, baseUrl);
        const params = new URLSearchParams({ url: absoluteUrl });
        if (headersParam) params.set("headers", headersParam);
        rewritten.push(`/api/proxy?${params.toString()}`);
      }

      body = rewritten.join("\n");
    } else {
      body = await response.arrayBuffer();
    }

    const responseHeaders = new Headers(getCorsHeaders(origin));
    responseHeaders.set("Content-Type", contentType || "application/octet-stream");

    // Forward content-range for seeking
    const contentRange = response.headers.get("Content-Range");
    if (contentRange) {
      responseHeaders.set("Content-Range", contentRange);
    }

    return new Response(body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return Response.json(
      { success: false, message: "Proxy request failed" },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

function resolveUrl(input: string, base: URL): string {
  try {
    return new URL(input).toString();
  } catch {
    if (input.startsWith("//")) {
      return `https:${input}`;
    }
    const pathname = input.startsWith("/") ? input.substring(1) : input;
    const pathnames = base.pathname.split("/");
    pathnames.pop();
    pathnames.push(pathname);
    return `${base.origin}${pathnames.join("/")}`;
  }
}
