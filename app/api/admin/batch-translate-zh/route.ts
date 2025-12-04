import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

// Helper function to delay execution (avoid rate limits)
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST() {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "Missing GOOGLE_API_KEY server configuration." },
        { status: 500 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const results = {
      itinerary: { processed: 0, updated: 0, errors: [] as string[] },
      tasks: { processed: 0, updated: 0, errors: [] as string[] },
      info_cards: { processed: 0, updated: 0, errors: [] as string[] },
    };

    // Process Itinerary table
    console.log("[Batch Translate ZH] Processing itinerary table...");
    const { data: itineraryItems, error: itineraryError } = await supabase
      .from("itinerary")
      .select("*");

    if (itineraryError) {
      console.error("[Batch Translate ZH] Error fetching itinerary:", itineraryError);
      results.itinerary.errors.push(`Fetch error: ${itineraryError.message}`);
    } else if (itineraryItems) {
      // Filter items where title_zh is null/empty and we have Vietnamese source
      const itemsToTranslate = itineraryItems.filter(
        (item) => (!item.title_zh || item.title_zh.trim() === "") && (item.title_vi || item.title)
      );

      console.log(`[Batch Translate ZH] Found ${itemsToTranslate.length} itinerary items to translate`);

      for (let i = 0; i < itemsToTranslate.length; i++) {
        const item = itemsToTranslate[i];
        results.itinerary.processed++;

        try {
          const sourceTitle = item.title_vi || item.title || "";
          const sourceDescription = item.description_vi || item.description || "";

          if (!sourceTitle.trim()) {
            results.itinerary.errors.push(`Item ${item.id}: Empty title, skipped`);
            continue;
          }

          const translationInput: Record<string, string> = {
            title: sourceTitle,
          };
          if (sourceDescription) {
            translationInput.description = sourceDescription;
          }

          const prompt = `Translate this JSON from Vietnamese to Traditional Chinese (Taiwan). 
Input: ${JSON.stringify(translationInput)}
Return ONLY a valid JSON object with keys: title_zh, description_zh.
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
            results.itinerary.errors.push(`Item ${item.id}: Failed to parse translation`);
            await delay(500); // Delay before next item
            continue;
          }

          if (!translatedData.title_zh) {
            results.itinerary.errors.push(`Item ${item.id}: Missing title_zh in response`);
            await delay(500);
            continue;
          }

          const updateData: Record<string, string> = {
            title_zh: translatedData.title_zh,
          };
          if (translatedData.description_zh) {
            updateData.description_zh = translatedData.description_zh;
          }

          const { error: updateError } = await supabase
            .from("itinerary")
            .update(updateData)
            .eq("id", item.id);

          if (updateError) {
            results.itinerary.errors.push(`Item ${item.id}: ${updateError.message}`);
          } else {
            results.itinerary.updated++;
          }

          // Delay to avoid rate limits (500ms between items)
          await delay(500);
        } catch (err) {
          results.itinerary.errors.push(`Item ${item.id}: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
      }
    }

    // Process Tasks table
    console.log("[Batch Translate ZH] Processing tasks table...");
    const { data: taskItems, error: taskError } = await supabase
      .from("tasks")
      .select("*");

    if (taskError) {
      console.error("[Batch Translate ZH] Error fetching tasks:", taskError);
      results.tasks.errors.push(`Fetch error: ${taskError.message}`);
    } else if (taskItems) {
      // Filter items where title_zh is null/empty and we have Vietnamese source
      const itemsToTranslate = taskItems.filter(
        (item) => (!item.title_zh || item.title_zh.trim() === "") && (item.title_vi || item.title)
      );

      console.log(`[Batch Translate ZH] Found ${itemsToTranslate.length} task items to translate`);

      for (let i = 0; i < itemsToTranslate.length; i++) {
        const item = itemsToTranslate[i];
        results.tasks.processed++;

        try {
          const sourceTitle = item.title_vi || item.title || "";
          const sourceDescription = item.description_vi || item.description || "";

          if (!sourceTitle.trim()) {
            results.tasks.errors.push(`Item ${item.id}: Empty title, skipped`);
            continue;
          }

          const translationInput: Record<string, string> = {
            title: sourceTitle,
          };
          if (sourceDescription) {
            translationInput.description = sourceDescription;
          }

          const prompt = `Translate this JSON from Vietnamese to Traditional Chinese (Taiwan). 
Input: ${JSON.stringify(translationInput)}
Return ONLY a valid JSON object with keys: title_zh, description_zh.
Do not include any markdown, code blocks, or explanations.`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          let text = response.text().trim();

          text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

          let translatedData: Record<string, string>;
          try {
            translatedData = JSON.parse(text);
          } catch (parseError) {
            results.tasks.errors.push(`Item ${item.id}: Failed to parse translation`);
            await delay(500);
            continue;
          }

          if (!translatedData.title_zh) {
            results.tasks.errors.push(`Item ${item.id}: Missing title_zh in response`);
            await delay(500);
            continue;
          }

          const updateData: Record<string, string> = {
            title_zh: translatedData.title_zh,
          };
          if (translatedData.description_zh) {
            updateData.description_zh = translatedData.description_zh;
          }

          const { error: updateError } = await supabase
            .from("tasks")
            .update(updateData)
            .eq("id", item.id);

          if (updateError) {
            results.tasks.errors.push(`Item ${item.id}: ${updateError.message}`);
          } else {
            results.tasks.updated++;
          }

          await delay(500);
        } catch (err) {
          results.tasks.errors.push(`Item ${item.id}: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
      }
    }

    // Process Info Cards table
    console.log("[Batch Translate ZH] Processing info_cards table...");
    const { data: infoItems, error: infoError } = await supabase
      .from("info_cards")
      .select("*");

    if (infoError) {
      console.error("[Batch Translate ZH] Error fetching info_cards:", infoError);
      results.info_cards.errors.push(`Fetch error: ${infoError.message}`);
    } else if (infoItems) {
      // Filter items where title_zh is null/empty and we have Vietnamese source
      const itemsToTranslate = infoItems.filter(
        (item) => (!item.title_zh || item.title_zh.trim() === "") && (item.title_vi || item.title)
      );

      console.log(`[Batch Translate ZH] Found ${itemsToTranslate.length} info card items to translate`);

      for (let i = 0; i < itemsToTranslate.length; i++) {
        const item = itemsToTranslate[i];
        results.info_cards.processed++;

        try {
          const sourceTitle = item.title_vi || item.title || "";
          const sourceContent = item.content_vi || item.content || "";

          if (!sourceTitle.trim()) {
            results.info_cards.errors.push(`Item ${item.id}: Empty title, skipped`);
            continue;
          }

          const translationInput: Record<string, string> = {
            title: sourceTitle,
          };
          if (sourceContent) {
            translationInput.content = sourceContent;
          }

          const prompt = `Translate this JSON from Vietnamese to Traditional Chinese (Taiwan). 
Input: ${JSON.stringify(translationInput)}
Return ONLY a valid JSON object with keys: title_zh, content_zh.
Do not include any markdown, code blocks, or explanations.`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          let text = response.text().trim();

          text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

          let translatedData: Record<string, string>;
          try {
            translatedData = JSON.parse(text);
          } catch (parseError) {
            results.info_cards.errors.push(`Item ${item.id}: Failed to parse translation`);
            await delay(500);
            continue;
          }

          if (!translatedData.title_zh) {
            results.info_cards.errors.push(`Item ${item.id}: Missing title_zh in response`);
            await delay(500);
            continue;
          }

          const updateData: Record<string, string> = {
            title_zh: translatedData.title_zh,
          };
          if (translatedData.content_zh) {
            updateData.content_zh = translatedData.content_zh;
          }

          const { error: updateError } = await supabase
            .from("info_cards")
            .update(updateData)
            .eq("id", item.id);

          if (updateError) {
            results.info_cards.errors.push(`Item ${item.id}: ${updateError.message}`);
          } else {
            results.info_cards.updated++;
          }

          await delay(500);
        } catch (err) {
          results.info_cards.errors.push(`Item ${item.id}: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
      }
    }

    const totalProcessed =
      results.itinerary.processed + results.tasks.processed + results.info_cards.processed;
    const totalUpdated =
      results.itinerary.updated + results.tasks.updated + results.info_cards.updated;
    const totalErrors =
      results.itinerary.errors.length + results.tasks.errors.length + results.info_cards.errors.length;

    return NextResponse.json({
      success: true,
      message: `Batch translation completed. Processed: ${totalProcessed}, Updated: ${totalUpdated}, Errors: ${totalErrors}`,
      results,
    });
  } catch (err) {
    console.error("[Batch Translate ZH] Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        message: `Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}

