import { MediaQuery } from "@/types/anilist/media";
import { statisticQueries } from "./gql-queries";
import { animeInfo } from "./consumet";

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

export async function getMediaIdByTitle(title: string) {
  const query = `query($query: String, type:ANIME){
    Media(search: $query){
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
        query: title,
      },
    }),
  });
  if (!res.ok) return null;
  const { data } = await res.json();
  return data?.Media?.id;
}

export async function getMediaDataByTitle(title: string) {
  const query = animeInfo;
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        query: title,
      },
    }),
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!res.ok) return null;
  const { data }: MediaQuery = await res.json();
  return data;
}

export async function checkIsWatched(Props: {
  userName: string | null | undefined;
  mediaId: number | undefined;
  episodeNumber: number;
}) {
  const { userName, mediaId, episodeNumber } = Props;
  if (!userName && !mediaId) return null;
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
