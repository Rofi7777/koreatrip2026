import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, direction } = body as {
      text?: string;
      direction?: "vi2ko" | "ko2vi";
    };

    if (!text || !text.trim()) {
      return NextResponse.json(
        { message: "Text is required." },
        { status: 400 }
      );
    }

    if (!direction || (direction !== "vi2ko" && direction !== "ko2vi")) {
      return NextResponse.json(
        { message: "Direction must be 'vi2ko' or 'ko2vi'." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("[API] Missing GOOGLE_API_KEY");
      return NextResponse.json(
        { message: "Translation service is not configured." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.5-flash as recommended (stable version, supports generateContent)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt: string;
    if (direction === "vi2ko") {
      prompt = `Translate the following sentence from Vietnamese to natural, polite Korean. Output ONLY the translated text. Do not include any explanations, notes, or additional text. Just the Korean translation.

Input: ${text}`;
    } else {
      prompt = `Translate the following sentence from Korean to Vietnamese. Output ONLY the translated text. Do not include any explanations, notes, or additional text. Just the Vietnamese translation.

Input: ${text}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let translation = response.text().trim();

    // Clean up any markdown or extra formatting
    translation = translation.replace(/^```[a-z]*\s*/i, "").replace(/\s*```$/i, "").trim();

    return NextResponse.json({ translation });
  } catch (err) {
    console.error("[API] Translation error:", err);
    return NextResponse.json(
      {
        message: `Translation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}

