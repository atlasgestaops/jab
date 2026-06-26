import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar ou criar conta",
  description:
    "Área reservada para futuro cadastro/login de candidatos e empresas no portal Jovem Aprendiz Brasil.",
};

export default function AuthPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl2 border border-slate-200 bg-white p-4 shadow-soft">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          Cadastre-se / Login
        </h1>
        <p className="mt-1 text-sm text-slate-700">
          Esta área será usada no futuro para que você crie sua conta, salve vagas favoritas e acompanhe
          candidaturas.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          (MVP) Ainda não há autenticação. Você pode usar as páginas de conteúdo e a busca de vagas normalmente.
        </p>
      </section>
    </div>
  );
}

