import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/site/star-rating";
import { ResenaForm } from "@/components/site/resena-form";
import { MotionDiv } from "@/components/site/motion";
import { getApprovedResenas } from "@/lib/queries";
import { formatDateShort } from "@/lib/format";
import type { Resena } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reseñas | Sabores de Delicias",
  description:
    "Opiniones de nuestros comensales en Delicias, Chihuahua. Comparte tu experiencia con nosotros.",
};

export default async function ResenasPage() {
  const resenas: Resena[] = await getApprovedResenas(100);

  // Compute average
  const promedio =
    resenas.length > 0
      ? resenas.reduce((s, r) => s + r.calificacion, 0) / resenas.length
      : 0;

  return (
    <section className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <Badge variant="outline" className="mb-3 border-primary/40 text-primary">
          Opiniones
        </Badge>
        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          Lo que dicen nuestros comensales
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground text-pretty">
          Cada platillo lleva cariño de casa. Lo que más nos llena es leer
          tus palabras. Estas son las reseñas que ya pasaron por nuestra cocina.
        </p>
        {resenas.length > 0 && (
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5">
            <StarRating value={Math.round(promedio)} size={18} />
            <span className="font-serif text-lg font-bold">
              {promedio.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              · {resenas.length} reseñas
            </span>
          </div>
        )}
      </div>

      {resenas.length === 0 ? (
        <div className="grid place-items-center rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">
            Aún no hay reseñas publicadas. ¡Sé la primera persona en dejar la suya!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {resenas.map((r, i) => (
            <MotionDiv
              key={r.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.3) }}
            >
              <Card className="flex h-full flex-col gap-2 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-full bg-primary/10 font-serif text-base font-bold text-primary">
                      {r.autor.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-serif font-semibold">{r.autor}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateShort(r.creadoEn)}
                      </p>
                    </div>
                  </div>
                  <StarRating value={r.calificacion} size={14} />
                </div>
                <p className="text-sm text-foreground/80 text-pretty">
                  &ldquo;{r.comentario}&rdquo;
                </p>
              </Card>
            </MotionDiv>
          ))}
        </div>
      )}

      <div className="mt-12">
        <ResenaForm />
      </div>
    </section>
  );
}
