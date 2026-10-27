// Shared TypeScript types for Platillo / Pedido / Resena (mirrors Prisma models)

export interface Platillo {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
  etiquetas: string;
  disponible: boolean;
  destacado: boolean;
  creadoEn: string | Date;
}

export interface PedidoItem {
  platilloId: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface Pedido {
  id: string;
  clienteNombre: string;
  clientePhone: string;
  items: string; // JSON string of PedidoItem[]
  total: number;
  estado: "recibido" | "en_preparacion" | "listo" | "entregado";
  notas?: string | null;
  creadoEn: string | Date;
}

export interface Resena {
  id: string;
  autor: string;
  calificacion: number; // 1-5
  comentario: string;
  aprobada: boolean;
  creadoEn: string | Date;
}

export type EstadoPedido = "recibido" | "en_preparacion" | "listo" | "entregado";

export const ESTADO_PEDIDO_LABELS: Record<EstadoPedido, string> = {
  recibido: "Recibido",
  en_preparacion: "En preparación",
  listo: "Listo para entregar",
  entregado: "Entregado",
};

export const ESTADO_PEDIDO_BADGE: Record<EstadoPedido, string> = {
  recibido: "bg-secondary text-secondary-foreground",
  en_preparacion: "bg-primary text-primary-foreground",
  listo: "bg-accent text-accent-foreground",
  entregado: "bg-muted text-foreground",
};

export const CATEGORIAS = [
  "Entrada",
  "Plato Fuerte",
  "Bebida",
  "Postre",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];
