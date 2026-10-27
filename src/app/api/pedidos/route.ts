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
    const estado = searchParams.get("estado");

    const where: any = {};
    if (estado && estado !== "todos") {
      where.estado = estado;
    }
    const pedidos = await prisma.pedido.findMany({
      where,
      orderBy: { creadoEn: "desc" },
    });
    return NextResponse.json({ pedidos });
  } catch (e: any) {
    console.error("GET /api/pedidos error:", e);
    return NextResponse.json(
      { error: "No se pudieron obtener los pedidos", detail: e.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clienteNombre, clientePhone, items, total, notas } = body;

    if (!clienteNombre || typeof clienteNombre !== "string" || clienteNombre.trim().length === 0) {
      return NextResponse.json({ error: "El nombre del cliente es obligatorio" }, { status: 400 });
    }
    if (!clientePhone || typeof clientePhone !== "string" || clientePhone.trim().length === 0) {
      return NextResponse.json({ error: "El teléfono del cliente es obligatorio" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "El pedido debe incluir al menos un artículo" }, { status: 400 });
    }
    if (typeof total !== "number" || total < 0) {
      return NextResponse.json({ error: "El total es inválido" }, { status: 400 });
    }

    const pedido = await prisma.pedido.create({
      data: {
        clienteNombre: clienteNombre.trim(),
        clientePhone: clientePhone.trim(),
        items: JSON.stringify(items),
        total,
        estado: "recibido",
        notas: notas ? String(notas).trim() : null,
      },
    });

    return NextResponse.json({ pedido }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/pedidos error:", e);
    return NextResponse.json(
      { error: "No se pudo crear el pedido", detail: e.message },
      { status: 500 }
    );
  }
}
