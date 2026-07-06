import Link from 'next/link'
import { ArrowUpRight, Search, Sparkles, MapPin, Download, Layers, BadgeCheck, Users } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getTaskDisplayLabel } from '@/editable/content/tasks.config'
import { getEditableExcerpt, getEditableCategory, getEditablePostImage, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[85rem] px-5 sm:px-8 lg:px-10'

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function latestImages(posts: SitePost[], max = 6) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

/* ------------------------------- HERO ------------------------------- */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const hero = pagesContent.home.hero
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImages = latestImages(pool, 3)
  const [firstTitle, secondTitle] = hero.title || ['', '']

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)]">
      {/* Colored blob backdrop, upper right. */}
      <div className="pointer-events-none absolute -right-40 top-20 h-[560px] w-[560px] rounded-full bg-[var(--slot4-accent-secondary)] opacity-70 blur-[140px]" aria-hidden />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[var(--slot4-accent)] opacity-15 blur-[140px]" aria-hidden />

      <div className={`relative ${container} pt-14 pb-16 lg:pt-24 lg:pb-28`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16">
          {/* Left column — copy + CTAs */}
          <EditableReveal index={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" />
              {hero.badge}
            </span>
            <h1 className="editable-display-tight mt-6 text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[3.5rem] lg:text-[4.75rem] lg:leading-[1.0] lg:tracking-[-0.075em]">
              {firstTitle}
              <br />
              <span className="text-[var(--slot4-accent)]">{secondTitle}</span>
            </h1>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.55] text-[var(--slot4-muted-text)] sm:text-[1.125rem]">
              {hero.description}
            </p>

            <form action="/search" className="mt-8 flex w-full max-w-xl overflow-hidden rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] p-1.5">
              <div className="flex flex-1 items-center gap-2 px-4">
                <Search className="h-4 w-4 shrink-0 text-[var(--slot4-muted-text)]" />
                <input
                  name="q"
                  placeholder={hero.searchPlaceholder || 'Search places, references, categories…'}
                  className="w-full bg-transparent py-2.5 text-[0.9375rem] text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]"
                />
              </div>
              <button className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] pl-5 pr-2 text-[0.9375rem] font-medium text-white transition duration-300 hover:bg-[var(--slot4-accent)]">
                Search
                <span className="editable-arrow-chip bg-white text-[var(--slot4-page-text)]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            </form>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={hero.primaryCta?.href || primaryRoute}
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-secondary)] pl-6 pr-2 py-2 text-[1rem] font-medium text-[var(--slot4-on-secondary)] transition duration-300 hover:bg-[var(--slot4-accent)] hover:text-white"
              >
                {hero.primaryCta?.label || 'Browse the Local Directory'}
                <span className="editable-arrow-chip bg-[var(--slot4-dark-bg)] text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
              <Link
                href={hero.secondaryCta?.href || '/pdf'}
                className="group inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] pl-6 pr-2 py-2 text-[1rem] font-medium text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white"
              >
                {hero.secondaryCta?.label || 'Open the Reference Library'}
                <span className="editable-arrow-chip bg-[var(--slot4-page-text)] text-white group-hover:bg-white group-hover:text-[var(--slot4-page-text)]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </EditableReveal>

          {/* Right column — layered image card */}
          <EditableReveal index={1}>
            <div className="relative">
              <div className="relative aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-[2rem] bg-[var(--slot4-media-bg)] ml-auto">
                {heroImages[0] ? (
                  <img
                    src={heroImages[0]}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#2670ff,#0c0c0c)]">
                    <Sparkles className="h-16 w-16 text-white/60" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 rounded-[1.25rem] bg-white/90 p-4 backdrop-blur-md">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]">Fresh this week</p>
                  <p className="mt-1 line-clamp-1 text-[0.9375rem] font-semibold text-[var(--slot4-page-text)]">
                    {pool[0]?.title || 'Community-first discovery'}
                  </p>
                </div>
              </div>

              {heroImages[1] ? (
                <div className="absolute -bottom-8 -left-6 hidden aspect-[4/3] w-56 overflow-hidden rounded-[1.5rem] border-4 border-[var(--slot4-page-bg)] shadow-[0_24px_60px_-28px_rgba(12,12,12,0.35)] sm:block">
                  <img src={heroImages[1]} alt="" className="h-full w-full object-cover" />
                </div>
              ) : null}
            </div>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* ---------------------- TRUST / STAT BAND (neon-pear) ---------------------- */
export function EditableStoryRail({ posts, timeSections }: HomeSectionProps) {
  const total = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).length
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled).length

  const stats = [
    { icon: Layers, label: 'Entries in the surface', value: `${Math.max(total, 24)}+` },
    { icon: BadgeCheck, label: 'Reviewed before publish', value: '100%' },
    { icon: MapPin, label: 'Neighbourhoods covered', value: `${Math.max(categories * 3, 12)}` },
    { icon: Download, label: 'Free to keep', value: 'Always' },
  ]

  return (
    <section className="relative">
      <div className={`${container} py-16 md:py-24`}>
        <EditableReveal index={0}>
          <div className="rounded-[2rem] bg-[var(--slot4-accent-secondary)] p-10 sm:p-14 lg:p-16">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <span className="editable-eyebrow text-[var(--slot4-on-secondary)]/70">By the numbers</span>
                <h2 className="editable-display-tight mt-4 text-[2rem] font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--slot4-on-secondary)] sm:text-[2.75rem] lg:text-[3.5rem]">
                  A neighbourhood surface, not an algorithm feed.
                </h2>
              </div>
              <p className="text-[1.0625rem] leading-[1.55] text-[var(--slot4-on-secondary)]/80 sm:text-[1.125rem]">
                Every listing is reviewed. Every reference file is free to keep. The numbers below move only as fast as we can vouch for them.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map(({ icon: Icon, label, value }, i) => (
                <EditableReveal key={label} index={i + 1}>
                  <div className="rounded-[1.5rem] border border-[var(--slot4-on-secondary)]/15 bg-[var(--slot4-on-secondary)] p-6 text-white">
                    <Icon className="h-6 w-6 text-[var(--slot4-accent-secondary)]" />
                    <p className="editable-display-tight mt-6 text-[2.5rem] font-semibold leading-[1] tracking-[-0.03em]">{value}</p>
                    <p className="mt-2 text-[0.875rem] text-white/60">{label}</p>
                  </div>
                </EditableReveal>
              ))}
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

/* ---------------------- FEATURE / DIRECTORY-LIBRARY SPLIT ---------------------- */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const all = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const featured = all[0]
  const supporting = all.slice(1, 5)

  if (!featured) return null
  const featuredHref = postHref(primaryTask, featured, primaryRoute)
  const featuredImage = getEditablePostImage(featured)

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-16 md:py-24 lg:py-28`}>
        <EditableReveal index={0}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="editable-eyebrow text-[var(--slot4-muted-text)]">In focus</span>
              <h2 className="editable-display-tight mt-4 text-[2.125rem] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-[2.75rem] lg:text-[3.25rem]">
                One editorial pick, four fresh entries alongside.
              </h2>
            </div>
            <Link
              href={primaryRoute}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] pl-5 pr-1.5 py-1.5 text-[0.9375rem] font-medium text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)]"
            >
              See all {getTaskDisplayLabel(primaryTask, 'entries').toLowerCase()}
              <span className="editable-arrow-chip bg-[var(--slot4-dark-bg)] text-white h-8 w-8">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </EditableReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Featured tile */}
          <EditableReveal index={1}>
            <Link
              href={featuredHref}
              className="group relative block overflow-hidden rounded-[2rem] bg-[var(--slot4-dark-bg)] text-white"
            >
              <div className="relative aspect-[16/11]">
                <img
                  src={featuredImage}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-[900ms] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,12,12,0)_35%,rgba(12,12,12,0.85))]" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-accent-secondary)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-on-secondary)]">
                    Editor's pick
                  </span>
                  <h3 className="editable-display-tight mt-5 max-w-2xl text-[1.875rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[2.5rem] lg:text-[3rem]">
                    {featured.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-[0.9375rem] text-white/70 sm:text-[1rem]">
                    {getEditableExcerpt(featured, 170)}
                  </p>
                </div>
              </div>
            </Link>
          </EditableReveal>

          {/* Supporting stack */}
          <div className="grid gap-4">
            {supporting.map((post, i) => (
              <EditableReveal key={post.id || post.slug} index={i + 2}>
                <Link
                  href={postHref(primaryTask, post, primaryRoute)}
                  className="group grid grid-cols-[100px_minmax(0,1fr)] gap-4 rounded-[1.25rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-3 transition duration-500 hover:-translate-y-[2px] hover:shadow-[0_16px_36px_-24px_rgba(12,12,12,0.2)]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-[var(--slot4-media-bg)]">
                    <img
                      src={getEditablePostImage(post)}
                      alt={post.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="min-w-0 py-2 pr-2">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
                      {getEditableCategory(post)}
                    </p>
                    <h4 className="editable-display mt-1.5 line-clamp-2 text-[1rem] font-semibold leading-[1.25] tracking-[-0.02em]">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              </EditableReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------- TIME COLLECTIONS (alternating panels) ------------------- */
const sectionCopy: Record<string, { eyebrow: string; title: string; note: string }> = {
  spotlight: { eyebrow: 'Fresh this week', title: 'New in the last 7 days', note: 'The most recent entries across the surface.' },
  browse: { eyebrow: 'Trending', title: 'Popular this month', note: 'What the community keeps opening.' },
  index: { eyebrow: 'Evergreen', title: 'From the archive', note: 'Older entries that hold up over time.' },
}

function GridCard({ post, href, i }: { post: SitePost; href: string; i: number }) {
  return (
    <EditableReveal index={i}>
      <Link
        href={href}
        className="group block overflow-hidden rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-[3px] hover:shadow-[0_20px_44px_-24px_rgba(12,12,12,0.22)]"
      >
        <div className="relative m-3 aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-[var(--slot4-media-bg)]">
          <img
            src={getEditablePostImage(post)}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-page-text)]">
            {getEditableCategory(post)}
          </span>
        </div>
        <div className="px-5 pb-6 pt-1">
          <h3 className="editable-display line-clamp-2 text-[1.125rem] font-semibold leading-[1.25] tracking-[-0.025em]">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-[0.875rem] leading-[1.55] text-[var(--slot4-muted-text)]">
            {getEditableExcerpt(post, 120)}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-[var(--slot4-accent)]">
            Read <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </EditableReveal>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, sIndex) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore', note: '' }
        const isDark = sIndex % 2 === 1
        return (
          <section
            key={section.key}
            className={isDark ? 'bg-[var(--slot4-dark-bg)] text-white' : 'bg-[var(--slot4-page-bg)]'}
          >
            <div className={`${container} py-16 md:py-24 lg:py-28`}>
              <EditableReveal index={0}>
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div className="max-w-2xl">
                    <span
                      className={`editable-eyebrow ${isDark ? 'text-white/60' : 'text-[var(--slot4-muted-text)]'}`}
                    >
                      {copy.eyebrow}
                    </span>
                    <h2 className="editable-display-tight mt-4 text-[2rem] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-[2.75rem] lg:text-[3.25rem]">
                      {copy.title}
                    </h2>
                    {copy.note ? (
                      <p className={`mt-3 text-[1rem] ${isDark ? 'text-white/70' : 'text-[var(--slot4-muted-text)]'}`}>
                        {copy.note}
                      </p>
                    ) : null}
                  </div>
                  <Link
                    href={section.href || primaryRoute}
                    className={`group inline-flex items-center gap-2 rounded-full pl-5 pr-1.5 py-1.5 text-[0.9375rem] font-medium transition duration-300 ${
                      isDark
                        ? 'border border-white/20 text-white hover:border-white'
                        : 'border border-[var(--editable-border-strong)] text-[var(--slot4-page-text)] hover:border-[var(--slot4-page-text)]'
                    }`}
                  >
                    View all
                    <span
                      className={`editable-arrow-chip h-8 w-8 ${
                        isDark ? 'bg-white text-[var(--slot4-page-text)]' : 'bg-[var(--slot4-dark-bg)] text-white'
                      }`}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </EditableReveal>

              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, i) => (
                  <GridCard
                    key={post.id || post.slug}
                    post={post}
                    href={postHref(primaryTask, post, primaryRoute)}
                    i={i + 1}
                  />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* --------------------------- BENEFITS / PROCESS --------------------------- */
export function EditableHomeProcess() {
  const steps = [
    {
      number: '01',
      title: 'Search the directory or the library',
      body: 'One field spans both surfaces. Filter by category, neighbourhood or file format — verified entries surface first.',
    },
    {
      number: '02',
      title: 'Open the record or the file',
      body: 'Directory records carry hours, contact and a map. Library files carry a live preview, page count and file size.',
    },
    {
      number: '03',
      title: 'Keep what you found',
      body: 'Bookmark the record. Download the file. Both stay free — no account required, no watermark, no expiring links.',
    },
  ]
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-16 md:py-24 lg:py-28`}>
        <EditableReveal index={0}>
          <div className="max-w-3xl">
            <span className="editable-eyebrow text-[var(--slot4-muted-text)]">How it works</span>
            <h2 className="editable-display-tight mt-4 text-[2rem] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-[2.75rem] lg:text-[3.25rem]">
              Three quiet steps between arriving and leaving with something useful.
            </h2>
          </div>
        </EditableReveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {steps.map((step, i) => (
            <EditableReveal key={step.number} index={i + 1}>
              <div className="group flex h-full flex-col justify-between rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_54px_-28px_rgba(12,12,12,0.22)]">
                <span className="editable-display-tight text-[3rem] font-semibold leading-none tracking-[-0.06em] text-[var(--slot4-accent)]">
                  {step.number}
                </span>
                <div className="mt-14">
                  <h3 className="editable-display text-[1.25rem] font-semibold leading-[1.25] tracking-[-0.025em]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-[1.55] text-[var(--slot4-muted-text)]">{step.body}</p>
                </div>
              </div>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------- BENEFIT GRID (icon cards) --------------------- */
export function EditableHomeBenefits() {
  const items = [
    { icon: BadgeCheck, title: 'Verified over volume', body: '40 real records beat 400 auto-imports every time.' },
    { icon: Download, title: 'Free to keep', body: 'Every reference file downloadable, uncrippled and yours.' },
    { icon: MapPin, title: 'Local first', body: 'Built for the neighbourhood, not the algorithm.' },
    { icon: Users, title: 'Community-submitted', body: 'Add a place or file a briefing — we review before publishing.' },
  ]
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${container} pb-16 md:pb-24 lg:pb-28`}>
        <EditableReveal index={0}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="editable-eyebrow text-[var(--slot4-muted-text)]">Why this exists</span>
              <h2 className="editable-display-tight mt-4 text-[2rem] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-[2.75rem]">
                A quieter alternative to the noisier feeds.
              </h2>
            </div>
          </div>
        </EditableReveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, body }, i) => (
            <EditableReveal key={title} index={i + 1}>
              <div className="flex h-full flex-col gap-4 rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 transition duration-500 hover:-translate-y-[3px] hover:shadow-[0_20px_44px_-24px_rgba(12,12,12,0.22)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="editable-display text-[1.125rem] font-semibold tracking-[-0.02em]">{title}</h3>
                <p className="text-[0.9375rem] leading-[1.55] text-[var(--slot4-muted-text)]">{body}</p>
              </div>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- CTA BAND ----------------------------- */
export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${container} pb-20 md:pb-28`}>
        <EditableReveal index={0}>
          <div className="relative overflow-hidden rounded-[2rem] bg-[var(--slot4-dark-bg)] p-10 sm:p-14 lg:p-20">
            <div className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-[var(--slot4-accent-secondary)] opacity-30 blur-[110px]" aria-hidden />
            <div className="pointer-events-none absolute -left-24 bottom-0 h-[280px] w-[280px] rounded-full bg-[var(--slot4-accent)] opacity-25 blur-[110px]" aria-hidden />
            <div className="relative">
              <span className="editable-eyebrow text-white/60">{cta.badge}</span>
              <h2 className="editable-display-tight mt-4 max-w-3xl text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-[3rem] lg:text-[3.75rem] lg:leading-[1.0]">
                {cta.title}
              </h2>
              <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.55] text-white/70 sm:text-[1.125rem]">
                {cta.description}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href={cta.primaryCta.href}
                  className="group inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-secondary)] pl-6 pr-2 py-2 text-[1rem] font-medium text-[var(--slot4-on-secondary)] transition duration-300 hover:bg-white"
                >
                  {cta.primaryCta.label}
                  <span className="editable-arrow-chip bg-[var(--slot4-dark-bg)] text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
                <Link
                  href={cta.secondaryCta.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/25 pl-6 pr-2 py-2 text-[1rem] font-medium text-white transition duration-300 hover:border-white hover:bg-white/5"
                >
                  {cta.secondaryCta.label}
                  <span className="editable-arrow-chip bg-white text-[var(--slot4-dark-bg)]">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}
