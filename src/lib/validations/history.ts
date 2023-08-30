import { z } from "zod";

export const historySchema = z.object({
  title: z.string().nullable(),
  image: z.string().nullable(),
  episodeNumber: z.number(),
  played: z.number(),
});
