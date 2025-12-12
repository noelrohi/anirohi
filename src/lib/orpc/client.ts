import { createORPCClient, onError } from "@orpc/client";
import type { InferClientOutputs } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { DedupeRequestsPlugin } from "@orpc/client/plugins";
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "./router";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

const link = new RPCLink({
  url: `${getBaseUrl()}/rpc`,
  plugins: [
    new DedupeRequestsPlugin({
      filter: ({ request }) => request.method === "GET",
      groups: [
        {
          condition: () => true,
          context: {},
        },
      ],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error("[oRPC Error]:", error);
    }),
  ],
});

export const orpcClient: RouterClient<AppRouter> = createORPCClient(link);

export type RouterOutputs = InferClientOutputs<RouterClient<AppRouter>>;
