import { statisticQueries } from "./gql-queries";

export async function queryAnilist(
  query: string,
  token: string,
  variables?: Record<string, any>
) {
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const data = await res.json();
  return data;
}

export async function mutateAnilist(
  mutation: string,
  token: string,
  variables?: Record<string, any>
) {
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: mutation,
      variables,
    }),
  });
  const data = await res.json();
  return data;
}

export async function getMediaIdByMalId(mal_id: number) {
  const query = `query($id: Int){
    Media(id: $id){
      id
    }
  }`;
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        id: mal_id,
      },
    }),
  });
  if (!res.ok) return null;
  const { data } = await res.json();
  return data?.Media?.id;
}

export async function checkIsWatched(Props: {
  userName: string | null | undefined;
  mediaId: number;
  episodeNumber: number;
}) {
  const { userName, mediaId, episodeNumber } = Props;
  if (!userName) return null;
  const query = `query($userName: String, $mediaId: Int){
    MediaList(userName:$userName, mediaId: $mediaId){
      progress
    }
  }`;

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        userName: userName,
        mediaId: mediaId,
      },
    }),
  });
  if (!res.ok) return null;
  const { data } = await res.json();
  // console.log(data, "data");
  return data?.MediaList?.progress >= episodeNumber;
}

export async function getStats(
  userName: string,
  queryType: keyof typeof statisticQueries
) {
  const query = statisticQueries[queryType];
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        name: userName,
      },
    }),
  });
  if (!res.ok) throw new Error(`User '${userName}' not found!!`);
  const data = await res.json();
  return data;
}
