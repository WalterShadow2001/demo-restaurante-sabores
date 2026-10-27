import { prisma } from "@/lib/db";
import type { Platillo, Resena, Pedido } from "@/lib/types";

export async function getFeaturedPlatillos(limit = 4): Promise<Platillo[]> {
  const rows = await prisma.platillo.findMany({
    where: { destacado: true, disponible: true },
    orderBy: { creadoEn: "asc" },
    take: limit,
  });
  return rows as Platillo[];
}

export async function getPlatillosByCategoria(categoria: string): Promise<Platillo[]> {
  const rows = await prisma.platillo.findMany({
    where: { categoria },
    orderBy: { creadoEn: "asc" },
  });
  return rows as Platillo[];
}

export async function getPlatilloById(id: string): Promise<Platillo | null> {
  const row = await prisma.platillo.findUnique({ where: { id } });
  return row as Platillo | null;
}

export async function getAllPlatillos(): Promise<Platillo[]> {
  const rows = await prisma.platillo.findMany({
    orderBy: [{ categoria: "asc" }, { creadoEn: "asc" }],
  });
  return rows as Platillo[];
}

export async function getApprovedResenas(limit = 10): Promise<Resena[]> {
  const rows = await prisma.resena.findMany({
    where: { aprobada: true },
    orderBy: { creadoEn: "desc" },
    take: limit,
  });
  return rows as Resena[];
}

export async function getDashboardStats() {
  const [totalPlatillos, totalPedidos, totalResenas, resenasPendientes] =
    await Promise.all([
      prisma.platillo.count(),
      prisma.pedido.count(),
      prisma.resena.count(),
      prisma.resena.count({ where: { aprobada: false } }),
    ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pedidosHoy = await prisma.pedido.count({
    where: { creadoEn: { gte: today } },
  });

  const recentPedidosRaw = await prisma.pedido.findMany({
    orderBy: { creadoEn: "desc" },
    take: 6,
  });
  const recentPedidos = recentPedidosRaw as unknown as Pedido[];

  return {
    totalPlatillos,
    totalPedidos,
    pedidosHoy,
    totalResenas,
    resenasPendientes,
    recentPedidos,
  };
}
