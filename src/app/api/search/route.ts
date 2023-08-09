import { searchAnime } from "@/lib/enime";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  if (!query) return NextResponse.json("Query is required!", { status: 400 });
  const data = await searchAnime(query);
  return NextResponse.json(
    data.data.map(({ title, slug }) => {
      return {
        title: title.userPreferred,
        slug: slug,
      };
    }),
    { status: 200 }
  );
}
