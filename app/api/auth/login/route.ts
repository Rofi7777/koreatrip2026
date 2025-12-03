import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body as { password?: string };

    const teamPassword = process.env.TEAM_PASSWORD;

    if (!teamPassword) {
      return NextResponse.json(
        { message: "Server configuration error." },
        { status: 500 }
      );
    }

    if (!password || password !== teamPassword) {
      return NextResponse.json(
        { message: "Invalid password." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("team_session", "active", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}





