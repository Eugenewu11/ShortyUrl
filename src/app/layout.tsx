import type { Metadata } from "next";
import "@/app/styles/globals.css"

export const metadata: Metadata = {
  title: "Acortador de Links",
  description: "Acorta tus enlaces de forma rápida y sencilla",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}