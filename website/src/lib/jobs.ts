import jobsData from "@/data/jobs.json";

export type Job = {
  id: string;
  slug: string;
  title: string;
  company: string;
  city: string;
  state: string;
  schedule: string;
  salary: string;
  postedAt: string;
  summary: string;
  description: string;
  requirements: string[];
  benefits: string[];
};

export type JobFilters = {
  q?: string;
  city?: string;
  state?: string;
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function getAllJobs(): Job[] {
  return (jobsData as Job[]).slice().sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}

export function getJobBySlug(slug: string): Job | undefined {
  return (jobsData as Job[]).find((j) => j.slug === slug);
}

export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  const q = filters.q?.trim() ? normalize(filters.q.trim()) : "";
  const city = filters.city?.trim() ? normalize(filters.city.trim()) : "";
  const state = filters.state?.trim() ? normalize(filters.state.trim()) : "";

  return jobs.filter((job) => {
    if (city && normalize(job.city) !== city) return false;
    if (state && normalize(job.state) !== state) return false;
    if (!q) return true;

    const hay = normalize(
      [job.title, job.company, job.city, job.state, job.summary, job.schedule, job.salary].join(" ")
    );
    return hay.includes(q);
  });
}

export function getFilterOptions(jobs: Job[]) {
  const states = Array.from(new Set(jobs.map((j) => j.state))).sort((a, b) => a.localeCompare(b));
  const cities = Array.from(new Set(jobs.map((j) => j.city))).sort((a, b) => a.localeCompare(b));
  return { states, cities };
}

