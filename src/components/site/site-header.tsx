"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/menu", label: "Menú" },
  { href: "/resenas", label: "Reseñas" },
  { href: "/ubicacion", label: "Ubicación" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const count = useCartStore((s) => s.count());
  const setOpen = useCartStore((s) => s.setOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render header on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Sabores de Delicias inicio">
          <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground text-lg font-bold shadow-sm transition-transform group-hover:scale-105">
            S
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-serif text-base font-bold text-foreground">
              Sabores de Delicias
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Cocina Mexicana · Delicias
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                  active ? "text-primary" : "text-foreground/70"
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Ver carrito (${mounted ? count : 0} artículos)`}
            onClick={() => setOpen(true)}
          >
            <ShoppingBag className="size-5" />
            <AnimatePresence>
              {mounted && count > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -right-1 -top-1"
                >
                  <Badge className="size-5 justify-center rounded-full bg-accent p-0 text-[10px] font-bold text-accent-foreground">
                    {count > 99 ? "99+" : count}
                  </Badge>
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex">
            <Link href="/menu">Ver menú</Link>
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Abrir menú de navegación"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <div className="flex h-16 items-center justify-between border-b px-4">
                <span className="font-serif text-lg font-bold">Navegación</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Cerrar menú"
                >
                  <X className="size-5" />
                </Button>
              </div>
              <nav className="flex flex-col p-2" aria-label="Navegación móvil">
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-muted",
                        active ? "bg-primary/10 text-primary" : "text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
