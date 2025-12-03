import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { city, category, subCategory } = body as {
      city?: string;
      category?: string;
      subCategory?: string;
    };

    if (!city || !category || !subCategory) {
      return NextResponse.json(
        { message: "City, category, and subCategory are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("[Explorer API] Missing GOOGLE_API_KEY");
      return NextResponse.json(
        { message: "AI service is not configured." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are a local Korean tour guide for a corporate team. Recommend exactly 5 top-rated places based on the user's request. Focus on places with high Google Maps ratings (4.0+).`;

    const userPrompt = `Recommend 5 best places for ${subCategory} in ${city}. 

Return a strictly valid JSON array with exactly 5 objects. Each object must have these exact fields:
- name: string (English/Vietnamese mix, e.g., "Myeongdong Kyoja" or "Nhà hàng thịt nướng Mapo Galmaegi")
- korean_name: string (Korean name, e.g., "명동교자" or "마포갈매기")
- reason: string (short description in Vietnamese, 1-2 sentences explaining why this place is recommended)
- estimated_rating: number (e.g., 4.5, must be between 4.0 and 5.0)

Return ONLY the JSON array, no markdown, no code blocks, no explanations. Example format:
[
  {
    "name": "Myeongdong Kyoja",
    "korean_name": "명동교자",
    "reason": "Nhà hàng nổi tiếng với món kalguksu (mì cắt tay) và mandu (bánh bao) từ năm 1966. Được đánh giá cao trên Google Maps.",
    "estimated_rating": 4.6
  },
  ...
]`;

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean up markdown code blocks if present
    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

    // Try to parse JSON
    let recommendations;
    try {
      recommendations = JSON.parse(text);
    } catch (parseError) {
      console.error("[Explorer API] JSON parse error:", parseError);
      console.error("[Explorer API] Raw response:", text);
      return NextResponse.json(
        { message: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // Validate it's an array with 5 items
    if (!Array.isArray(recommendations) || recommendations.length !== 5) {
      return NextResponse.json(
        { message: "AI did not return exactly 5 recommendations." },
        { status: 500 }
      );
    }

    return NextResponse.json({ recommendations });
  } catch (err) {
    console.error("[Explorer API] Error:", err);
    return NextResponse.json(
      { message: "Unexpected error in explorer API." },
      { status: 500 }
    );
  }
}

