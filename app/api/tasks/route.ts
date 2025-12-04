import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching tasks:", error);
      // If table doesn't exist, return empty array instead of error
      if (error.message?.includes("Could not find the table") || error.message?.includes("relation") || error.code === "PGRST116") {
        console.warn("[API] tasks table does not exist, returning empty array");
        return NextResponse.json(
          { data: [] },
          { headers: { "Cache-Control": "no-store, max-age=0" } }
        );
      }
      return NextResponse.json(
        { message: `Failed to fetch tasks: ${error.message || "Database error"}`, data: [] },
        { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    return NextResponse.json(
      { data: data || [] },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    console.error("[API] GET tasks error:", err);
    // Always return empty array on error to allow page to load
    return NextResponse.json(
      { message: `Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}`, data: [] },
      { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      assignee,
      icon,
      language,
      autoTranslate,
    } = body as {
      title: string;
      description?: string | null;
      assignee?: string | null;
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
    const newTask: Record<string, any> = {
      title,
      description: description || null,
      assignee: assignee || null,
      icon: icon || null,
      title_vi: title, // Also set _vi field
      description_vi: description || null,
    };

    // Translation disabled - all AI translation logic removed

    const { data, error } = await supabase
      .from("tasks")
      .insert(newTask)
      .select()
      .single();

    if (error) {
      console.error("[API] ❌ Error creating task:", error);
      return NextResponse.json(
        { message: "Failed to create task." },
        { status: 500 }
      );
    }

    console.log(`[API] ✅ Successfully created task`);
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Unexpected error creating task:", err);
    return NextResponse.json(
      { message: "Unexpected error creating task." },
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
      description,
      assignee,
      icon,
      language,
      autoTranslate,
    } = body as {
      id: string | number;
      title?: string;
      description?: string | null;
      assignee?: string | null;
      icon?: string | null;
      language?: "vi" | "zh-TW" | "en";
      autoTranslate?: boolean;
    };

    if (!id) {
      return NextResponse.json(
        { message: "Missing task id." },
        { status: 400 }
      );
    }

    // Simplified: Always save as Vietnamese, no translation
    const finalUpdates: Record<string, any> = {};

    if (title !== undefined) {
      finalUpdates.title = title;
      finalUpdates.title_vi = title; // Also update _vi field
    }
    if (description !== undefined) {
      finalUpdates.description = description;
      finalUpdates.description_vi = description; // Also update _vi field
    }
    if (assignee !== undefined) {
      finalUpdates.assignee = assignee;
    }
    if (icon !== undefined) {
      finalUpdates.icon = icon;
    }

    // Translation disabled - all AI translation logic removed

    const { data, error } = await supabase
      .from("tasks")
      .update(finalUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[API] ❌ Error updating task:", error);
      return NextResponse.json(
        { message: "Failed to update task." },
        { status: 500 }
      );
    }

    console.log(`[API] ✅ Successfully updated task ${id}`);
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Unexpected error updating task:", err);
    return NextResponse.json(
      { message: "Unexpected error updating task." },
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
        { message: "Missing task id." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[API] ❌ Error deleting task:", error);
      return NextResponse.json(
        { message: "Failed to delete task." },
        { status: 500 }
      );
    }

    console.log(`[API] ✅ Successfully deleted task ${id}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error deleting task:", err);
    return NextResponse.json(
      { message: "Unexpected error deleting task." },
      { status: 500 }
    );
  }
}

