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
