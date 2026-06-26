import type { Metadata } from "next";
import "@/styles/globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "Jovem Aprendiz Brasil — Vagas",
    template: "%s — Jovem Aprendiz Brasil"
  },
  description:
    "Encontre vagas de Jovem Aprendiz com layout leve e mobile-first. Busque por cidade e veja detalhes da vaga."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh text-slate-900 antialiased">
        <div className="mx-auto max-w-screen-sm px-4 pb-10">
          <Header />
          <main className="mt-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
