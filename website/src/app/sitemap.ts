import type { MetadataRoute } from "next";
import { getAllJobs } from "@/lib/jobs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://example.com";

  const jobs = getAllJobs().map((job) => ({
    url: `${base}/jobs/${job.slug}`,
    lastModified: new Date(job.postedAt)
  }));

  return [{ url: `${base}/`, lastModified: new Date() }, ...jobs];
}

