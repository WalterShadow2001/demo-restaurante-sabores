import { NextRequest, NextResponse } from "next/server";
import { ADMIN_PASSWORD } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Debes escribir la contraseña" },
        { status: 400 }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 horas
    });
    return res;
  } catch (e: any) {
    console.error("POST /api/admin/login error:", e);
    return NextResponse.json(
      { error: "No se pudo iniciar sesión", detail: e.message },
      { status: 500 }
    );
  }
}
