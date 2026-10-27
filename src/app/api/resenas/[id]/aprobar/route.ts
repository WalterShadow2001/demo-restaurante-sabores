import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
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
    const updated = await prisma.resena.update({
      where: { id },
      data: { aprobada: true },
    });
    return NextResponse.json({ resena: updated });
  } catch (e: any) {
    console.error("PUT /api/resenas/[id]/aprobar error:", e);
    return NextResponse.json(
      { error: "No se pudo aprobar la reseña", detail: e.message },
      { status: 500 }
    );
  }
}
