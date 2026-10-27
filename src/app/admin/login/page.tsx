"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      toast.error("Escribe la contraseña");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo iniciar sesión");
      }
      toast.success("Sesión iniciada", {
        description: "Bienvenido al panel de administración.",
      });
      router.push("/admin");
      router.refresh();
    } catch (e: any) {
      toast.error("No se pudo iniciar sesión", {
        description: e.message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-4">
        <div className="h-64 w-full max-w-md animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/70">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="size-6" />
            </div>
            <CardTitle className="font-serif text-2xl">Acceso administrador</CardTitle>
            <CardDescription className="text-pretty">
              Inicia sesión para gestionar platillos, pedidos y reseñas de
              Sabores de Delicias.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative mt-1">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Escribe tu contraseña"
                    autoComplete="current-password"
                    className="pl-9"
                    autoFocus
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Entrando...
                  </>
                ) : (
                  <>Iniciar sesión</>
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link href="/">
                  <ArrowLeft className="size-4" /> Volver al sitio
                </Link>
              </Button>
            </div>
            <p className="mt-4 rounded-md bg-muted/50 px-3 py-2 text-center text-xs text-muted-foreground">
              Demo · Contraseña: <code className="font-mono font-semibold text-foreground">admin123</code>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
