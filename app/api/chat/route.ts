import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { message } = (await request.json()) as { message?: string };

    if (!message || !message.trim()) {
      return NextResponse.json(
        { message: "Message is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "Missing GOOGLE_API_KEY server configuration." },
        { status: 500 }
      );
    }

    // Fetch entire itinerary from Supabase
    const { data: itinerary, error } = await supabase
      .from("itinerary")
      .select("*")
      .order("day_number", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching itinerary for chat:", error);
      // Continue without itinerary context if fetch fails
    }

    // Convert itinerary to human-readable text summary
    const itinerarySummary = (itinerary ?? [])
      .reduce((acc: string[], item: any) => {
        const day = item.day_number || "?";
        const date = item.date ? ` (${item.date})` : "";
        const time = item.start_time || "";
        const endTime = item.end_time ? ` - ${item.end_time}` : "";
        const title = item.title_vi || item.title || "";
        const desc = item.description_vi || item.description || "";
        const location = item.location ? ` @ ${item.location}` : "";
        const category = item.category ? ` [${item.category}]` : "";
        const owner = item.owner ? ` (${item.owner})` : "";

        const line = `Day ${day}${date}: ${time}${endTime} - ${title}${desc ? `: ${desc}` : ""}${location}${category}${owner}`;
        acc.push(line);
        return acc;
      }, [])
      .join("\n");

    const systemPrompt = [
      "Role: You are a Korean local tour guide with 10+ years of experience. You are guiding the POPMART Vietnam team on their trip to Korea in January 2026.",
      "",
      "Context: Here is their current itinerary:",
      itinerarySummary || "No itinerary data available yet.",
      "",
      "Task: Answer user questions about:",
      "- Their schedule and timing",
      "- Food recommendations near locations in their itinerary (use your knowledge of Korean restaurants, mention Google Maps ratings if known)",
      "- Shopping recommendations (especially in Myeongdong, Insadong, etc.)",
      "- Transportation tips between locations",
      "- Cultural tips and etiquette",
      "- Weather-appropriate activities",
      "",
      "Personality: Professional, enthusiastic, and helpful. Use emojis appropriately to make responses friendly and engaging.",
      "",
      "Language: Reply in the SAME language as the user (Vietnamese, English, or Chinese).",
      "",
      "Guidelines:",
      "- Be specific and actionable",
      "- Reference actual locations from their itinerary when relevant",
      "- When recommending restaurants or spots, mention their general reputation/rating on Google Maps if you know it",
      "- Keep answers concise but informative",
      "- If the user asks about something not in the itinerary, use your knowledge of Korea to help",
    ].join("\n");

    const fullPrompt = `${systemPrompt}\n\nUser message: ${message.trim()}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { message: "Unexpected error in chat API." },
      { status: 500 }
    );
  }
}


