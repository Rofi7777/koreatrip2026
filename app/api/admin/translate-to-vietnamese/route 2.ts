import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

// Helper function to delay execution
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

    // Fetch all rows from itinerary table
    const { data: items, error: fetchError } = await supabase
      .from("itinerary")
      .select("*")
      .order("day_number", { ascending: true })
      .order("start_time", { ascending: true });

    if (fetchError) {
      console.error("[Translate to VI] Error fetching itinerary:", fetchError);
      return NextResponse.json(
        { message: "Failed to fetch itinerary items." },
        { status: 500 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json({
        message: "No itinerary items found.",
        updated: 0,
        total: 0,
      });
    }

    console.log(`[Translate to VI] Found ${items.length} items. Translating all to Vietnamese...`);

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let updatedCount = 0;
    const errors: string[] = [];

    // Process EVERY item - translate to Vietnamese
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      try {
        const itemTitle = item.title || "";
        const itemDescription = item.description || "";
        
        console.log(`[Translate to VI] Processing item ${i + 1}/${items.length}:`);
        console.log(`  ID: ${item.id}`);
        console.log(`  Title (ZH): ${itemTitle.substring(0, 100)}`);
        console.log(`  Description (ZH): ${itemDescription.substring(0, 100)}`);

        // Skip if both title and description are empty
        if (!itemTitle.trim() && !itemDescription.trim()) {
          console.log(`  ⚠️ Skipping item ${item.id}: Both title and description are empty`);
          errors.push(`Item ${item.id}: Empty content, skipped`);
          continue;
        }

        // Create translation prompt - translate from Traditional Chinese to Vietnamese
        const translationPrompt = [
          "You are a professional translator. Translate the following content from Traditional Chinese to Vietnamese.",
          "",
          "Input:",
          `Title: ${itemTitle}`,
          `Description: ${itemDescription}`,
          "",
          "Return ONLY a raw JSON object (no markdown, no code blocks, no explanations) with exactly these keys:",
          "title_vi, description_vi",
          "",
          "CRITICAL: Return ONLY valid JSON. No markdown code blocks, no explanations, no extra text.",
          "Example format:",
          '{"title_vi":"...","description_vi":"..."}',
        ].join("\n");

        console.log(`  📤 Sending translation request to Gemini...`);

        // Call Gemini AI
        const result = await model.generateContent(translationPrompt);
        const response = await result.response;
        let text = response.text().trim();

        console.log(`  📥 Raw response length: ${text.length} chars`);
        console.log(`  📥 Raw response preview: ${text.substring(0, 200)}...`);

        // Remove markdown code blocks if present
        text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

        // Parse JSON response
        let translations: any = {};
        try {
          translations = JSON.parse(text);
          console.log(`  ✅ Successfully parsed JSON response`);
        } catch (parseErr) {
          console.error(`  ❌ Failed to parse JSON directly:`, parseErr);
          // Try to extract JSON from the text if it's wrapped in other text
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              translations = JSON.parse(jsonMatch[0]);
              console.log(`  ✅ Extracted JSON from text`);
            } catch (e) {
              console.error(`  ❌ Failed to parse extracted JSON:`, e);
              throw new Error(`Failed to parse translation response: ${e instanceof Error ? e.message : "Unknown error"}`);
            }
          } else {
            console.error(`  ❌ No JSON pattern found in response`);
            throw new Error("Failed to parse translation response as JSON - no JSON pattern found");
          }
        }

        console.log(`  📋 Parsed translations:`, {
          title_vi: translations.title_vi?.substring(0, 50),
          has_description_vi: !!translations.description_vi,
        });

        // Build updates object - update both title_vi/description_vi AND the base title/description
        const updates: Record<string, any> = {};
        
        if (translations.title_vi && typeof translations.title_vi === "string" && translations.title_vi.trim()) {
          const titleVi = translations.title_vi.trim();
          updates.title_vi = titleVi;
          // Also update the base title to Vietnamese (as the primary content)
          updates.title = titleVi;
          console.log(`  ✅ title_vi: ${titleVi.substring(0, 50)}`);
        } else {
          console.warn(`  ⚠️ Missing or invalid title_vi`);
        }
        
        if (translations.description_vi && typeof translations.description_vi === "string" && translations.description_vi.trim()) {
          const descVi = translations.description_vi.trim();
          updates.description_vi = descVi;
          // Also update the base description to Vietnamese (as the primary content)
          updates.description = descVi;
          console.log(`  ✅ description_vi: ${descVi.substring(0, 50)}`);
        } else {
          console.warn(`  ⚠️ Missing or invalid description_vi`);
        }

        // Update the row in Supabase only if we have at least one valid translation
        if (Object.keys(updates).length > 0) {
          console.log(`  💾 Updating database with ${Object.keys(updates).length} fields...`);
          const { error: updateError, data: updateData } = await supabase
            .from("itinerary")
            .update(updates)
            .eq("id", item.id)
            .select();

          if (updateError) {
            console.error(`  ❌ Database update error:`, updateError);
            errors.push(`Item ${item.id}: ${updateError.message}`);
          } else {
            updatedCount++;
            console.log(`  ✅ Successfully updated item ${item.id} in database`);
            if (updateData && updateData.length > 0) {
              console.log(`  📊 Updated data preview:`, {
                title: updateData[0].title?.substring(0, 30),
                title_vi: updateData[0].title_vi?.substring(0, 30),
              });
            }
          }
        } else {
          console.warn(`  ⚠️ No valid translations to update for item ${item.id}`);
          errors.push(`Item ${item.id}: No valid translations received from AI`);
        }

        // Add delay between requests to avoid rate limits (1 second)
        if (i < items.length - 1) {
          await delay(1000);
        }
      } catch (itemError) {
        console.error(`[Translate to VI] Error processing item ${item.id}:`, itemError);
        errors.push(`Item ${item.id}: ${itemError instanceof Error ? itemError.message : "Unknown error"}`);
      }
    }

    return NextResponse.json({
      message: `Vietnamese translation complete. Updated ${updatedCount} out of ${items.length} items.`,
      updated: updatedCount,
      total: items.length,
      attempted: items.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("[Translate to VI] Unexpected error:", err);
    return NextResponse.json(
      {
        message: "Unexpected error during Vietnamese translation.",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


