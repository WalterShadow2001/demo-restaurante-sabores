import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const platillo = await prisma.platillo.findUnique({ where: { id } });
    if (!platillo) {
      return NextResponse.json(
        { error: "Platillo no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json({ platillo });
  } catch (e: any) {
    console.error("GET /api/platillos/[id] error:", e);
    return NextResponse.json(
      { error: "No se pudo obtener el platillo", detail: e.message },
      { status: 500 }
    );
  }
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
    const body = await req.json();
    const { nombre, descripcion, precio, categoria, imagen, etiquetas, destacado, disponible } = body;

    const existing = await prisma.platillo.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Platillo no encontrado" },
        { status: 404 }
      );
    }

    const data: any = {};
    if (nombre !== undefined) data.nombre = String(nombre).trim();
    if (descripcion !== undefined) data.descripcion = String(descripcion).trim();
    if (precio !== undefined) {
      if (typeof precio !== "number" || precio < 0) {
        return NextResponse.json({ error: "Precio inválido" }, { status: 400 });
      }
      data.precio = precio;
    }
    if (categoria !== undefined) {
      const categoriasValidas = ["Entrada", "Plato Fuerte", "Bebida", "Postre"];
      if (!categoriasValidas.includes(categoria)) {
        return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });
      }
      data.categoria = categoria;
    }
    if (imagen !== undefined) data.imagen = String(imagen).trim();
    if (etiquetas !== undefined) data.etiquetas = String(etiquetas).trim();
    if (destacado !== undefined) data.destacado = Boolean(destacado);
    if (disponible !== undefined) data.disponible = Boolean(disponible);

    const updated = await prisma.platillo.update({ where: { id }, data });
    return NextResponse.json({ platillo: updated });
  } catch (e: any) {
    console.error("PUT /api/platillos/[id] error:", e);
    return NextResponse.json(
      { error: "No se pudo actualizar el platillo", detail: e.message },
      { status: 500 }
    );
  }
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
    const existing = await prisma.platillo.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Platillo no encontrado" },
        { status: 404 }
      );
    }
    await prisma.platillo.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("DELETE /api/platillos/[id] error:", e);
    return NextResponse.json(
      { error: "No se pudo eliminar el platillo", detail: e.message },
      { status: 500 }
    );
  }
}
