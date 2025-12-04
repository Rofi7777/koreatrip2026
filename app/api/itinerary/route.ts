import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("itinerary")
      .select("*")
      .order("day_number", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching itinerary:", error);
      return NextResponse.json(
        { message: `Failed to fetch itinerary: ${error.message || "Database error"}` },
        { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    return NextResponse.json(
      { data: data || [] },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    console.error("[API] GET itinerary error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unexpected error";
    
    // Return empty array instead of error to allow page to load
    if (errorMessage.includes("timeout") || errorMessage.includes("Missing Supabase")) {
      console.warn("[API] Returning empty array due to:", errorMessage);
      return NextResponse.json(
        { data: [] },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }
    
    return NextResponse.json(
      { message: `Unexpected error: ${errorMessage}`, data: [] },
      { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      language,
      title,
      description,
      autoTranslate,
      ...rest
    } = body as {
      id?: string | number;
      language?: "vi" | "zh-TW" | "en";
      title?: string;
      description?: string;
      autoTranslate?: boolean;
      [key: string]: any;
    };

    console.log(`[API] PUT request received:`, {
      id,
      language,
      title: title?.substring(0, 50),
      description: description?.substring(0, 50),
      autoTranslate,
    });

    if (!id) {
      return NextResponse.json(
        { message: "Missing itinerary id." },
        { status: 400 }
      );
    }

    // Simplified: Always save as Vietnamese, no translation
    const finalUpdates: Record<string, any> = {
      ...rest,
    };

    // Update main fields
    if (title !== undefined) {
      finalUpdates.title = title;
      finalUpdates.title_vi = title; // Also update _vi field
    }
    if (description !== undefined) {
      finalUpdates.description = description;
      finalUpdates.description_vi = description; // Also update _vi field
    }
    
    // Allow date and time updates without validation
    if (rest.date !== undefined) {
      finalUpdates.date = rest.date;
    }
    if (rest.start_time !== undefined) {
      finalUpdates.start_time = rest.start_time;
    }
    if (rest.end_time !== undefined) {
      finalUpdates.end_time = rest.end_time;
    }
    if (rest.owner !== undefined) {
      finalUpdates.owner = rest.owner;
    }

    const { data, error } = await supabase
      .from("itinerary")
      .update(finalUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[API] ❌ Error updating itinerary:", error);
      return NextResponse.json(
        { message: "Failed to update itinerary item." },
        { status: 500 }
      );
    }

    console.log(`[API] ✅ Successfully updated itinerary item ${id}`);
    console.log(`[API] Updated data preview:`, {
      title: data.title,
      title_vi: data.title_vi,
      title_en: data.title_en,
      title_zh: data.title_zh,
    });

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Unexpected error updating itinerary:", err);
    return NextResponse.json(
      { message: "Unexpected error updating itinerary." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      day_number,
      date,
      start_time,
      end_time,
      title,
      description,
      location,
      category,
      owner,
      language,
      autoTranslate,
    } = body as {
      day_number: number;
      date?: string;
      start_time: string;
      end_time?: string | null;
      title: string;
      description?: string | null;
      location?: string | null;
      category?: string | null;
      owner?: string | null;
      language?: "vi" | "zh-TW" | "en";
      autoTranslate?: boolean;
    };

    console.log(`[API] POST request received:`, {
      day_number,
      date,
      start_time,
      title: title?.substring(0, 50),
      autoTranslate,
    });

    if (!day_number || !start_time || !title) {
      return NextResponse.json(
        { message: "Missing required fields: day_number, start_time, title." },
        { status: 400 }
      );
    }

    // Simplified: Always save as Vietnamese, no translation
    const newItem: Record<string, any> = {
      day_number,
      start_time,
      end_time: end_time || null,
      title,
      description: description || null,
      location: location || null,
      category: category || null,
      owner: owner || null,
      title_vi: title, // Also set _vi field
      description_vi: description || null,
    };

    // Add date if provided
    if (date) {
      newItem.date = date;
    }

    const { data, error } = await supabase
      .from("itinerary")
      .insert(newItem)
      .select()
      .single();

    if (error) {
      console.error("[API] ❌ Error creating itinerary:", error);
      return NextResponse.json(
        { message: "Failed to create itinerary item." },
        { status: 500 }
      );
    }

    console.log(`[API] ✅ Successfully created itinerary item`);
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Unexpected error creating itinerary:", err);
    return NextResponse.json(
      { message: "Unexpected error creating itinerary." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Missing itinerary id." },
        { status: 400 }
      );
    }

    console.log(`[API] DELETE request received for id: ${id}`);

    const { error } = await supabase
      .from("itinerary")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[API] ❌ Error deleting itinerary:", error);
      return NextResponse.json(
        { message: "Failed to delete itinerary item." },
        { status: 500 }
      );
    }

    console.log(`[API] ✅ Successfully deleted itinerary item ${id}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error deleting itinerary:", err);
    return NextResponse.json(
      { message: "Unexpected error deleting itinerary." },
      { status: 500 }
    );
  }
}

