import Link from "next/link";
import { MapPin, Clock, Phone, Car, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MotionDiv } from "@/components/site/motion";

export const metadata = {
  title: "Ubicación | Sabores de Delicias",
  description:
    "Cómo llegar a Sabores de Delicias en Delicias, Chihuahua. Horario, teléfono y mapa.",
};

const DIRECCION = "Av. Agricultura 245, Centro, Delicias, Chihuahua, México";
const TELEFONO_DISPLAY = "+52 639 472 8100";
const TELEFONO_HREF = "+526394728100";
const MAPS_URL =
  "https://www.google.com/maps?q=Delicias,+Chihuahua,+Mexico&output=embed";
const MAPS_LINK_URL = "https://www.google.com/maps/search/?api=1&query=Delicias+Chihuahua";

export default function UbicacionPage() {
  return (
    <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <Badge variant="outline" className="mb-3 border-primary/40 text-primary">
          Encuéntranos
        </Badge>
        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          Visítanos en Delicias
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-pretty">
          Estamos en el corazón de Delicias, Chihuahua. Te esperamos con
          café de olla y pan recién horneado.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Map */}
        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden p-0">
            <div className="aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
              <iframe
                src={MAPS_URL}
                title="Mapa: Sabores de Delicias en Delicias, Chihuahua"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Card>
        </MotionDiv>

        {/* Contact info */}
        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
                <MapPin className="size-5" />
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-lg font-semibold">Dirección</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {DIRECCION}
                </p>
                <Button asChild size="sm" variant="outline" className="mt-3 gap-2">
                  <a href={MAPS_LINK_URL} target="_blank" rel="noopener noreferrer">
                    <Navigation className="size-4" /> Cómo llegar
                  </a>
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-accent/15 text-accent">
                <Clock className="size-5" />
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-lg font-semibold">Horario</h2>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li className="flex justify-between gap-3">
                    <span>Lunes a Jueves</span>
                    <span>13:00 – 22:00</span>
                  </li>
                  <li className="flex justify-between gap-3">
                    <span>Viernes y Sábados</span>
                    <span>13:00 – 23:30</span>
                  </li>
                  <li className="flex justify-between gap-3">
                    <span>Domingo</span>
                    <span>13:00 – 19:00</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-secondary/30 text-secondary-foreground">
                <Phone className="size-5" />
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-lg font-semibold">Teléfono</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Reservaciones y pedidos para llevar
                </p>
                <a
                  href={`tel:${TELEFONO_HREF}`}
                  className="mt-2 inline-block font-medium text-primary hover:underline"
                >
                  {TELEFONO_DISPLAY}
                </a>
              </div>
            </div>
          </Card>
        </MotionDiv>
      </div>

      <Separator className="my-10" />

      {/* How to arrive */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            icon: <Car className="size-5" />,
            title: "En auto",
            text: "Estacionamiento gratuito en la calle Agricultura. A 5 minutos del centro histórico.",
          },
          {
            icon: <Navigation className="size-5" />,
            title: "Transporte público",
            text: "Rutas 4 y 7 pasan por la Av. Agricultura. Pídenos bajar en la esquina de la plaza.",
          },
          {
            icon: <Phone className="size-5" />,
            title: "Pedidos a domicilio",
            text: "Llámanos o arma tu pedido en la web. Entregamos en Delicias y alrededores.",
          },
        ].map((item, i) => (
          <MotionDiv
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="flex h-full flex-col gap-2 p-5">
              <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                {item.icon}
              </div>
              <h3 className="font-serif text-base font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                {item.text}
              </p>
            </Card>
          </MotionDiv>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button asChild size="lg" className="gap-2">
          <Link href="/menu">Ver el menú completo</Link>
        </Button>
      </div>
    </section>
  );
}
