import { redirect } from "next/navigation";
import Link from "next/link";
import { UtensilsCrossed, ReceiptText, Star, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AdminNav } from "@/components/site/admin-nav";
import { getDashboardStats } from "@/lib/queries";
import { isAuthenticated } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { ESTADO_PEDIDO_LABELS, ESTADO_PEDIDO_BADGE, type Pedido, type PedidoItem } from "@/lib/types";
import { MotionDiv } from "@/components/site/motion";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Total de platillos",
      value: stats.totalPlatillos,
      icon: UtensilsCrossed,
      href: "/admin/platillos",
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Pedidos totales",
      value: stats.totalPedidos,
      icon: ReceiptText,
      href: "/admin/pedidos",
      color: "bg-accent/15 text-accent",
    },
    {
      label: "Pedidos de hoy",
      value: stats.pedidosHoy,
      icon: Calendar,
      href: "/admin/pedidos",
      color: "bg-secondary/30 text-secondary-foreground",
    },
    {
      label: "Reseñas pendientes",
      value: stats.resenasPendientes,
      icon: Star,
      href: "/admin/resenas",
      color: "bg-secondary/30 text-secondary-foreground",
    },
  ];

  return (
    <AdminNav>
      <div className="space-y-6">
        <header>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Resumen del estado actual del restaurante.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <MotionDiv
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link href={c.href}>
                <Card className="transition-all hover:border-primary/40 hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`grid size-12 place-items-center rounded-full ${c.color}`}>
                      <c.icon className="size-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold leading-none">{c.value}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                        {c.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </MotionDiv>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pedidos recientes */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-lg">Pedidos recientes</CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin/pedidos">Ver todos</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {stats.recentPedidos.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">
                  Aún no hay pedidos registrados.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {stats.recentPedidos.map((p) => {
                    const items: PedidoItem[] = (() => {
                      try {
                        return JSON.parse((p as unknown as Pedido).items) as PedidoItem[];
                      } catch {
                        return [];
                      }
                    })();
                    const estado = ((p as unknown as Pedido).estado ?? "recibido") as keyof typeof ESTADO_PEDIDO_LABELS;
                    return (
                      <li key={p.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold truncate">
                              {(p as unknown as Pedido).clienteNombre}
                            </p>
                            <Badge className={ESTADO_PEDIDO_BADGE[estado]}>
                              {ESTADO_PEDIDO_LABELS[estado]}
                            </Badge>
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {items.length} {items.length === 1 ? "artículo" : "artículos"} ·{" "}
                            {formatDate((p as unknown as Pedido).creadoEn)}
                          </p>
                        </div>
                        <p className="font-serif text-lg font-bold text-primary">
                          {formatPrice((p as unknown as Pedido).total)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card>
            <CardHeader className="border-b py-4">
              <CardTitle className="font-serif text-lg">Acciones rápidas</CardTitle>
              <CardDescription>Tareas frecuentes de administración</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 p-4">
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link href="/admin/platillos">
                  <UtensilsCrossed className="size-4" /> Gestionar platillos
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link href="/admin/pedidos">
                  <ReceiptText className="size-4" /> Ver pedidos
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link href="/admin/resenas">
                  <Star className="size-4" /> Aprobar reseñas
                  {stats.resenasPendientes > 0 && (
                    <Badge className="ml-auto bg-accent text-accent-foreground">
                      {stats.resenasPendientes}
                    </Badge>
                  )}
                </Link>
              </Button>
              <Separator className="my-2" />
              <Button asChild variant="ghost" className="justify-start gap-2">
                <Link href="/">
                  <TrendingUp className="size-4" /> Ver sitio público
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminNav>
  );
}
