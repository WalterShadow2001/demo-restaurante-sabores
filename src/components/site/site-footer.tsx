import Link from "next/link";
import { Clock, MapPin, Phone, Instagram, Facebook } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                S
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-lg font-bold">Sabores de Delicias</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Cocina Mexicana · Delicias, Chihuahua
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground text-pretty">
              Recetas tradicionales de la cocina mexicana, hechas en casa con
              ingredientes frescos y mucho cariño. Visítanos y sorpréndete con
              los sabores de México.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid size-9 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid size-9 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary"
              >
                <Facebook className="size-4" />
              </a>
            </div>
          </div>

          {/* Horario */}
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider">
              Horario
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Lun–Jue: 13:00 – 22:00</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Vie–Sáb: 13:00 – 23:30</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Domingo: 13:00 – 19:00</span>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider">
              Contacto
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Av. Agricultura 245, Centro<br />Delicias, Chihuahua</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href="tel:+526394728100" className="hover:text-primary transition-colors">
                  +52 639 472 8100
                </a>
              </li>
            </ul>
            <Link
              href="/ubicacion"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              Cómo llegar →
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Sabores de Delicias. Todos los derechos reservados.</p>
          <div className="flex items-center gap-3">
            <Link href="/admin/login" className="hover:text-primary transition-colors">
              Acceso administradores
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
