import type { CSSProperties } from 'react'

/*
  Montera-inspired design contract.

  Warm-neutral canvas (#f6f6f6) + deep ink (#0c0c0c) + electric-blue #2670ff
  primary accent + neon-pear #d0ff52 secondary accent. Pill buttons with
  trailing arrow-chip. Big rounded cards (1.5–2rem). Inter Tight display,
  Inter body. Every downstream component consumes tokens through these vars.
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#f6f6f6',
  '--slot4-page-text': '#0c0c0c',
  '--slot4-panel-bg': '#ffffff',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#65585b',
  '--slot4-soft-muted-text': '#86868b',
  '--slot4-accent': '#2670ff',
  '--slot4-accent-fill': '#2670ff',
  '--slot4-accent-soft': '#e6efff',
  '--slot4-accent-secondary': '#d0ff52',
  '--slot4-accent-secondary-soft': '#eafbb8',
  '--slot4-on-accent': '#ffffff',
  '--slot4-on-secondary': '#0c0c0c',
  '--slot4-dark-bg': '#0c0c0c',
  '--slot4-dark-text': '#ffffff',
  '--slot4-dark-muted': 'rgba(255,255,255,0.62)',
  '--slot4-media-bg': '#ececec',
  '--slot4-cream': '#f6f6f6',
  '--slot4-warm': '#f0f0ef',
  '--slot4-lavender': '#eaf1ff',
  '--slot4-gray': '#f6f6f6',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#f6f6f6',
  '--editable-page-text': '#0c0c0c',
  '--editable-container': '1360px',
  '--editable-border': 'rgba(12,12,12,0.10)',
  '--editable-border-strong': 'rgba(12,12,12,0.18)',
  '--editable-border-dark': 'rgba(255,255,255,0.12)',
  '--editable-nav-bg': 'rgba(246,246,246,0.82)',
  '--editable-nav-text': '#0c0c0c',
  '--editable-nav-active': '#2670ff',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#0c0c0c',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#0c0c0c',
  '--editable-footer-text': '#ffffff',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  secondaryBg: 'bg-[var(--slot4-accent-secondary)]',
  secondarySoftBg: 'bg-[var(--slot4-accent-secondary-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  onSecondaryText: 'text-[var(--slot4-on-secondary)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  darkMuted: 'text-[var(--slot4-dark-muted)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  borderStrong: 'border-[var(--editable-border-strong)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_1px_2px_rgba(12,12,12,0.06)]',
  shadowSoft: 'shadow-[0_16px_40px_-24px_rgba(12,12,12,0.18)]',
  shadowStrong: 'shadow-[0_24px_60px_-28px_rgba(12,12,12,0.28)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(12,12,12,0.02),rgba(12,12,12,0.75))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[85rem] px-5 sm:px-8 lg:px-10',
    sectionY: 'py-16 md:py-24 lg:py-32',
    sectionYSm: 'py-12 md:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[220px] shrink-0 snap-start sm:w-[260px]',
  },
  type: {
    eyebrow:
      'inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-page-text)]/70',
    heroTitle:
      'editable-display-tight text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[3.25rem] lg:text-[4.75rem] lg:leading-[1.0] lg:tracking-[-0.075em]',
    sectionTitle:
      'editable-display text-[2.125rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[3rem] lg:text-[3.5rem] lg:tracking-[-0.045em]',
    subTitle:
      'editable-display text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[1.875rem] lg:text-[2.125rem]',
    body: 'text-[1rem] leading-[1.55] sm:text-[1.125rem] sm:leading-[1.55]',
    emphasis:
      'text-[1.125rem] leading-[1.5] font-medium tracking-[-0.02em] sm:text-[1.25rem]',
    label:
      'text-[0.8125rem] font-medium tracking-[-0.005em] text-[var(--slot4-muted-text)]',
  },
  surface: {
    card: `rounded-[1.5rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadowSoft}`,
    soft: `rounded-[1.5rem] border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-[1.5rem] ${editablePalette.darkBg} ${editablePalette.darkText}`,
    darkBig: `rounded-[2rem] ${editablePalette.darkBg} ${editablePalette.darkText}`,
    accentPanel: `rounded-[2rem] ${editablePalette.secondaryBg} ${editablePalette.onSecondaryText}`,
  },
  badge: {
    pill:
      'inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-page-text)]',
    accentPill:
      'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-secondary)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-on-secondary)]',
    ink:
      'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white',
  },
  button: {
    primary:
      'group inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] pl-6 pr-2 py-2 text-[0.9375rem] font-medium tracking-[-0.01em] text-white transition duration-300 hover:bg-[var(--slot4-accent)] hover:pl-7 active:scale-[0.98]',
    secondary:
      'group inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] pl-6 pr-2 py-2 text-[0.9375rem] font-medium tracking-[-0.01em] text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white active:scale-[0.98]',
    accent:
      'group inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-secondary)] pl-6 pr-2 py-2 text-[0.9375rem] font-medium tracking-[-0.01em] text-[var(--slot4-on-secondary)] transition duration-300 hover:bg-[var(--slot4-accent)] hover:text-white active:scale-[0.98]',
    ghost:
      'group inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.9375rem] font-medium tracking-[-0.01em] text-[var(--slot4-page-text)] transition duration-300 hover:bg-[var(--slot4-page-text)]/6 active:scale-[0.98]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.25rem] ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden rounded-[2rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[16/10]',
    ratioPortrait: 'aspect-[3/4]',
    ratioSquare: 'aspect-square',
    ratioWide: 'aspect-[21/9]',
  },
  motion: {
    lift:
      'transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(12,12,12,0.32)]',
    fade: 'transition duration-500 hover:opacity-85',
    zoom: '[&_img]:transition-transform [&_img]:duration-[900ms] hover:[&_img]:scale-[1.04]',
  },
} as const

export const aiLayoutRules = [
  'Change the site color palette in editableRootStyle first; all sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so the whole home experience can be redesigned in one file.',
  'Use wide readable grids anchored to max-w-[85rem]; never make columns skinnier than 260px.',
  'Use rounded pill buttons with a trailing arrow-chip (dc.button.*).',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
