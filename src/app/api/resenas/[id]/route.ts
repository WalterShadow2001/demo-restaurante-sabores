import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  try {
    const cookie = req.cookies.get("admin_session")?.value;
    if (cookie !== "true") {
      return NextResponse.json(
        { error: "No autorizado. Inicia sesión como administrador." },
        { status: 401 }
      );
    }
    const { id } = await ctx.params;
    const existing = await prisma.resena.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Reseña no encontrada" },
        { status: 404 }
      );
    }
    await prisma.resena.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("DELETE /api/resenas/[id] error:", e);
    return NextResponse.json(
      { error: "No se pudo eliminar la reseña", detail: e.message },
      { status: 500 }
    );
  }
}
