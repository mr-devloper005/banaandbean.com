import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  One shared visual language for every task surface — Montera-inspired.

  Warm-neutral canvas, deep ink, electric blue accent + neon-pear secondary,
  large rounded surfaces. Only the eyebrow copy varies per task so each
  section keeps a small voice. Visual tokens are delivered via CSS vars
  (--tk-*) plus per-task font overrides for the display face.
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY = "'Inter Tight', 'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
const BODY = "'Inter', 'Inter Tight', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Shared Montera palette — every task inherits this; only kicker/note differ.
const base = {
  dark: false,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#f6f6f6',
  surface: '#ffffff',
  raised: '#f0f0ef',
  text: '#0c0c0c',
  muted: '#65585b',
  line: 'rgba(12,12,12,0.10)',
  accent: '#2670ff',
  accentSoft: '#e6efff',
  onAccent: '#ffffff',
  glow: 'rgba(38,112,255,0.08)',
  radius: '1.5rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: {
    ...base,
    kicker: 'Journal',
    note: 'Long-form reads, briefings and neighbourhood stories worth your time.',
  },
  listing: {
    ...base,
    kicker: 'Local Directory',
    note: 'Discover, compare and connect with the businesses shaping your neighbourhood.',
  },
  classified: {
    ...base,
    kicker: 'Marketplace',
    note: 'Fresh, community-posted offers moving in and out of town every day.',
  },
  image: {
    ...base,
    kicker: 'Gallery',
    note: 'A visual feed of places, moments and finds from around the community.',
  },
  sbm: {
    ...base,
    kicker: 'Saves',
    note: 'Curated resources and links the community keeps coming back to.',
  },
  pdf: {
    ...base,
    kicker: 'Reference Library',
    note: 'Downloadable guides, briefings and reference material — free to keep.',
  },
  profile: {
    ...base,
    kicker: 'People',
    note: 'Meet the operators, makers and community voices behind the listings.',
  },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
