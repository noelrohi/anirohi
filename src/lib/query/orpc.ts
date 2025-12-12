import { orpcClient } from "@/lib/orpc/client";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

export const orpc = createTanstackQueryUtils(orpcClient);
