import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllJobs, getJobBySlug } from "@/lib/jobs";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getAllJobs().map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  const job = getJobBySlug(slug);
  if (!job) return { title: "Vaga não encontrada" };

  const title = `${job.title} em ${job.city} - ${job.state}`;
  const description = `${job.company} • ${job.schedule} • ${job.salary}. Veja requisitos e candidate-se.`;

  return { title, description };
}

export default function JobDetailsPage({ params }: PageProps) {
  const { slug } = params;
  const job = getJobBySlug(slug);
  if (!job) notFound();

  return (
    <div className="space-y-4">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
        <span aria-hidden>←</span> Voltar para vagas
      </Link>

      <section className="rounded-xl2 border border-slate-200 bg-white p-4 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">{job.title}</h1>
            <p className="mt-1 text-sm text-slate-600">{job.company}</p>
          </div>
          <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
            {job.city} • {job.state}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="text-[11px] font-medium text-slate-500">Horário</div>
            <div className="mt-0.5 font-semibold text-slate-800">{job.schedule}</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="text-[11px] font-medium text-slate-500">Salário</div>
            <div className="mt-0.5 font-semibold text-slate-800">{job.salary}</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-[11px] font-medium text-slate-500">Resumo</div>
          <p className="mt-1 text-sm text-slate-700">{job.summary}</p>
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
        >
          Candidatar-se
        </button>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          (MVP) Botão placeholder para integração futura com formulário/CMS.
        </p>
      </section>

      <section className="rounded-xl2 border border-slate-200 bg-white p-4 shadow-soft">
        <h2 className="text-sm font-semibold text-slate-900">Descrição</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{job.description}</p>
      </section>

      <section className="rounded-xl2 border border-slate-200 bg-white p-4 shadow-soft">
        <h2 className="text-sm font-semibold text-slate-900">Requisitos</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
          {job.requirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl2 border border-slate-200 bg-white p-4 shadow-soft">
        <h2 className="text-sm font-semibold text-slate-900">Benefícios</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
          {job.benefits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

