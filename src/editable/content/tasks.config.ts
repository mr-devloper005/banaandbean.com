import type { TaskKey } from "@/lib/site-config";

export const slot4TaskSupport = {
  article: false,
  classified: false,
  sbm: false,
  profile: false,
  pdf: true,
  listing: true,
  image: false,
} satisfies Record<TaskKey, boolean>;

export const slot4TaskNotes = {
  article: "Journal / long-form reads",
  classified: "Community marketplace postings",
  sbm: "Saved / bookmarked resources",
  profile: "People behind the listings",
  pdf: "Reference library — downloadable briefings",
  listing: "Local directory — verified places",
  image: "Gallery — visual feed",
} satisfies Record<TaskKey, string>;

/*
  Public-facing display labels used ANYWHERE the user sees a task name.

  These override SITE_CONFIG.tasks[].label without touching site.tasks.ts.
  Use `getTaskDisplayLabel(task.key)` in every editable component that
  otherwise reads task.label directly.
*/
export const slot4TaskDisplayLabels = {
  article: "Journal",
  classified: "Marketplace",
  sbm: "Saves",
  profile: "People",
  pdf: "Reference Library",
  listing: "Local Directory",
  image: "Gallery",
} satisfies Record<TaskKey, string>;

export const slot4TaskDisplayLabelsShort = {
  article: "Journal",
  classified: "Marketplace",
  sbm: "Saves",
  profile: "People",
  pdf: "Library",
  listing: "Directory",
  image: "Gallery",
} satisfies Record<TaskKey, string>;

export function getTaskDisplayLabel(
  key: TaskKey | string | undefined | null,
  fallback = "",
): string {
  if (!key) return fallback;
  const label = (slot4TaskDisplayLabels as Record<string, string>)[key];
  return label || fallback || String(key);
}

export function getTaskDisplayLabelShort(
  key: TaskKey | string | undefined | null,
  fallback = "",
): string {
  if (!key) return fallback;
  const label = (slot4TaskDisplayLabelsShort as Record<string, string>)[key];
  return label || fallback || String(key);
}
