import { queryAnilist } from "@/lib/anilist";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization)
      return NextResponse.json("Token is required!", { status: 401 });
    const query = `query {
            Viewer {
            id
            name
            avatar {
                large
                medium
            }
            bannerImage
            }
        }`;
    const data = await queryAnilist(query, authorization);
    const { id, name, avatar } = data.data.Viewer;

    return NextResponse.json(
      {
        id: String(id),
        username: name,
        image_url: avatar.large,
        email: `${name}.anym8@gmail.com`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}
