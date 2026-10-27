"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function ResenaForm() {
  const router = useRouter();
  const [autor, setAutor] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!autor.trim()) {
      toast.error("Escribe tu nombre");
      return;
    }
    if (calificacion < 1 || calificacion > 5) {
      toast.error("Selecciona una calificación");
      return;
    }
    if (comentario.trim().length < 10) {
      toast.error("Tu comentario debe tener al menos 10 caracteres");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/resenas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          autor: autor.trim(),
          calificacion,
          comentario: comentario.trim(),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "No se pudo enviar tu reseña");
      }
      toast.success("¡Gracias por tu reseña!", {
        description: "La revisaremos antes de publicarla.",
      });
      setAutor("");
      setCalificacion(0);
      setComentario("");
      router.refresh();
    } catch (e: any) {
      toast.error("No se pudo enviar la reseña", {
        description: e.message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Deja tu reseña</CardTitle>
        <CardDescription className="text-pretty">
          Comparte tu experiencia. Tu reseña será revisada antes de
          publicarse para mantener un ambiente respetuoso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="autor">Tu nombre *</Label>
            <Input
              id="autor"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              placeholder="Ej. Ana Beltrán"
              maxLength={80}
              autoComplete="name"
              required
            />
          </div>

          <div>
            <Label>Tu calificación *</Label>
            <div className="mt-1.5 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCalificacion(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  className="rounded-full p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
                >
                  <Star
                    className={cn(
                      "size-8 transition-colors",
                      (hover || calificacion) >= n
                        ? "fill-secondary text-secondary"
                        : "fill-muted text-muted-foreground/40"
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {calificacion > 0
                  ? `${calificacion} de 5`
                  : "Toca una estrella"}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="comentario">Tu comentario *</Label>
            <Textarea
              id="comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Cuéntanos qué te gustó más de tu visita..."
              rows={4}
              maxLength={500}
              required
            />
            <p className="mt-1 text-right text-[11px] text-muted-foreground">
              {comentario.length}/500
            </p>
          </div>

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              size="lg"
              className="w-full gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <Send className="size-4" /> Enviar reseña
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}
