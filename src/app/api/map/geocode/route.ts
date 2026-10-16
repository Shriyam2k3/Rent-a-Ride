import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text");

    if (!text || text.trim().length < 2) {
      return NextResponse.json({ features: [] });
    }

    const apiKey =
      process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY ||
      process.env.NEXT_PUBLIC_MAP_API_KEY ||
      "03376e4c85c4441c90f672093dd58416";

    const apiUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      text
    )}&filter=countrycode:in&apiKey=${apiKey}`;

    const res = await fetch(apiUrl, {
      next: { revalidate: 86400 }, // Cache geocode searches for 24h
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch geocoding from map provider" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Map geocode API error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching geocode" },
      { status: 500 }
    );
  }
}
