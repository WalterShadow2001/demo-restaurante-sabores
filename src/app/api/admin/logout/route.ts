import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  try {
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return res;
  } catch (e: any) {
    console.error("POST /api/admin/logout error:", e);
    return NextResponse.json(
      { error: "No se pudo cerrar sesión", detail: e.message },
      { status: 500 }
    );
  }
}
