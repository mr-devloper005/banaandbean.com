import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* -------------------------- EditorialFeatureCard --------------------------
   Full-bleed dark hero card used for the featured slot on home/archives. */
export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link
      href={href}
      className={`group relative block min-w-0 overflow-hidden ${dc.surface.darkBig} ${dc.motion.lift}`}
    >
      <div className="relative min-h-[520px] p-8 sm:p-10 lg:min-h-[640px]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-[900ms] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,12,12,0.15),rgba(12,12,12,0.88))]" />
        <div className="relative z-10 flex h-full min-h-[480px] flex-col justify-end lg:min-h-[580px]">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-accent-secondary)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-on-secondary)]">
            {label}
          </span>
          <h3 className="editable-display-tight mt-6 max-w-3xl text-[2.25rem] font-semibold leading-[1.0] tracking-[-0.05em] sm:text-[3rem] lg:text-[3.5rem]">
            {post.title}
          </h3>
          <p className="mt-5 max-w-2xl text-[1rem] leading-[1.55] text-white/75 sm:text-[1.125rem]">
            {getEditableExcerpt(post, 190)}
          </p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white pl-5 pr-2 py-2 text-[0.9375rem] font-medium text-[var(--slot4-page-text)]">
            Read more
            <span className="editable-arrow-chip bg-[var(--slot4-dark-bg)] text-white">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ------------------------------ RailPostCard ------------------------------
   Compact card for horizontal rails. */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}
    >
      <div className={`${dc.media.frame} ${dc.media.ratio} m-3 rounded-[1.25rem]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-page-text)]">
          No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="px-5 pb-5 pt-2">
        <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{getEditableCategory(post)}</p>
        <h3 className={`editable-display mt-3 line-clamp-3 text-[1.375rem] font-semibold leading-[1.15] tracking-[-0.03em] ${pal.panelText}`}>
          {post.title}
        </h3>
        <p className={`mt-3 line-clamp-3 text-[0.875rem] leading-[1.6] ${pal.softMutedText}`}>
          {getEditableExcerpt(post, 130)}
        </p>
      </div>
    </Link>
  )
}

/* ---------------------------- CompactIndexCard ----------------------------
   Numbered index-style card for tight grids. */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group block min-w-0 ${dc.surface.soft} p-6 ${dc.motion.lift}`}
    >
      <div className="flex items-start gap-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] text-[0.8125rem] font-semibold text-white">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{getEditableCategory(post)}</p>
          <h3 className={`editable-display mt-2 line-clamp-2 text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.03em] ${pal.panelText}`}>
            {post.title}
          </h3>
          <p className={`mt-3 line-clamp-2 text-[0.875rem] leading-[1.6] ${pal.softMutedText}`}>
            {getEditableExcerpt(post, 110)}
          </p>
        </div>
      </div>
    </Link>
  )
}

/* ----------------------------- ArticleListCard ---------------------------
   Wide split card (image left, prose right) for archive lists. */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-4 ${dc.motion.lift} sm:grid-cols-[260px_minmax(0,1fr)]`}
    >
      <div className={`${dc.media.frame} aspect-[16/12] sm:aspect-auto sm:min-h-[220px] rounded-[1.25rem]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
        />
      </div>
      <div className="min-w-0 p-2 sm:py-5 sm:pr-6">
        <p className={`${dc.type.eyebrow} ${pal.accentText}`}>
          {getEditableCategory(post)} · No. {String(index + 1).padStart(2, '0')}
        </p>
        <h2 className={`editable-display mt-3 line-clamp-3 text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.03em] ${pal.panelText} sm:text-[1.875rem]`}>
          {post.title}
        </h2>
        <p className={`mt-4 line-clamp-3 text-[0.9375rem] leading-[1.6] ${pal.softMutedText}`}>
          {getEditableExcerpt(post, 180)}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] pl-4 pr-1.5 py-1.5 text-[0.8125rem] font-medium">
          Open
          <span className="editable-arrow-chip bg-[var(--slot4-dark-bg)] text-white h-7 w-7">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </span>
      </div>
    </Link>
  )
}
