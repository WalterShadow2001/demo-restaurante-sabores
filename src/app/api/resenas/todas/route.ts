import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get("admin_session")?.value;
    if (cookie !== "true") {
      return NextResponse.json(
        { error: "No autorizado. Inicia sesión como administrador." },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(req.url);
    const filtro = searchParams.get("filtro");
    const where: any = {};
    if (filtro === "pendientes") {
      where.aprobada = false;
    } else if (filtro === "aprobadas") {
      where.aprobada = true;
    }
    const resenas = await prisma.resena.findMany({
      where,
      orderBy: { creadoEn: "desc" },
    });
    return NextResponse.json({ resenas });
  } catch (e: any) {
    console.error("GET /api/resenas/todas error:", e);
    return NextResponse.json(
      { error: "No se pudieron obtener las reseñas", detail: e.message },
      { status: 500 }
    );
  }
}
