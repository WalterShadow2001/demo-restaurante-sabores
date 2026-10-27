import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const resenas = await prisma.resena.findMany({
      where: { aprobada: true },
      orderBy: { creadoEn: "desc" },
    });
    return NextResponse.json({ resenas });
  } catch (e: any) {
    console.error("GET /api/resenas error:", e);
    return NextResponse.json(
      { error: "No se pudieron obtener las reseñas", detail: e.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { autor, calificacion, comentario } = body;

    if (!autor || typeof autor !== "string" || autor.trim().length === 0) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }
    if (autor.trim().length > 80) {
      return NextResponse.json({ error: "El nombre es demasiado largo (máx. 80)" }, { status: 400 });
    }
    if (
      typeof calificacion !== "number" ||
      !Number.isInteger(calificacion) ||
      calificacion < 1 ||
      calificacion > 5
    ) {
      return NextResponse.json({ error: "La calificación debe ser entre 1 y 5" }, { status: 400 });
    }
    if (!comentario || typeof comentario !== "string" || comentario.trim().length < 10) {
      return NextResponse.json({ error: "El comentario debe tener al menos 10 caracteres" }, { status: 400 });
    }
    if (comentario.trim().length > 500) {
      return NextResponse.json({ error: "El comentario es demasiado largo (máx. 500)" }, { status: 400 });
    }

    const resena = await prisma.resena.create({
      data: {
        autor: autor.trim(),
        calificacion,
        comentario: comentario.trim(),
        aprobada: false,
      },
    });
    return NextResponse.json({ resena }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/resenas error:", e);
    return NextResponse.json(
      { error: "No se pudo crear la reseña", detail: e.message },
      { status: 500 }
    );
  }
}
