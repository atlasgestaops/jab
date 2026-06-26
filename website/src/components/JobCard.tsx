import Link from "next/link";
import type { Job } from "@/lib/jobs";

type JobCardProps = {
  job: Job;
};

export function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="block rounded-xl2 border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-[1px] hover:border-slate-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold tracking-tight text-slate-900">{job.title}</h3>
          <p className="mt-0.5 truncate text-xs text-slate-600">{job.company}</p>
        </div>
        <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
          {job.state}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div className="rounded-lg bg-slate-50 px-2 py-2">
          <div className="text-[11px] text-slate-500">Local</div>
          <div className="truncate font-medium text-slate-700">
            {job.city} • {job.state}
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 px-2 py-2">
          <div className="text-[11px] text-slate-500">Horário</div>
          <div className="truncate font-medium text-slate-700">{job.schedule}</div>
        </div>
        <div className="rounded-lg bg-slate-50 px-2 py-2">
          <div className="text-[11px] text-slate-500">Salário</div>
          <div className="truncate font-medium text-slate-700">{job.salary}</div>
        </div>
        <div className="rounded-lg bg-slate-50 px-2 py-2">
          <div className="text-[11px] text-slate-500">Publicado</div>
          <div className="truncate font-medium text-slate-700">
            {new Date(job.postedAt).toLocaleDateString("pt-BR")}
          </div>
        </div>
      </div>
    </Link>
  );
}
