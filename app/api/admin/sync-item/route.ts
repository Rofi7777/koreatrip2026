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

    console.log("[Sync API] Translation input:", JSON.stringify(translationInput, null, 2));

    // Call Gemini to translate
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const expectedKeys = table === "info_cards" ? "title_zh, content_zh" : "title_zh, description_zh";
    
    const prompt = `You are a professional translator. Translate the following Vietnamese text to Traditional Chinese (Taiwan).

Input: ${JSON.stringify(translationInput, null, 2)}

Output JSON Keys: ${expectedKeys}

Constraint: The output MUST be in Traditional Chinese characters (繁體中文). Do NOT return Vietnamese. Do NOT return the original Vietnamese text.

Example:
Input: {"title": "Chuyến Du lịch Hàn Quốc", "description": "Seoul và Alpensia"}
Output: {"title_zh": "韓國之旅", "description_zh": "首爾與阿爾卑西亞"}

Return ONLY a valid JSON object with the keys ${expectedKeys}. No markdown, no code blocks, no explanations.`;

    console.log("[Sync API] Sending translation request to Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    console.log("[Sync API] Raw AI response:", text);
    console.log("[Sync API] Response length:", text.length);

    // Clean up markdown code blocks if present
    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

    let translatedData: Record<string, string>;
    try {
      translatedData = JSON.parse(text);
      console.log("[Sync API] Parsed translation data:", JSON.stringify(translatedData, null, 2));
    } catch (parseError) {
      console.error("[Sync API] JSON parse error:", parseError);
      console.error("[Sync API] Raw response after cleanup:", text);
      return NextResponse.json(
        { message: "Failed to parse AI translation response." },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!translatedData.title_zh) {
      console.error("[Sync API] Missing title_zh in response. Available keys:", Object.keys(translatedData));
      return NextResponse.json(
        { message: "Translation missing title_zh field." },
        { status: 500 }
      );
    }

    // Verify the translation is actually Chinese, not Vietnamese
    const titleZh = translatedData.title_zh.trim();
    const originalTitle = translationInput.title.trim();
    
    if (titleZh === originalTitle) {
      console.warn("[Sync API] WARNING: Translation appears to be identical to source. This might indicate the AI returned Vietnamese instead of Chinese.");
      // Continue anyway, but log the warning
    }

    // Prepare update object based on table type
    const updateData: Record<string, string> = {
      title_zh: titleZh,
    };

    if (table === "info_cards") {
      if (!translatedData.content_zh) {
        console.error("[Sync API] Missing content_zh in response. Available keys:", Object.keys(translatedData));
        return NextResponse.json(
          { message: "Translation missing content_zh field." },
          { status: 500 }
        );
      }
      updateData.content_zh = translatedData.content_zh.trim();
    } else {
      if (!translatedData.description_zh) {
        console.error("[Sync API] Missing description_zh in response. Available keys:", Object.keys(translatedData));
        return NextResponse.json(
          { message: "Translation missing description_zh field." },
          { status: 500 }
        );
      }
      updateData.description_zh = translatedData.description_zh.trim();
    }

    console.log("[Sync API] Updating database with:", JSON.stringify(updateData, null, 2));
    console.log("[Sync API] Table:", table, "ID:", id);

    // Update the database
    const { error: updateError, data: updatedData } = await supabase
      .from(table)
      .update(updateData)
      .eq("id", id)
      .select();

    if (updateError) {
      console.error("[Sync API] Database update error:", updateError);
      return NextResponse.json(
        { message: `Failed to update database: ${updateError.message}` },
        { status: 500 }
      );
    }

    console.log("[Sync API] Database update successful. Updated row:", updatedData);

    return NextResponse.json({
      success: true,
      message: "Translation synced successfully",
      data: updateData,
      updatedRow: updatedData,
    });
  } catch (err) {
    console.error("[Sync API] Error:", err);
    return NextResponse.json(
      { message: `Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}

