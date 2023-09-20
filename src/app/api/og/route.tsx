import { env } from "@/env.mjs";
import { removeHtmlTags } from "@/lib/utils";
import type { ServerRuntime } from "next";
import { ImageResponse } from "next/server";
import * as z from "zod";

const ogImageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  episode: z.string().optional(),
  banner: z.string().url(),
  cover: z.string().url(),
});

export const runtime: ServerRuntime = "edge";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsedValues = ogImageSchema.parse(
      Object.fromEntries(url.searchParams)
    );

    const { title, banner, cover, episode } = parsedValues;
    const description = parsedValues.description
      ? removeHtmlTags(parsedValues.description)
      : env.NEXT_PUBLIC_APP_URL;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <img
            src={banner}
            style={{
              minWidth: "110%",
              minHeight: "100%",
              width: "110%",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              width: "30%",
              display: "flex",
            }}
          >
            <img
              src={cover}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
                paddingTop: 0,
                paddingBottom: 0,
                paddingRight: 10,
              }}
              alt={title}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
              background: "black",
              display: "flex",
              flexDirection: "column",
              borderRadius: 10,
              boxShadow: "7px 7px 17px rgba(0, 0, 0, 0.6)",
              width: "65%",
            }}
          >
            <h1
              style={{
                paddingLeft: 20,
                fontSize: 50,
                paddingBottom: 0,
                marginBottom: 0,
                color: "white",
                width: "85%",
                paddingTop: 5,
                display: "flex",
                alignItems: "center",
              }}
            >
              {title}
              {episode ? ` | Episode ${episode}` : ""}
            </h1>
            <p
              style={{
                paddingLeft: 20,
                fontSize: 25,
                color: "lightgray",
                marginTop: 10,
                width: "85%",
                paddingBottom: 10,
              }}
            >
              {description?.slice(0, 300)}
              {" ..."}
            </p>
            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                top: 0,
                display: "flex",
                alignItems: "center",
              }}
            ></div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    error instanceof Error
      ? console.log(`${error.message}`)
      : console.log(error);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
