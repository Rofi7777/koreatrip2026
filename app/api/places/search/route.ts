import { NextResponse } from "next/server";

interface GooglePlaceSearchResult {
  name?: string;
  place_id?: string;
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
}

interface GooglePlaceSearchResponse {
  results?: GooglePlaceSearchResult[];
  status?: string;
  error_message?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const lang = searchParams.get("lang") || "vi";

    if (!query || !query.trim()) {
      return NextResponse.json(
        { message: "Missing or empty query parameter." },
        { status: 400 }
      );
    }

    // Support both GOOGLE_MAPS_API_KEY and Maps_API_KEY
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.Maps_API_KEY;

    if (!apiKey) {
      console.error("Google Maps API key is not set in environment variables.");
      return NextResponse.json(
        { message: "Google Maps API key is not configured." },
        { status: 500 }
      );
    }

    // Map app language codes to Google Maps API language codes
    const googleLangCode = lang === "vi" ? "vi" : lang === "zh-TW" ? "zh-TW" : "en";

    // Use Google Places Text Search API
    // Add "Korea" or "South Korea" to the query to focus on Korean locations
    const searchQuery = `${query.trim()} Korea`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}&language=${googleLangCode}`;

    console.log(`[Places Search API] Searching for: ${searchQuery} with language: ${googleLangCode}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Places Search API] HTTP error: ${response.status}`, errorText);
      return NextResponse.json(
        { message: `Failed to search places (HTTP ${response.status}).` },
        { status: response.status }
      );
    }

    const data: GooglePlaceSearchResponse = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error(`[Places Search API] API error:`, data.status, data.error_message);
      return NextResponse.json(
        {
          message: data.error_message || `Search failed with status: ${data.status}`,
        },
        { status: 500 }
      );
    }

    // Return top 3 results
    const results = (data.results || []).slice(0, 3).map((place) => ({
      name: place.name || "",
      place_id: place.place_id || "",
      formatted_address: place.formatted_address || "",
      rating: place.rating || 0,
      total_ratings: place.user_ratings_total || 0,
    }));

    return NextResponse.json({ results });
  } catch (err) {
    console.error("[Places Search API] Unexpected error:", err);
    return NextResponse.json(
      { message: "Unexpected error searching places." },
      { status: 500 }
    );
  }
}

