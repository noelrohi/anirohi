import { isAllowedOrigin } from "@/lib/config/cors";
import { appRouter } from "@/lib/orpc/router";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin } from "@orpc/server/plugins";

const handler = new RPCHandler(appRouter, {
  plugins: [
    new CORSPlugin({
      origin: (origin) => {
        if (isAllowedOrigin(origin ?? null)) {
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
  if (!isAllowedOrigin(origin)) {
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
