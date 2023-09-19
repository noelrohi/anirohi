export const statisticQueries = {
  lists: `query ($name: String) {
            User(name: $name) {
              id
              name
              statistics {
                anime {
                  formats {
                    format
                    count
                    meanScore
                    minutesWatched
                    chaptersRead
                    mediaIds
                  }
                  statuses {
                    status
                    count
                    meanScore
                    minutesWatched
                    chaptersRead
                    mediaIds
                  }
                  scores {
                    score
                    count
                    meanScore
                    minutesWatched
                    chaptersRead
                    mediaIds
                  }
                  lengths {
                    length
                    count
                    meanScore
                    minutesWatched
                    chaptersRead
                    mediaIds
                  }
                  releaseYears {
                    releaseYear
                    count
                    meanScore
                    minutesWatched
                    chaptersRead
                    mediaIds
                  }
                  startYears {
                    startYear
                    count
                    meanScore
                    minutesWatched
                    chaptersRead
                    mediaIds
                  }
                  countries {
                    country
                    count
                    meanScore
                    minutesWatched
                    chaptersRead
                    mediaIds
                  }
                }
              }
            }
          }`,
  general: `query ($id: Int, $name: String) {
              User(id: $id, name: $name) {
                id
                name
                previousNames {
                  name
                  updatedAt
                }
                avatar {
                  large
                }
                bannerImage
                about
                isFollowing
                isFollower
                donatorTier
                donatorBadge
                createdAt
                moderatorRoles
                isBlocked
                bans
                options {
                  profileColor
                  restrictMessagesToFollowing
                }
                mediaListOptions {
                  scoreFormat
                }
                statistics {
                  anime {
                    count
                    meanScore
                    standardDeviation
                    minutesWatched
                    episodesWatched
                    genrePreview: genres(limit: 10, sort: COUNT_DESC) {
                      genre
                      count
                    }
                  }
                  manga {
                    count
                    meanScore
                    standardDeviation
                    chaptersRead
                    volumesRead
                    genrePreview: genres(limit: 10, sort: COUNT_DESC) {
                      genre
                      count
                    }
                  }
                }
                stats {
                  activityHistory {
                    date
                    amount
                    level
                  }
                }
                favourites {
                  anime {
                    edges {
                      favouriteOrder
                      node {
                        id
                        type
                        status(version: 2)
                        format
                        isAdult
                        bannerImage
                        title {
                          userPreferred
                        }
                        coverImage {
                          large
                        }
                        startDate {
                          year
                        }
                      }
                    }
                  }
                  manga {
                    edges {
                      favouriteOrder
                      node {
                        id
                        type
                        status(version: 2)
                        format
                        isAdult
                        bannerImage
                        title {
                          userPreferred
                        }
                        coverImage {
                          large
                        }
                        startDate {
                          year
                        }
                      }
                    }
                  }
                  characters {
                    edges {
                      favouriteOrder
                      node {
                        id
                        name {
                          userPreferred
                        }
                        image {
                          large
                        }
                      }
                    }
                  }
                  staff {
                    edges {
                      favouriteOrder
                      node {
                        id
                        name {
                          userPreferred
                        }
                        image {
                          large
                        }
                      }
                    }
                  }
                  studios {
                    edges {
                      favouriteOrder
                      node {
                        id
                        name
                      }
                    }
                  }
                }
              }
            }`,
};

export const animeInfo = `query ($query: String) {
    Media(search: $query, type: ANIME) {
      id
      description
      coverImage {
        extraLarge
        large
        medium
        color
      }
      bannerImage
      relations {
        edges {
          id
          node {
            coverImage {
              extraLarge
              large
              medium
              color
            }
            startDate {
              year
              month
              day
            }
            type
            siteUrl
            title {
              romaji
              english
              native
              userPreferred
            }
          }
        }
      }
      title {
        romaji
        english
        native
        userPreferred
      }
    }
  }`;
