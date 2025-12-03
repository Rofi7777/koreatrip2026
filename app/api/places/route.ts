import { NextResponse } from "next/server";

interface GooglePlaceReview {
  authorAttribution?: {
    displayName?: string;
  };
  rating?: number;
  text?: {
    text?: string;
  };
  publishTime?: string;
}

interface GooglePlaceDetailsResponse {
  displayName?: {
    text?: string;
  };
  rating?: number;
  userRatingCount?: number;
  reviews?: GooglePlaceReview[];
  error?: {
    code?: number;
    message?: string;
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get("placeId");
    const lang = searchParams.get("lang") || "vi"; // Default to Vietnamese

    if (!placeId) {
      return NextResponse.json(
        { message: "Missing placeId parameter." },
        { status: 400 }
      );
    }

    // Support both GOOGLE_MAPS_API_KEY and Maps_API_KEY
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.Maps_API_KEY;

    if (!apiKey) {
      console.error("Google Maps API key is not set in environment variables (GOOGLE_MAPS_API_KEY or Maps_API_KEY).");
      return NextResponse.json(
        { message: "Google Maps API key is not configured." },
        { status: 500 }
      );
    }

    // Map app language codes to Google Maps API language codes
    // Google Maps API uses: vi, zh-TW, en (which match our codes)
    const googleLangCode = lang === "vi" ? "vi" : lang === "zh-TW" ? "zh-TW" : "en";

    // Use the new Places API (New) endpoint
    // The new API uses GET request with fieldMask in header
    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    const fieldMask = "displayName,rating,userRatingCount,reviews";

    console.log(`[Places API] Fetching details for placeId: ${placeId} using Places API (New) with language: ${googleLangCode}`);
    console.log(`[Places API] Request URL: ${url}`);

    const response = await fetch(`${url}?languageCode=${googleLangCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
    });

    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
        console.error(`[Places API] HTTP error: ${response.status}`, errorText || "(empty response)");
      } catch (e) {
        console.error(`[Places API] HTTP error: ${response.status}`, "Could not read error response");
      }
      
      // Try to parse error if it's JSON
      let errorMessage = `Failed to fetch place details from Google Maps API (HTTP ${response.status}).`;
      if (errorText && errorText.trim()) {
        try {
          const errorJson = JSON.parse(errorText);
          // Check if errorJson has meaningful content
          if (errorJson.error?.message) {
            errorMessage = errorJson.error.message;
          } else if (errorJson.message) {
            errorMessage = errorJson.message;
          } else if (Object.keys(errorJson).length > 0) {
            // If errorJson has other properties, include them
            errorMessage = `API error: ${JSON.stringify(errorJson)}`;
          }
        } catch (e) {
          // Not JSON, use the text as error message if available
          if (errorText.trim()) {
            errorMessage = `API error: ${errorText.substring(0, 200)}`;
          }
        }
      }
      
      return NextResponse.json(
        { message: errorMessage, status: response.status },
        { status: response.status }
      );
    }

    let data: GooglePlaceDetailsResponse;
    try {
      const responseText = await response.text();
      console.log(`[Places API] Response received:`, responseText.substring(0, 500));
      data = JSON.parse(responseText);
    } catch (parseErr) {
      console.error(`[Places API] Failed to parse response:`, parseErr);
      return NextResponse.json(
        { message: "Invalid response from Google Maps API." },
        { status: 500 }
      );
    }

    if (data.error) {
      console.error(`[Places API] API error:`, data.error);
      return NextResponse.json(
        {
          message: data.error.message || "Failed to fetch place details.",
          code: data.error.code,
        },
        { status: 500 }
      );
    }

    // Format reviews to match expected structure
    const topReviews = data.reviews
      ? data.reviews
          .slice(0, 3)
          .map((review) => {
            // Format publish time to relative time description (language-aware)
            let relativeTime = "";
            if (review.publishTime) {
              const publishDate = new Date(review.publishTime);
              const now = new Date();
              const diffMs = now.getTime() - publishDate.getTime();
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
              
              if (googleLangCode === "vi") {
                // Vietnamese
                if (diffDays === 0) {
                  relativeTime = "Hôm nay";
                } else if (diffDays === 1) {
                  relativeTime = "1 ngày trước";
                } else if (diffDays < 7) {
                  relativeTime = `${diffDays} ngày trước`;
                } else if (diffDays < 30) {
                  const weeks = Math.floor(diffDays / 7);
                  relativeTime = `${weeks} tuần trước`;
                } else if (diffDays < 365) {
                  const months = Math.floor(diffDays / 30);
                  relativeTime = `${months} tháng trước`;
                } else {
                  const years = Math.floor(diffDays / 365);
                  relativeTime = `${years} năm trước`;
                }
              } else if (googleLangCode === "zh-TW") {
                // Traditional Chinese
                if (diffDays === 0) {
                  relativeTime = "今天";
                } else if (diffDays === 1) {
                  relativeTime = "1 天前";
                } else if (diffDays < 7) {
                  relativeTime = `${diffDays} 天前`;
                } else if (diffDays < 30) {
                  const weeks = Math.floor(diffDays / 7);
                  relativeTime = `${weeks} 週前`;
                } else if (diffDays < 365) {
                  const months = Math.floor(diffDays / 30);
                  relativeTime = `${months} 個月前`;
                } else {
                  const years = Math.floor(diffDays / 365);
                  relativeTime = `${years} 年前`;
                }
              } else {
                // English
                if (diffDays === 0) {
                  relativeTime = "Today";
                } else if (diffDays === 1) {
                  relativeTime = "1 day ago";
                } else if (diffDays < 7) {
                  relativeTime = `${diffDays} days ago`;
                } else if (diffDays < 30) {
                  const weeks = Math.floor(diffDays / 7);
                  relativeTime = `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
                } else if (diffDays < 365) {
                  const months = Math.floor(diffDays / 30);
                  relativeTime = `${months} ${months === 1 ? "month" : "months"} ago`;
                } else {
                  const years = Math.floor(diffDays / 365);
                  relativeTime = `${years} ${years === 1 ? "year" : "years"} ago`;
                }
              }
            }

            // Language-aware default author name
            const defaultAuthorName = 
              googleLangCode === "vi" ? "Ẩn danh" :
              googleLangCode === "zh-TW" ? "匿名" :
              "Anonymous";

            return {
              author_name: review.authorAttribution?.displayName || defaultAuthorName,
              text: review.text?.text || "",
              rating: review.rating || 0,
              relative_time_description: relativeTime,
            };
          })
      : [];

    return NextResponse.json({
      name: data.displayName?.text || "",
      rating: data.rating || 0,
      total_ratings: data.userRatingCount || 0,
      reviews: topReviews,
    });
  } catch (err) {
    console.error("[Places API] Unexpected error:", err);
    return NextResponse.json(
      { message: "Unexpected error fetching place details." },
      { status: 500 }
    );
  }
}

