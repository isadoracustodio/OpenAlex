import type { OpenAlexWork } from "../types/openalex.js";

export function toWorkData(w: OpenAlexWork) {
  return {
    doi: w.doi ?? null,
    title: w.title ?? null,
    year: w.publication_year ?? null,
    type: w.type ?? null,
    language: w.language ?? null,
    sourceName: w.primary_location?.source?.display_name ?? null,
    oaStatus: w.open_access?.oa_status ?? null,
    citations: w.cited_by_count ?? 0,
    topic: w.primary_topic?.display_name ?? null,
    isXpac: w.is_xpac ?? false,
  };
}