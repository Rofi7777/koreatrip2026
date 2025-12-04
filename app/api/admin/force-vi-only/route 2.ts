import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

// One-time script to translate all Chinese content to Vietnamese
export async function POST() {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "GOOGLE_API_KEY is not set." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Process itinerary
    const { data: itineraryItems, error: itineraryError } = await supabase
      .from("itinerary")
      .select("*");

    if (itineraryError) {
      console.error("Error fetching itinerary:", itineraryError);
    } else {
      let updatedCount = 0;
      for (const item of itineraryItems || []) {
        // Check if title is Chinese (has Chinese characters)
        const hasChinese = /[\u4e00-\u9fff]/.test(item.title || "");
        
        if (hasChinese && !item.title_vi) {
          try {
            const prompt = `Translate the following from Traditional Chinese to Vietnamese. Return ONLY the Vietnamese translation, no explanations:\n\nTitle: ${item.title}\nDescription: ${item.description || ""}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const translated = response.text().trim();
            
            const lines = translated.split("\n");
            const titleVi = lines[0].replace(/^Title:\s*/i, "").trim();
            const descVi = lines[1]?.replace(/^Description:\s*/i, "").trim() || item.description || null;

            await supabase
              .from("itinerary")
              .update({
                title: titleVi,
                title_vi: titleVi,
                description: descVi,
                description_vi: descVi,
              })
              .eq("id", item.id);

            updatedCount++;
            await new Promise((r) => setTimeout(r, 1000)); // Rate limit
          } catch (err) {
            console.error(`Error translating item ${item.id}:`, err);
          }
        }
      }
      console.log(`[Force VI] Updated ${updatedCount} itinerary items`);
    }

    return NextResponse.json({
      success: true,
      message: "Force translation to Vietnamese complete. Please refresh.",
    });
  } catch (err) {
    console.error("Error in force-vi-only:", err);
    return NextResponse.json(
      { message: "Error processing translation." },
      { status: 500 }
    );
  }
}


