import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const ESTADOS_VALIDOS = ["recibido", "en_preparacion", "listo", "entregado"];

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
    const body = await req.json();
    const { estado, notas } = body;

    const existing = await prisma.pedido.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Pedido no encontrado" },
        { status: 404 }
      );
    }

    const data: any = {};
    if (estado !== undefined) {
      if (!ESTADOS_VALIDOS.includes(estado)) {
        return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
      }
      data.estado = estado;
    }
    if (notas !== undefined) {
      data.notas = notas ? String(notas).trim() : null;
    }

    const updated = await prisma.pedido.update({ where: { id }, data });
    return NextResponse.json({ pedido: updated });
  } catch (e: any) {
    console.error("PUT /api/pedidos/[id] error:", e);
    return NextResponse.json(
      { error: "No se pudo actualizar el pedido", detail: e.message },
      { status: 500 }
    );
  }
}
