import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("highlights")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching highlights:", error);
      // If table doesn't exist, return empty array
      if (error.message?.includes("Could not find the table") || error.message?.includes("relation") || error.code === "PGRST116") {
        console.warn("[API] highlights table does not exist, returning empty array");
        return NextResponse.json({ data: [] });
      }
      return NextResponse.json(
        { message: `Failed to fetch highlights: ${error.message || "Database error"}`, data: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || [] });
  } catch (err) {
    console.error("[API] GET highlights error:", err);
    return NextResponse.json(
      { message: `Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}`, data: [] },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, image_url, category, sort_order } = body as {
      title?: string;
      description?: string;
      image_url?: string;
      category?: string;
      sort_order?: number;
    };

    if (!title || !image_url) {
      return NextResponse.json(
        { message: "Title and image_url are required." },
        { status: 400 }
      );
    }

    const newHighlight: Record<string, any> = {
      title,
      description: description || null,
      image_url,
      category: category || "Vibe",
      sort_order: sort_order ?? 0,
    };

    const { data, error } = await supabase
      .from("highlights")
      .insert(newHighlight)
      .select()
      .single();

    if (error) {
      console.error("[API] ❌ Error creating highlight:", error);
      return NextResponse.json(
        { message: "Failed to create highlight." },
        { status: 500 }
      );
    }

    console.log(`[API] ✅ Successfully created highlight`);
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Unexpected error creating highlight:", err);
    return NextResponse.json(
      { message: "Unexpected error creating highlight." },
      { status: 500 }
    );
  }
}

