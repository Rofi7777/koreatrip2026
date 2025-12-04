import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table, id, sourceText } = body as {
      table: "itinerary" | "tasks" | "info_cards";
      id: string | number;
      sourceText: {
        title: string;
        description?: string;
        content?: string;
      };
    };

    if (!table || !id || !sourceText || !sourceText.title) {
      return NextResponse.json(
        { message: "Missing required fields: table, id, sourceText with title" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("[Translate Row API] Missing GOOGLE_API_KEY");
      return NextResponse.json(
        { message: "AI service is not configured." },
        { status: 500 }
      );
    }

    // Prepare translation input
    const translationInput: Record<string, string> = {
      title: sourceText.title,
    };

    if (table === "info_cards" && sourceText.content) {
      translationInput.content = sourceText.content;
    } else if (sourceText.description) {
      translationInput.description = sourceText.description;
    }

    console.log("[Translate Row API] Translation input:", JSON.stringify(translationInput, null, 2));

    // Call Gemini to translate
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const expectedKeys = table === "info_cards" ? "title_zh, content_zh" : "title_zh, description_zh";

    const prompt = `Translate the following Vietnamese text to Traditional Chinese (Taiwan). Return JSON: { ${expectedKeys} }.

Input: ${JSON.stringify(translationInput, null, 2)}

Constraint: The output MUST be in Traditional Chinese characters (繁體中文). Do NOT return Vietnamese. Do NOT return the original Vietnamese text.

Return ONLY a valid JSON object with the keys ${expectedKeys}. No markdown, no code blocks, no explanations.`;

    console.log("[Translate Row API] Sending translation request to Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    console.log("[Translate Row API] Raw AI response:", text);

    // Clean up markdown code blocks if present
    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

    let translatedData: Record<string, string>;
    try {
      translatedData = JSON.parse(text);
      console.log("[Translate Row API] Parsed translation data:", JSON.stringify(translatedData, null, 2));
    } catch (parseError) {
      console.error("[Translate Row API] JSON parse error:", parseError);
      console.error("[Translate Row API] Raw response after cleanup:", text);
      return NextResponse.json(
        { message: "Failed to parse AI translation response." },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!translatedData.title_zh) {
      console.error("[Translate Row API] Missing title_zh in response. Available keys:", Object.keys(translatedData));
      return NextResponse.json(
        { message: "Translation missing title_zh field." },
        { status: 500 }
      );
    }

    // Prepare update object based on table type
    const updateData: Record<string, string> = {
      title_zh: translatedData.title_zh.trim(),
    };

    if (table === "info_cards") {
      if (!translatedData.content_zh) {
        console.error("[Translate Row API] Missing content_zh in response. Available keys:", Object.keys(translatedData));
        return NextResponse.json(
          { message: "Translation missing content_zh field." },
          { status: 500 }
        );
      }
      updateData.content_zh = translatedData.content_zh.trim();
    } else {
      if (!translatedData.description_zh) {
        console.error("[Translate Row API] Missing description_zh in response. Available keys:", Object.keys(translatedData));
        return NextResponse.json(
          { message: "Translation missing description_zh field." },
          { status: 500 }
        );
      }
      updateData.description_zh = translatedData.description_zh.trim();
    }

    console.log("[Translate Row API] Updating database with:", JSON.stringify(updateData, null, 2));
    console.log("[Translate Row API] Table:", table, "ID:", id);

    // Update the database
    const { error: updateError, data: updatedData } = await supabase
      .from(table)
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("[Translate Row API] Database update error:", updateError);
      return NextResponse.json(
        { message: `Failed to update database: ${updateError.message}` },
        { status: 500 }
      );
    }

    console.log("[Translate Row API] Database update successful. Updated row:", updatedData);

    return NextResponse.json({
      success: true,
      message: "Translation completed successfully",
      data: updateData,
      updatedRow: updatedData,
    });
  } catch (err) {
    console.error("[Translate Row API] Error:", err);
    return NextResponse.json(
      { message: `Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}

