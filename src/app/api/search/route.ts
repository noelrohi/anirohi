import { search } from "@/lib/consumet";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  if (!query) return NextResponse.json("Query is required!", { status: 400 });
  const [settled] = await Promise.allSettled([search({ query })]);
  if (settled.status === "rejected")
    return NextResponse.json([], { status: 200 });
  return NextResponse.json(
    settled.value.results.map(({ title, id, releaseDate, image }) => {
      const data = {
        title: title,
        slug: id,
        year: releaseDate,
        image,
      };
      return data;
    }),
    { status: 200 }
  );
}
