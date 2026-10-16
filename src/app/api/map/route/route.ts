import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const origin = searchParams.get("origin"); // "lat,lng"
    const destination = searchParams.get("destination"); // "lat,lng"

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Both origin and destination coordinates are required." },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY ||
      process.env.NEXT_PUBLIC_MAP_API_KEY ||
      "03376e4c85c4441c90f672093dd58416";

    const apiUrl = `https://api.geoapify.com/v1/routing?waypoints=${origin}|${destination}&mode=drive&apiKey=${apiKey}`;

    const res = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // Cache routing calculation for 1 hour
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch routing from map provider", status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Map route API error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching route" },
      { status: 500 }
    );
  }
}
