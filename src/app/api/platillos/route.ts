import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get("categoria") ?? undefined;
    const destacado = searchParams.get("destacado");

    const where: any = {};
    if (categoria && categoria !== "todas") {
      where.categoria = categoria;
    }
    if (destacado === "true") {
      where.destacado = true;
    }

    const platillos = await prisma.platillo.findMany({
      where,
      orderBy: [{ categoria: "asc" }, { creadoEn: "asc" }],
    });
    return NextResponse.json({ platillos });
  } catch (e: any) {
    console.error("GET /api/platillos error:", e);
    return NextResponse.json(
      { error: "No se pudieron obtener los platillos", detail: e.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check admin cookie
    const cookie = req.cookies.get("admin_session")?.value;
    if (cookie !== "true") {
      return NextResponse.json(
        { error: "No autorizado. Inicia sesión como administrador." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { nombre, descripcion, precio, categoria, imagen, etiquetas, destacado, disponible } = body;

    if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }
    if (!descripcion || typeof descripcion !== "string") {
      return NextResponse.json({ error: "La descripción es obligatoria" }, { status: 400 });
    }
    if (typeof precio !== "number" || precio <= 0) {
      return NextResponse.json({ error: "El precio debe ser un número positivo" }, { status: 400 });
    }
    const categoriasValidas = ["Entrada", "Plato Fuerte", "Bebida", "Postre"];
    if (!categoriasValidas.includes(categoria)) {
      return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });
    }
    if (!imagen || typeof imagen !== "string") {
      return NextResponse.json({ error: "La imagen (emoji o URL) es obligatoria" }, { status: 400 });
    }
    if (!etiquetas || typeof etiquetas !== "string") {
      return NextResponse.json({ error: "Las etiquetas son obligatorias" }, { status: 400 });
    }

    const platillo = await prisma.platillo.create({
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio,
        categoria,
        imagen: imagen.trim(),
        etiquetas: etiquetas.trim(),
        destacado: Boolean(destacado),
        disponible: disponible === undefined ? true : Boolean(disponible),
      },
    });

    return NextResponse.json({ platillo }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/platillos error:", e);
    return NextResponse.json(
      { error: "No se pudo crear el platillo", detail: e.message },
      { status: 500 }
    );
  }
}
