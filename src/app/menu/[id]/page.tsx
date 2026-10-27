import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AddToCartButton } from "@/components/site/add-to-cart-button";
import { getPlatilloById, getPlatillosByCategoria } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import { MotionDiv, MotionArticle } from "@/components/site/motion";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getPlatilloById(id);
  if (!p) return { title: "Platillo no encontrado | Sabores de Delicias" };
  return {
    title: `${p.nombre} | Sabores de Delicias`,
    description: p.descripcion,
  };
}

export default async function PlatilloDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const platillo = await getPlatilloById(id);

  if (!platillo) {
    notFound();
  }

  const relacionados = (await getPlatillosByCategoria(platillo.categoria))
    .filter((p) => p.id !== platillo.id)
    .slice(0, 3);

  const etiquetas = platillo.etiquetas
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  return (
    <article className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 gap-1">
        <Link href="/menu">
          <ArrowLeft className="size-4" /> Volver al menú
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image */}
        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="relative grid aspect-square place-items-center bg-gradient-to-br from-secondary/30 via-background to-accent/15 p-8 text-center">
            <span className="text-[10rem] sm:text-[12rem]">{platillo.imagen}</span>
            {platillo.destacado && (
              <Badge className="absolute left-6 top-6 bg-primary text-primary-foreground">
                Recomendado de la casa
              </Badge>
            )}
          </Card>
        </MotionDiv>

        {/* Info */}
        <MotionDiv
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          <Badge variant="outline" className="mb-3 self-start border-accent/40 text-accent">
            {platillo.categoria}
          </Badge>
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {platillo.nombre}
          </h1>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-primary">
              {formatPrice(platillo.precio)}
            </span>
            <span className="text-sm text-muted-foreground">MXN · porción</span>
          </div>

          <Separator className="my-6" />

          <h2 className="font-serif text-lg font-semibold">Descripción</h2>
          <p className="mt-2 text-base text-foreground/80 text-pretty">
            {platillo.descripcion}
          </p>

          {etiquetas.length > 0 && (
            <div className="mt-6">
              <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Etiquetas
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {etiquetas.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="capitalize"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {!platillo.disponible && (
            <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              Este platillo no está disponible por ahora. Vuelve pronto.
            </div>
          )}

          <div className="mt-8">
            <AddToCartButton platillo={platillo} />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-md border border-border bg-muted/30 p-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Tiempo de preparación</p>
                <p className="text-muted-foreground">15–25 minutos</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-md border border-border bg-muted/30 p-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Servido en</p>
                <p className="text-muted-foreground">Delicias, Chihuahua</p>
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="mt-16" aria-labelledby="related-title">
          <h2 id="related-title" className="mb-5 font-serif text-2xl font-bold">
            También te puede gustar
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((p) => (
              <Link
                key={p.id}
                href={`/menu/${p.id}`}
                className="group flex gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
              >
                <span className="grid size-16 place-items-center rounded-md bg-secondary/20 text-3xl">
                  {p.imagen}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 font-medium group-hover:text-primary">
                    {p.nombre}
                  </p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {p.descripcion}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {formatPrice(p.precio)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
