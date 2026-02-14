interface AnimeTitle {
  english: string | null;
  romaji: string;
}

interface AnimeCover {
  large: string;
  extraLarge: string;
}

export interface TrendingAnime {
  id: number;
  title: AnimeTitle;
  coverImage: AnimeCover;
}

function getCurrentSeason(): { season: string; year: number } {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  let season: string;
  if (month >= 0 && month <= 2) {
    season = "WINTER";
  } else if (month >= 3 && month <= 5) {
    season = "SPRING";
  } else if (month >= 6 && month <= 8) {
    season = "SUMMER";
  } else {
    season = "FALL";
  }

  return { season, year };
}

export async function getSeasonalTrendingAnime(): Promise<TrendingAnime[]> {
  const { season, year } = getCurrentSeason();

  const query = `
    query ($season: MediaSeason, $year: Int) {
      Page(page: 1, perPage: 4) {
        media(
          sort: TRENDING_DESC,
          type: ANIME,
          season: $season,
          seasonYear: $year,
          isAdult: false
        ) {
          id
          title {
            english
            romaji
          }
          coverImage {
            large
            extraLarge
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { season, year },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`AniList API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.Page.media as TrendingAnime[];
  } catch (error) {
    console.error("Failed to fetch trending anime:", error);
    return [];
  }
}
