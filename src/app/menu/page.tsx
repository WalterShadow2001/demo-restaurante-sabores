import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MenuTabs } from "@/components/site/menu-tabs";
import { getAllPlatillos, getPlatillosByCategoria } from "@/lib/queries";
import { CATEGORIAS } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Menú | Sabores de Delicias",
  description:
    "Explora nuestra carta completa: entradas, platos fuertes, bebidas y postres. Comida mexicana tradicional en Delicias, Chihuahua.",
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const sp = await searchParams;
  const requested = sp.categoria ?? "Entrada";
  const initialTab = CATEGORIAS.includes(requested as any)
    ? requested
    : "Entrada";

  const all = await getAllPlatillos();

  return (
    <section className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="outline" className="mb-2 border-primary/40 text-primary">
            Carta
          </Badge>
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            Nuestro Menú
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground text-pretty">
            Recetas mexicanas preparadas al momento con ingredientes frescos.
            Agrega tus favoritos al pedido y finaliza por WhatsApp.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-1">
          <Link href="/">
            <ArrowLeft className="size-4" /> Volver al inicio
          </Link>
        </Button>
      </div>

      {all.length === 0 ? (
        <div className="grid place-items-center rounded-lg border border-dashed border-border p-16 text-center">
          <SearchX className="mb-2 size-8 text-muted-foreground" />
          <p className="text-muted-foreground">
            Aún no hay platillos publicados. Vuelve pronto.
          </p>
        </div>
      ) : (
        <MenuTabs
          platillos={all}
          initialTab={initialTab}
          categorias={CATEGORIAS.map((c) => ({
            value: c,
            label: c === "Plato Fuerte" ? "Platos fuertes" : `${c}s`,
          }))}
        />
      )}
    </section>
  );
}
