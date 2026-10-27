"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DishCard } from "@/components/site/dish-card";
import type { Platillo } from "@/lib/types";

interface MenuTabsProps {
  platillos: Platillo[];
  categorias: { value: string; label: string }[];
  initialTab: string;
}

export function MenuTabs({
  platillos,
  categorias,
  initialTab,
}: MenuTabsProps) {
  const [tab, setTab] = useState(initialTab);

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <div className="overflow-x-auto scrollbar-thin">
        <TabsList className="mb-6 inline-flex w-max gap-1 rounded-full bg-muted/60 p-1">
          {categorias.map((c) => (
            <TabsTrigger
              key={c.value}
              value={c.value}
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {categorias.map((c) => {
        const items = platillos.filter((p) => p.categoria === c.value);
        return (
          <TabsContent key={c.value} value={c.value} className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={c.value + tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {items.length === 0 ? (
                  <div className="grid place-items-center rounded-lg border border-dashed border-border p-12 text-center">
                    <p className="text-muted-foreground">
                      No hay platillos en esta categoría.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((p, i) => (
                      <DishCard key={p.id} platillo={p} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
