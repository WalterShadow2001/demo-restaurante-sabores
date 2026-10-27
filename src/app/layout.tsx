import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { CartProvider } from "@/components/site/cart-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Sabores de Delicias | Restaurante Mexicano en Delicias, Chihuahua",
  description:
    "Auténtica comida mexicana en Delicias, Chihuahua. Tacos al pastor, mole poblano, cochinita pibil y más. Hecho en casa con ingredientes frescos.",
  keywords: [
    "restaurante mexicano",
    "Delicias Chihuahua",
    "comida mexicana",
    "tacos al pastor",
    "mole",
    "Sabores de Delicias",
  ],
  authors: [{ name: "Sabores de Delicias" }],
  openGraph: {
    title: "Sabores de Delicias",
    description:
      "Auténtica comida mexicana en Delicias, Chihuahua. Hecho en casa.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <CartProvider>
          <SiteHeader />
          <main className="flex-1 flex flex-col">{children}</main>
          <SiteFooter />
          <SonnerToaster
            position="top-center"
            richColors
            toastOptions={{
              classNames: {
                toast: "font-sans",
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
