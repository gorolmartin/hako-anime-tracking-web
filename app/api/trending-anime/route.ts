import { NextResponse } from "next/server";
import { getSeasonalTrendingAnime } from "@/lib/anilist";

export async function GET() {
  try {
    const anime = await getSeasonalTrendingAnime();
    return NextResponse.json(anime);
  } catch (error) {
    console.error("Trending anime API error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export const revalidate = 3600;
