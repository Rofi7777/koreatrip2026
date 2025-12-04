import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table, id, sourceData } = body as {
      table: "itinerary" | "tasks" | "info_cards";
      id: string | number;
      sourceData: {
        title: string;
        description?: string;
        content?: string;
      };
    };

    if (!table || !id || !sourceData || !sourceData.title) {
      return NextResponse.json(
        { message: "Missing required fields: table, id, sourceData with title" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("[Sync API] Missing GOOGLE_API_KEY");
      return NextResponse.json(
        { message: "AI service is not configured." },
        { status: 500 }
      );
    }

    // Prepare translation data
    const translationInput: Record<string, string> = {
      title: sourceData.title,
    };

    if (table === "info_cards" && sourceData.content) {
      translationInput.content = sourceData.content;
    } else if (sourceData.description) {
      translationInput.description = sourceData.description;
    }

    // Call Gemini to translate
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Translate this JSON from Vietnamese to Traditional Chinese (Taiwan). 
Input: ${JSON.stringify(translationInput)}
Return ONLY a valid JSON object with keys: ${table === "info_cards" ? "title_zh, content_zh" : "title_zh, description_zh"}.
Do not include any markdown, code blocks, or explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean up markdown code blocks if present
    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

    let translatedData: Record<string, string>;
    try {
      translatedData = JSON.parse(text);
    } catch (parseError) {
      console.error("[Sync API] JSON parse error:", parseError);
      console.error("[Sync API] Raw response:", text);
      return NextResponse.json(
        { message: "Failed to parse AI translation response." },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!translatedData.title_zh) {
      return NextResponse.json(
        { message: "Translation missing title_zh field." },
        { status: 500 }
      );
    }

    // Prepare update object based on table type
    const updateData: Record<string, string> = {
      title_zh: translatedData.title_zh,
    };

    if (table === "info_cards") {
      if (!translatedData.content_zh) {
        return NextResponse.json(
          { message: "Translation missing content_zh field." },
          { status: 500 }
        );
      }
      updateData.content_zh = translatedData.content_zh;
    } else {
      if (!translatedData.description_zh) {
        return NextResponse.json(
          { message: "Translation missing description_zh field." },
          { status: 500 }
        );
      }
      updateData.description_zh = translatedData.description_zh;
    }

    // Update the database
    const { error: updateError } = await supabase
      .from(table)
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      console.error("[Sync API] Database update error:", updateError);
      return NextResponse.json(
        { message: `Failed to update database: ${updateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Translation synced successfully",
      data: updateData,
    });
  } catch (err) {
    console.error("[Sync API] Error:", err);
    return NextResponse.json(
      { message: `Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}

