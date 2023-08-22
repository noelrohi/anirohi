import { searchAnime } from "@/lib/enime";
import { getTitle } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  if (!query) return NextResponse.json("Query is required!", { status: 400 });
  const [settled] = await Promise.allSettled([searchAnime(query)]);
  if (settled.status === "rejected")
    return NextResponse.json([], { status: 200 });
  return NextResponse.json(
    settled.value.data.map(({ title, slug, year, coverImage }) => {
      const data = {
        title: getTitle(title),
        slug: slug,
        year: year,
        image: coverImage,
      };
      return data;
    }),
    { status: 200 }
  );
}
