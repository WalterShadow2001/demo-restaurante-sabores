import Link from "next/link";
import { ArrowRight, MapPin, Clock, Star, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DishCard } from "@/components/site/dish-card";
import { StarRating } from "@/components/site/star-rating";
import { getFeaturedPlatillos, getApprovedResenas } from "@/lib/queries";
import { formatDateShort } from "@/lib/format";
import { MotionDiv } from "@/components/site/motion";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [platillos, resenas] = await Promise.all([
    getFeaturedPlatillos(4),
    getApprovedResenas(3),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pattern-bg">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/30 via-background to-background" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <MotionDiv
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-4 gap-2 border-primary/40 text-primary">
                <UtensilsCrossed className="size-3.5" />
                Cocina tradicional mexicana
              </Badge>
              <h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Sabores de <span className="text-primary">Delicias</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground text-pretty">
                Recetas de la abuela, ingredientes frescos del día y mucho
                cariño en cada plato. Tacos al pastor trompeados al momento,
                mole casero de 23 ingredientes y postres que enamoran.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/menu">
                    Ver el menú <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/ubicacion">
                    <MapPin className="size-4" /> Cómo llegar
                  </Link>
                </Button>
              </div>

              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-center">
                <div>
                  <dt className="font-serif text-2xl font-bold text-primary">12</dt>
                  <dd className="text-xs uppercase tracking-wider text-muted-foreground">
                    Platillos
                  </dd>
                </div>
                <div>
                  <dt className="font-serif text-2xl font-bold text-primary">4.7</dt>
                  <dd className="text-xs uppercase tracking-wider text-muted-foreground">
                    Calificación
                  </dd>
                </div>
                <div>
                  <dt className="font-serif text-2xl font-bold text-primary">100%</dt>
                  <dd className="text-xs uppercase tracking-wider text-muted-foreground">
                    Casero
                  </dd>
                </div>
              </dl>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="grid grid-cols-2 gap-3">
                <Card className="aspect-[3/4] place-items-center bg-gradient-to-br from-primary/15 to-secondary/30 text-7xl">
                  🌮
                </Card>
                <Card className="mt-6 aspect-[3/4] place-items-center bg-gradient-to-br from-secondary/40 to-accent/20 text-7xl">
                  🥑
                </Card>
                <Card className="-mt-6 aspect-[3/4] place-items-center bg-gradient-to-br from-accent/30 to-secondary/30 text-7xl">
                  🍲
                </Card>
                <Card className="aspect-[3/4] place-items-center bg-gradient-to-br from-secondary/40 to-primary/15 text-7xl">
                  🍰
                </Card>
              </div>
              <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rotate-3 sm:block">
                <Badge className="gap-1 bg-accent text-accent-foreground shadow-md">
                  <Star className="size-3" /> Hecho en casa
                </Badge>
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* HORARIO + UBICACIÓN */}
      <section className="border-y border-border bg-secondary/20" aria-labelledby="info-section-title">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 id="info-section-title" className="sr-only">Información del restaurante</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-5">
              <div className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
                <Clock className="size-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold">Horario</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>Lunes a Jueves · 13:00 – 22:00</li>
                  <li>Viernes y Sábados · 13:00 – 23:30</li>
                  <li>Domingo · 13:00 – 19:00</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-5">
              <div className="grid size-11 place-items-center rounded-full bg-accent/15 text-accent">
                <MapPin className="size-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold">Ubicación</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Av. Agricultura 245, Centro<br />
                  Delicias, Chihuahua, México
                </p>
                <Link
                  href="/ubicacion"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Ver mapa y cómo llegar <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DISHES */}
      <section aria-labelledby="featured-section-title" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <Badge variant="outline" className="mb-2 border-accent/40 text-accent">
              Lo más pedido
            </Badge>
            <h2 id="featured-section-title" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Recomendaciones de la casa
            </h2>
          </div>
          <Button asChild variant="ghost" className="gap-1">
            <Link href="/menu">
              Ver menú completo <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {platillos.length === 0 ? (
          <div className="grid place-items-center rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">Aún no hay platillos destacados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {platillos.map((p, i) => (
              <DishCard key={p.id} platillo={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* REVIEWS */}
      {resenas.length > 0 && (
        <section
          aria-labelledby="reviews-section-title"
          className="border-t border-border bg-gradient-to-b from-secondary/15 to-background"
        >
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <Badge variant="outline" className="mb-2 border-primary/40 text-primary">
                  Opiniones reales
                </Badge>
                <h2 id="reviews-section-title" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                  Lo que dicen nuestros comensales
                </h2>
              </div>
              <Button asChild variant="ghost" className="gap-1">
                <Link href="/resenas">
                  Ver todas las reseñas <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {resenas.map((r, i) => (
                <MotionDiv
                  key={r.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Card className="flex h-full flex-col gap-3 p-5">
                    <StarRating value={r.calificacion} size={18} />
                    <p className="text-sm text-foreground/80 text-pretty">
                      &ldquo;{r.comentario}&rdquo;
                    </p>
                    <div className="mt-auto pt-2">
                      <p className="font-serif font-semibold">{r.autor}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateShort(r.creadoEn)}
                      </p>
                    </div>
                  </Card>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground sm:px-12 sm:py-14">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">
              ¿Listo para probar México en cada bocado?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80 text-pretty">
              Explora nuestra carta completa y arma tu pedido desde casa. Te
              esperamos en Delicias, Chihuahua.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link href="/menu">
                  Explorar el menú <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link href="/resenas">
                  Dejar una reseña
                </Link>
              </Button>
            </div>
          </MotionDiv>
        </div>
      </section>
    </>
  );
}
