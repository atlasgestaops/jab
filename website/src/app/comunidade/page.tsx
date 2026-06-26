import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comunidade Jovem Aprendiz",
  description:
    "Links para grupos de WhatsApp, Telegram e outros canais da comunidade Jovem Aprendiz Brasil.",
};

export default function ComunidadePage() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl2 border border-slate-200 bg-white p-4 shadow-soft">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          Grupos e comunidade
        </h1>
        <p className="mt-1 text-sm text-slate-700">
          Aqui você poderá acessar grupos de WhatsApp, Telegram e outros canais para tirar dúvidas,
          receber novas vagas e trocar experiências com outros jovens.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          (MVP) Adicione aqui, depois, os links reais dos grupos e regras de convivência.
        </p>
      </section>
    </div>
  );
}

