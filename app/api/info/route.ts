import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("info_cards")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching info cards:", error);
      // If table doesn't exist, return empty array instead of error
      if (error.message?.includes("Could not find the table") || error.message?.includes("relation") || error.code === "PGRST116") {
        console.warn("[API] info_cards table does not exist, returning empty array");
        return NextResponse.json({ data: [] });
      }
      return NextResponse.json(
        { message: `Failed to fetch info cards: ${error.message || "Database error"}`, data: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || [] });
  } catch (err) {
    console.error("[API] GET info_cards error:", err);
    // Always return empty array on error to allow page to load
    return NextResponse.json(
      { message: `Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}`, data: [] },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      icon,
      language,
      autoTranslate,
    } = body as {
      title: string;
      content?: string | null;
      icon?: string | null;
      language?: "vi" | "zh-TW" | "en";
      autoTranslate?: boolean;
    };

    if (!title) {
      return NextResponse.json(
        { message: "Missing required field: title." },
        { status: 400 }
      );
    }

    // Simplified: Always save as Vietnamese, no translation
    const newCard: Record<string, any> = {
      title,
      content: content || null,
      icon: icon || null,
      title_vi: title, // Also set _vi field
      content_vi: content || null,
    };

    // Translation disabled - all AI translation logic removed

    const { data, error } = await supabase
      .from("info_cards")
      .insert(newCard)
      .select()
      .single();

    if (error) {
      console.error("[API] ❌ Error creating info card:", error);
      return NextResponse.json(
        { message: "Failed to create info card." },
        { status: 500 }
      );
    }

    console.log(`[API] ✅ Successfully created info card`);
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Unexpected error creating info card:", err);
    return NextResponse.json(
      { message: "Unexpected error creating info card." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      content,
      icon,
      language,
      autoTranslate,
    } = body as {
      id: string | number;
      title?: string;
      content?: string | null;
      icon?: string | null;
      language?: "vi" | "zh-TW" | "en";
      autoTranslate?: boolean;
    };

    if (!id) {
      return NextResponse.json(
        { message: "Missing info card id." },
        { status: 400 }
      );
    }

    // Simplified: Always save as Vietnamese, no translation
    const finalUpdates: Record<string, any> = {};

    if (title !== undefined) {
      finalUpdates.title = title;
      finalUpdates.title_vi = title; // Also update _vi field
    }
    if (content !== undefined) {
      finalUpdates.content = content;
      finalUpdates.content_vi = content; // Also update _vi field
    }
    if (icon !== undefined) {
      finalUpdates.icon = icon;
    }

    // Translation disabled - all AI translation logic removed

    const { data, error } = await supabase
      .from("info_cards")
      .update(finalUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[API] ❌ Error updating info card:", error);
      return NextResponse.json(
        { message: "Failed to update info card." },
        { status: 500 }
      );
    }

    console.log(`[API] ✅ Successfully updated info card ${id}`);
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Unexpected error updating info card:", err);
    return NextResponse.json(
      { message: "Unexpected error updating info card." },
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
        { message: "Missing info card id." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("info_cards")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[API] ❌ Error deleting info card:", error);
      return NextResponse.json(
        { message: "Failed to delete info card." },
        { status: 500 }
      );
    }

    console.log(`[API] ✅ Successfully deleted info card ${id}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error deleting info card:", err);
    return NextResponse.json(
      { message: "Unexpected error deleting info card." },
      { status: 500 }
    );
  }
}

