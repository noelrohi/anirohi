function getAnilistQuery() {
  return `query {
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
}

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization)
      return Response.json("Token is required!", { status: 401 });
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: getAnilistQuery(),
      }),
    });
    const data = await res.json();
    const { id, name, avatar } = data.data.Viewer;

    return Response.json(
      {
        id: String(id),
        username: name,
        image_url: avatar.large,
        email: `${name}.anirohi@gmail.com`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
