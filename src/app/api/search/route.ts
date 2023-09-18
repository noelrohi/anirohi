import { anime } from "@/lib/jikan";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  if (!query) return NextResponse.json("Query is required!", { status: 400 });
  const [settled] = await Promise.allSettled([
    anime.getAnimeSearch({ q: query }),
  ]);
  if (settled.status === "rejected")
    return NextResponse.json([], { status: 200 });
  return NextResponse.json(
    settled.value.data.map(({ title, mal_id, year, images }) => {
      const data = {
        title: title,
        slug: mal_id,
        year: year,
        image: images.jpg.image_url,
      };
      return data;
    }),
    { status: 200 }
  );
}
