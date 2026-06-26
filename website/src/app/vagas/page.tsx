import type { Metadata } from "next";
import { AdBanner } from "@/components/AdBanner";
import { JobsClient } from "@/components/JobsClient";
import { getAllJobs, getFilterOptions } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Buscar vagas de Jovem Aprendiz",
  description:
    "Busque vagas de Jovem Aprendiz em diferentes cidades e estados. Veja detalhes, benefícios e requisitos.",
};

export default function JobsPage() {
  const jobs = getAllJobs();
  const { cities, states } = getFilterOptions(jobs);

  return (
    <div className="space-y-4">
      <section className="rounded-xl2 border border-slate-200 bg-white p-4 shadow-soft">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">Buscar vagas</h1>
        <p className="mt-1 text-sm text-slate-600">
          Encontre vagas de Jovem Aprendiz em diferentes áreas e regiões. Use a busca e os filtros para refinar.
        </p>
      </section>

      <AdBanner />

      <JobsClient jobs={jobs} cities={cities} states={states} />
    </div>
  );
}

