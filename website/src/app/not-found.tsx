import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl2 border border-slate-200 bg-white p-4 shadow-soft">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">Vaga não encontrada</h1>
        <p className="mt-1 text-sm text-slate-600">O link pode estar incorreto ou a vaga foi removida.</p>
        <Link
          href="/"
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
        >
          Voltar para a Home
        </Link>
      </section>
    </div>
  );
}

