import { RPCHandler } from "@orpc/server/fetch";
import { onError } from "@orpc/server";
import { CORSPlugin } from "@orpc/server/plugins";
import { appRouter } from "@/lib/orpc/router";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://anirohi.vercel.app",
  "https://anirohi.xyz",
];

const handler = new RPCHandler(appRouter, {
  plugins: [
    new CORSPlugin({
      origin: (origin) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
          return origin;
        }
        return undefined;
      },
      allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error("[oRPC Error]:", error);
    }),
  ],
});

async function handleRequest(request: Request) {
  const origin = request.headers.get("origin");

  // Block cross-origin requests from unknown origins
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  const { response } = await handler.handle(request, {
    prefix: "/rpc",
    context: {},
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
