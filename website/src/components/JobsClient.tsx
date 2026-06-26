"use client";

import { useMemo, useState } from "react";
import type { Job } from "@/lib/jobs";
import { filterJobs } from "@/lib/jobs";
import { JobCard } from "@/components/JobCard";
import { SearchBar } from "@/components/SearchBar";

type JobsClientProps = {
  jobs: Job[];
  cities: string[];
  states: string[];
};

export function JobsClient({ jobs, cities, states }: JobsClientProps) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const visible = useMemo(
    () => filterJobs(jobs, { q: query, city: city || undefined, state: state || undefined }),
    [jobs, query, city, state]
  );

  return (
    <div className="space-y-4">
      <SearchBar
        query={query}
        city={city}
        state={state}
        cities={cities}
        states={states}
        onChange={(next) => {
          if (typeof next.query === "string") setQuery(next.query);
          if (typeof next.city === "string") setCity(next.city);
          if (typeof next.state === "string") setState(next.state);
        }}
      />

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          <span className="font-medium text-slate-700">{visible.length}</span> vaga(s) encontrada(s)
        </div>
        <div className="text-[11px] text-slate-400">MVP • dados mock</div>
      </div>

      <div className="grid gap-3">
        {visible.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

