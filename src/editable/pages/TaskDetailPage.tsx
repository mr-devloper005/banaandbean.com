import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import {
  ArrowLeft, ArrowUpRight, Bookmark, Building2, ChevronRight, Clock, Compass, Copy,
  Download, ExternalLink, FileText, Layers, Mail, MapPin, Phone,
  Share2, ShieldCheck, Star, Tag, UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { getTaskDisplayLabel } from '@/editable/content/tasks.config'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const dedupeUrls = (urls: Array<string | null | undefined>): string[] =>
  Array.from(new Set(urls.map((url) => (typeof url === 'string' ? url.trim() : '')).filter((url) => url.length > 0)))

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return dedupeUrls([...media, ...images, ...singleImages]).filter(Boolean).slice(0, 12)
}

const getTags = (post: SitePost) => {
  const content = getContent(post)
  const raw = Array.isArray(content.tags) ? content.tags : Array.isArray(post.tags) ? post.tags : []
  return raw
    .map((t) => (typeof t === 'string' ? t.trim() : ''))
    .filter((t): t is string => Boolean(t))
    .slice(0, 8)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const comparableText = (value: string) => stripHtml(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()

const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  const leadKey = comparableText(lead)
  return leadKey && comparableText(getBody(post)).includes(leadKey) ? '' : lead
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ---------------------------------------------------------------- helpers */

const hashStr = (value: string) => {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}
const ratingOf = (post: SitePost) => {
  const real = Number(getContent(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  return Math.round((3.7 + (hashStr(post.slug || post.id || post.title || 'x') % 13) / 10) * 10) / 10
}
const reviewsOf = (post: SitePost) => {
  const real = Number(getContent(post).reviewCount ?? getContent(post).reviews)
  if (real > 0) return Math.floor(real)
  return 6 + (hashStr((post.slug || post.title || 'x') + 'r') % 480)
}

const container = 'mx-auto max-w-[85rem] px-5 sm:px-8 lg:px-10'

function DetailMeta({ post, category, center = false }: { post: SitePost; category?: string; center?: boolean }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 ${center ? 'justify-center' : ''}`}>
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-[18px] w-[18px] ${i < filled ? 'fill-[var(--slot4-accent)] text-[var(--slot4-accent)]' : 'fill-[var(--editable-border)] text-[var(--editable-border)]'}`} />
        ))}
      </span>
      <span className="text-sm font-semibold text-[var(--slot4-page-text)]">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--slot4-muted-text)]">{reviewsOf(post)} reviews</span>
      {category ? (
        <>
          <span className="h-1 w-1 rounded-full bg-[var(--slot4-muted-text)] opacity-50" />
          <span className="text-sm text-[var(--slot4-muted-text)]">{category}</span>
        </>
      ) : null}
    </div>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" />
      {theme.kicker}
      {children ? (
        <>
          <span className="h-1 w-1 rounded-full bg-[var(--slot4-page-text)]/25" />
          <span className="text-[var(--slot4-muted-text)]">{children}</span>
        </>
      ) : null}
    </span>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  const label = getTaskDisplayLabel(task, taskConfig?.label || 'entries')
  return (
    <Link
      href={taskConfig?.route || '/'}
      className="group inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] pl-4 pr-5 py-1.5 text-[0.8125rem] font-medium text-[var(--slot4-muted-text)] transition duration-300 hover:border-[var(--slot4-page-text)] hover:text-[var(--slot4-page-text)]"
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
      Back to {label}
    </Link>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--slot4-page-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-8'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function TagChips({ tags }: { tags: string[] }) {
  if (!tags.length) return null
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3.5 py-1 text-[0.75rem] font-medium tracking-[-0.005em] text-[var(--slot4-muted-text)]"
        >
          <Tag className="h-3 w-3 opacity-70" /> {tag}
        </span>
      ))}
    </div>
  )
}

/* ============================================================
   Shared building blocks for the split-canvas record layout
   used by ListingDetail + PdfDetail (visually coherent, structurally
   distinct from the old two-column sidebar layout).
   ============================================================ */

type Crumb = { label: string; href?: string }

function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/55">
      {crumbs.map((crumb, i) => (
        <Fragment key={crumb.label + i}>
          {i > 0 ? <ChevronRight className="h-3 w-3 text-white/30" /> : null}
          {crumb.href ? (
            <Link href={crumb.href} className="transition-colors duration-300 hover:text-white">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-white">{crumb.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}

function SpecSheet({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  const visible = rows.filter(([, value]) => value !== null && value !== undefined && value !== '')
  if (!visible.length) return null
  return (
    <dl className="divide-y divide-[var(--editable-border)]">
      {visible.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] items-start gap-6 py-5 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)]">
          <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
            {label}
          </dt>
          <dd className="text-[0.9375rem] font-medium leading-[1.55] text-[var(--slot4-page-text)] break-words sm:text-[1rem]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function ProseColumn({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-[64ch]">{children}</div>
}

function TickerRow({ items }: { items: Array<{ icon: typeof Star; label: string; tone?: 'accent' | 'ink' | 'soft' }> }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map(({ icon: Icon, label, tone = 'soft' }) => {
        const cls =
          tone === 'accent'
            ? 'bg-[var(--slot4-accent-secondary)] text-[var(--slot4-on-secondary)]'
            : tone === 'ink'
              ? 'bg-[var(--slot4-dark-bg)] text-white'
              : 'border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)]'
        return (
          <span
            key={label}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.18em] ${cls}`}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </span>
        )
      })}
    </div>
  )
}

function PunchUpCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative -mt-24 sm:-mt-28">
      <div className="rounded-[2rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 shadow-[0_36px_80px_-32px_rgba(12,12,12,0.35)] sm:p-12">
        {children}
      </div>
    </div>
  )
}

function MosaicGallery({ images }: { images: string[] }) {
  if (!images.length) return null
  const spans = [
    'sm:col-span-8 sm:row-span-2 aspect-[16/10]',
    'sm:col-span-4 aspect-[4/3]',
    'sm:col-span-4 aspect-[4/3]',
    'col-span-6 sm:col-span-4 aspect-square',
    'col-span-6 sm:col-span-4 aspect-square',
    'col-span-12 sm:col-span-4 aspect-square',
  ]
  return (
    <div className="grid grid-cols-12 gap-3">
      {images.slice(0, spans.length).map((image, i) => (
        <figure
          key={`${image}-${i}`}
          className={`overflow-hidden rounded-[1.25rem] bg-[var(--slot4-media-bg)] col-span-12 ${spans[i]}`}
        >
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-[900ms] hover:scale-[1.05]"
          />
        </figure>
      ))}
    </div>
  )
}

function FloatingActionRail({
  label,
  href,
  external = false,
  download = false,
  Icon = ArrowUpRight,
  shareLabel,
}: {
  label: string
  href: string
  external?: boolean
  download?: boolean
  Icon?: typeof ArrowUpRight
  shareLabel?: string
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6 lg:inset-x-auto lg:right-6 lg:justify-end">
      <div className="pointer-events-auto flex w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-[var(--slot4-dark-bg)]/95 p-1.5 text-white shadow-[0_24px_60px_-20px_rgba(12,12,12,0.45)] backdrop-blur-xl lg:w-auto">
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
          {...(download ? { download: true } : {})}
          className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-secondary)] pl-5 pr-2 py-2 text-[0.9375rem] font-medium text-[var(--slot4-on-secondary)] transition duration-300 hover:bg-white lg:flex-none"
        >
          {label}
          <span className="editable-arrow-chip bg-[var(--slot4-dark-bg)] text-white">
            <Icon className="h-4 w-4" />
          </span>
        </a>
        <a
          href="#related"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition duration-300 hover:bg-white/10 hover:text-white"
          aria-label={shareLabel || 'Jump to related'}
        >
          <Share2 className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}

function RelatedRail({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const label = getTaskDisplayLabel(task, taskConfig?.label || 'entries').toLowerCase()
  return (
    <section id="related" className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-14 sm:py-20`}>
        <EditableReveal index={0}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="editable-eyebrow text-[var(--slot4-muted-text)]">Keep browsing</span>
              <h2 className="editable-display-tight mt-3 text-[1.75rem] font-semibold tracking-[-0.035em] sm:text-[2.25rem]">
                Also in {label}
              </h2>
            </div>
            <Link
              href={taskConfig?.route || '/'}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] pl-5 pr-1.5 py-1.5 text-[0.9375rem] font-medium transition duration-300 hover:border-[var(--slot4-page-text)]"
            >
              View all
              <span className="editable-arrow-chip h-8 w-8 bg-[var(--slot4-dark-bg)] text-white">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </EditableReveal>

        {/* Horizontal snap rail (not a grid) */}
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {related.map((item, i) => (
            <EditableReveal key={item.id || item.slug} index={i + 1}>
              <RailCard task={task} post={item} />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function RailCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  const category = categoryOf(post, '')
  return (
    <Link
      href={href}
      className="group block w-[280px] shrink-0 snap-start overflow-hidden rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_44px_-24px_rgba(12,12,12,0.24)] sm:w-[320px]"
    >
      <div className="relative m-3 aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[var(--slot4-media-bg)]">
        {image ? (
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileText className="h-8 w-8 text-[var(--slot4-muted-text)]" />
          </div>
        )}
        {category ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-page-text)]">
            {category}
          </span>
        ) : null}
      </div>
      <div className="px-5 pb-6 pt-1">
        <h3 className="editable-display line-clamp-2 text-[1rem] font-semibold leading-[1.25] tracking-[-0.02em]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-[1.55] text-[var(--slot4-muted-text)]">
          {stripHtml(summaryText(post))}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
          Open <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

function PdfRelatedRail({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig('pdf')
  return (
    <section id="related" className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-14 sm:py-20`}>
        <EditableReveal index={0}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="editable-eyebrow text-[var(--slot4-muted-text)]">Keep browsing</span>
              <h2 className="editable-display-tight mt-3 text-[1.75rem] font-semibold tracking-[-0.035em] sm:text-[2.25rem]">
                More in the Reference Library
              </h2>
            </div>
            <Link
              href={taskConfig?.route || '/'}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] pl-5 pr-1.5 py-1.5 text-[0.9375rem] font-medium transition duration-300 hover:border-[var(--slot4-page-text)]"
            >
              View all
              <span className="editable-arrow-chip h-8 w-8 bg-[var(--slot4-dark-bg)] text-white">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </EditableReveal>

        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {related.map((item, i) => {
            const href = `${taskConfig?.route || '/pdf'}/${item.slug}`
            const size = getField(item, ['fileSize', 'size']) || 'PDF'
            const pages = getField(item, ['pages', 'pageCount'])
            return (
              <EditableReveal key={item.id || item.slug} index={i + 1}>
                <Link
                  href={href}
                  className="group flex h-full w-[280px] shrink-0 snap-start flex-col justify-between rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_44px_-24px_rgba(12,12,12,0.24)] sm:w-[320px]"
                >
                  <div>
                    <span className="editable-display-tight flex h-16 w-16 items-center justify-center rounded-[1rem] bg-[var(--slot4-dark-bg)] text-[1.5rem] font-semibold leading-none text-[var(--slot4-accent-secondary)]">
                      PDF
                    </span>
                    <h3 className="editable-display mt-6 line-clamp-3 text-[1.0625rem] font-semibold leading-[1.25] tracking-[-0.02em]">
                      {item.title}
                    </h3>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-warm)] px-2.5 py-0.5 text-[0.72rem] font-medium text-[var(--slot4-muted-text)]">
                      {size}
                    </span>
                    {pages ? (
                      <span className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-warm)] px-2.5 py-0.5 text-[0.72rem] font-medium text-[var(--slot4-muted-text)]">
                        {pages} pp.
                      </span>
                    ) : null}
                    <span className="ml-auto inline-flex items-center gap-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
                      Open <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------- Article Detail */
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  const tags = getTags(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-10 py-14 sm:py-20">
        <EditableReveal index={0}>
          <BackLink task="article" />
          <p className="mt-10 editable-eyebrow text-[var(--slot4-accent)]">{categoryOf(post, 'Journal')}</p>
          <h1 className="editable-display-tight mt-5 text-balance text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[3.25rem] lg:text-[3.75rem]">
            {post.title}
          </h1>
          <div className="mt-6 text-sm text-[var(--slot4-muted-text)]">
            <span>{SITE_CONFIG.name}</span>
          </div>
          {images[0] ? (
            <div className="mt-10 overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-[var(--slot4-media-bg)]">
              <img src={images[0]} alt="" className="aspect-[16/9] w-full object-cover" />
            </div>
          ) : null}
          <BodyContent post={post} />
          <TagChips tags={tags} />
          <EditableArticleComments slug={post.slug} comments={comments} />
        </EditableReveal>
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* --------------------------------------------------------- Listing Detail

   Split-canvas record layout (new):
   - Dark hero band (full-bleed) w/ breadcrumbs, huge h1, lead + CTAs on left,
     identity card (logo image + inline meta) on right.
   - Punch-up card overlapping the band w/ ticker chips + definition-list spec
     sheet (Location/Phone/Email/Website/Hours) — replaces the old sticky sidebar.
   - Centered reading-column prose (max-w 64ch) w/ tag chips.
   - Photo mosaic (12-col asymmetric).
   - Full-bleed inline map card.
   - Sidebar-slot ad inline before related.
   - Floating action rail (bottom-center mobile / bottom-right desktop).
   - Horizontal snap-rail of related listings (not a grid).
---------------------------------------------------------------------------- */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const gallery = images.slice(1, 9)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'openHours', 'opening', 'schedule']) || 'Mon – Sat · 9am – 8pm'
  const mapSrc = mapSrcFor(post)
  const category = getField(post, ['category']) || 'Local business'
  const tags = getTags(post)
  const rating = ratingOf(post)
  const reviews = reviewsOf(post)
  const cleanWebsite = website ? website.replace(/^https?:\/\//, '').replace(/\/$/, '') : ''
  const primaryHref = website || (phone ? `tel:${phone}` : email ? `mailto:${email}` : '/contact')

  const specRows: Array<[string, React.ReactNode]> = [
    ['Category', category],
    ['Location', address ? (
      <span className="inline-flex items-center gap-2">
        <MapPin className="h-4 w-4 text-[var(--slot4-accent)]" /> {address}
      </span>
    ) : ''],
    ['Phone', phone ? <a href={`tel:${phone}`} className="underline underline-offset-2 hover:text-[var(--slot4-accent)]">{phone}</a> : ''],
    ['Email', email ? <a href={`mailto:${email}`} className="underline underline-offset-2 hover:text-[var(--slot4-accent)]">{email}</a> : ''],
    ['Website', website ? (
      <a href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-[var(--slot4-accent)]">
        {cleanWebsite} <ExternalLink className="h-3.5 w-3.5" />
      </a>
    ) : ''],
    ['Hours', hours],
    ['Status', 'Reviewed & verified'],
  ]

  return (
    <>
      {/* ============ Full-bleed dark hero band ============ */}
      <div className="relative overflow-hidden bg-[var(--slot4-dark-bg)] pb-40 pt-10 text-white sm:pt-14 sm:pb-48">
        <div className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-[var(--slot4-accent-secondary)] opacity-25 blur-[140px]" aria-hidden />
        <div className="pointer-events-none absolute -left-40 bottom-20 h-[320px] w-[320px] rounded-full bg-[var(--slot4-accent)] opacity-20 blur-[140px]" aria-hidden />

        <div className={`${container} relative`}>
          <EditableReveal index={0}>
            <Breadcrumbs
              crumbs={[
                { label: 'Home', href: '/' },
                { label: 'Local Directory', href: getTaskConfig('listing')?.route || '/listings' },
                { label: post.title.length > 46 ? `${post.title.slice(0, 46)}…` : post.title },
              ]}
            />
          </EditableReveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-14">
            {/* LEFT — huge display h1, lead, primary CTAs */}
            <EditableReveal index={1}>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-secondary)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-on-secondary)]">
                  <Building2 className="h-3.5 w-3.5" /> {category}
                </span>
                <h1 className="editable-display-tight mt-6 max-w-4xl text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.06em] sm:text-[3.5rem] lg:text-[5rem] lg:leading-[0.98] lg:tracking-[-0.075em]">
                  {post.title}
                </h1>
                {leadText(post) ? (
                  <p className="mt-6 max-w-2xl text-[1.125rem] leading-[1.55] text-white/70 sm:text-[1.1875rem]">
                    {leadText(post)}
                  </p>
                ) : null}
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a
                    href={primaryHref}
                    target={website ? '_blank' : undefined}
                    rel={website ? 'noreferrer' : undefined}
                    className="group inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-secondary)] pl-6 pr-2 py-2 text-[1rem] font-medium text-[var(--slot4-on-secondary)] transition duration-300 hover:bg-white"
                  >
                    Contact this record
                    <span className="editable-arrow-chip bg-[var(--slot4-dark-bg)] text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </a>
                  {mapSrc ? (
                    <a
                      href={mapSrc}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full border border-white/20 pl-6 pr-2 py-2 text-[1rem] font-medium text-white transition duration-300 hover:border-white hover:bg-white/5"
                    >
                      Get directions
                      <span className="editable-arrow-chip bg-white text-[var(--slot4-dark-bg)]">
                        <Compass className="h-4 w-4" />
                      </span>
                    </a>
                  ) : null}
                </div>
              </div>
            </EditableReveal>

            {/* RIGHT — identity card w/ logo, rating, quick pills */}
            <EditableReveal index={2}>
              <div className="rounded-[1.75rem] bg-[var(--slot4-surface-bg)] p-3 text-[var(--slot4-page-text)] shadow-[0_36px_80px_-32px_rgba(0,0,0,0.55)]">
                <div className="relative overflow-hidden rounded-[1.25rem] bg-[var(--slot4-media-bg)]">
                  {logo ? (
                    <img src={logo} alt={post.title} className="aspect-[4/3] w-full object-cover" />
                  ) : (
                    <div className="grid aspect-[4/3] w-full place-items-center bg-[linear-gradient(135deg,#2670ff,#0c0c0c)]">
                      <Building2 className="h-16 w-16 text-white/70" />
                    </div>
                  )}
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--slot4-surface-bg)]/95 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> Verified
                  </span>
                </div>
                <div className="px-3 pb-3 pt-5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-[3px]">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star
                          key={i}
                          className={`h-[16px] w-[16px] ${
                            i < Math.round(rating)
                              ? 'fill-[var(--slot4-accent)] text-[var(--slot4-accent)]'
                              : 'fill-[var(--editable-border)] text-[var(--editable-border)]'
                          }`}
                        />
                      ))}
                    </span>
                    <span className="text-[0.9375rem] font-semibold">{rating.toFixed(1)}</span>
                    <span className="text-[0.8125rem] text-[var(--slot4-muted-text)]">({reviews} reviews)</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {address ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--editable-border)] px-2.5 py-1 text-[0.72rem] font-medium text-[var(--slot4-muted-text)]">
                        <MapPin className="h-3 w-3" /> {address.length > 22 ? `${address.slice(0, 22)}…` : address}
                      </span>
                    ) : null}
                    {phone ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--editable-border)] px-2.5 py-1 text-[0.72rem] font-medium text-[var(--slot4-muted-text)]">
                        <Phone className="h-3 w-3" /> {phone}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--editable-border)] px-2.5 py-1 text-[0.72rem] font-medium text-[var(--slot4-muted-text)]">
                      <Clock className="h-3 w-3" /> {hours.split('·')[0].trim()}
                    </span>
                  </div>
                </div>
              </div>
            </EditableReveal>
          </div>
        </div>
      </div>

      {/* ============ Punch-up card — ticker + spec sheet ============ */}
      <div className={`${container} relative z-10`}>
        <EditableReveal index={0}>
          <PunchUpCard>
            <TickerRow
              items={[
                { icon: Star, label: `${rating.toFixed(1)} · ${reviews}`, tone: 'ink' },
                { icon: Tag, label: category, tone: 'accent' },
                { icon: ShieldCheck, label: 'Verified' },
                { icon: MapPin, label: 'Local first' },
              ]}
            />
            <div className="mt-8 border-t border-[var(--editable-border)] pt-2">
              <SpecSheet rows={specRows} />
            </div>
          </PunchUpCard>
        </EditableReveal>
      </div>

      {/* ============ Reading-column prose ============ */}
      <section className={`${container} pt-16 pb-10 sm:pt-24`}>
        <EditableReveal index={0}>
          <ProseColumn>
            <span className="editable-eyebrow text-[var(--slot4-muted-text)]">The record</span>
            <h2 className="editable-display-tight mt-3 text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.035em] sm:text-[2.5rem]">
              About this business
            </h2>
            <BodyContent post={post} />
            <TagChips tags={tags} />
          </ProseColumn>
        </EditableReveal>
      </section>

      {/* ============ Photo mosaic (asymmetric) ============ */}
      {gallery.length ? (
        <section className={`${container} pb-10`}>
          <EditableReveal index={0}>
            <div className="mb-6 flex items-baseline justify-between">
              <h3 className="editable-display text-[1.375rem] font-semibold tracking-[-0.025em]">Photos from this record</h3>
              <span className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]">
                {gallery.length} shots
              </span>
            </div>
            <MosaicGallery images={gallery} />
          </EditableReveal>
        </section>
      ) : null}

      {/* ============ Full-bleed map ============ */}
      {mapSrc ? (
        <section className={`${container} pb-10`}>
          <EditableReveal index={0}>
            <div className="overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--editable-border)] p-5">
                <div className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold">
                  <MapPin className="h-4 w-4 text-[var(--slot4-accent)]" /> {address || 'Directory location'}
                </div>
                <a
                  href={mapSrc}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] pl-4 pr-1.5 py-1.5 text-[0.8125rem] font-medium transition duration-300 hover:border-[var(--slot4-page-text)]"
                >
                  Open in Maps
                  <span className="editable-arrow-chip h-7 w-7 bg-[var(--slot4-dark-bg)] text-white">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </span>
                </a>
              </div>
              <iframe src={mapSrc} title="Map" loading="lazy" className="h-96 w-full border-0" />
            </div>
          </EditableReveal>
        </section>
      ) : null}

      {/* ============ Sidebar-slot ad, inline ============ */}
      <section className={`${container} pb-16`}>
        <EditableReveal index={0}>
          <Ads slot="in-feed" size={pickRandom(getSlotSizes('in-feed'))} showLabel className="mx-auto w-full" />
        </EditableReveal>
      </section>

      {/* ============ Related — horizontal snap rail ============ */}
      <RelatedRail task="listing" related={related} />

      {/* ============ Floating action rail ============ */}
      <FloatingActionRail label="Contact record" href={primaryHref} external={Boolean(website)} shareLabel="Jump to related" />
    </>
  )
}

/* --------------------------------------------------------- Classified Detail */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className={`${container} py-14 sm:py-20`}>
        <BackLink task="classified" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7">
              <Kicker task="classified">{getField(post, ['category']) || 'Marketplace'}</Kicker>
              <h1 className="editable-display-tight mt-5 text-[1.875rem] font-semibold leading-[1.05] tracking-[-0.04em]">
                {post.title}
              </h1>
              <DetailMeta post={post} category={getField(post, ['category'])} />
              <p className="editable-display-tight mt-6 text-[3rem] font-semibold leading-none tracking-[-0.05em] text-[var(--slot4-accent)]">
                {price || 'Open offer'}
              </p>
              <div className="mt-6 space-y-2.5">
                {condition ? <BadgeLine label="Condition" value={condition} /> : null}
                {location ? <BadgeLine label="Location" value={location} /> : null}
              </div>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {phone ? (
                  <a href={`tel:${phone}`} className="group inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] pl-5 pr-2 py-2 text-[0.9375rem] font-medium text-white transition duration-300 hover:bg-[var(--slot4-accent)]">
                    <Phone className="h-4 w-4" /> Call
                    <span className="editable-arrow-chip bg-white text-[var(--slot4-page-text)]">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </a>
                ) : null}
                {email ? (
                  <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-5 py-2 text-[0.9375rem] font-medium transition duration-300 hover:border-[var(--slot4-page-text)]">
                    <Mail className="h-4 w-4" /> Email
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
          <article className="min-w-0">
            <ImageStrip images={images} label="Offer images" large />
            <BodyContent post={post} />
            <ContactAction website={website} phone={phone} email={email} />
          </article>
        </div>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* --------------------------------------------------------- Image Detail */
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className={`${container} py-14 sm:py-20`}>
        <BackLink task="image" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Kicker task="image">Gallery item</Kicker>
            <h1 className="editable-display-tight mt-6 text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-[3rem]">
              {post.title}
            </h1>
            {leadText(post) ? <p className="mt-6 text-[1.125rem] leading-[1.55] text-[var(--slot4-muted-text)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* --------------------------------------------------------- Bookmark Detail */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-10 py-14 sm:py-20">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
          <Bookmark className="h-7 w-7" />
        </div>
        <div className="mt-6"><Kicker task="sbm">Saved resource</Kicker></div>
        <h1 className="editable-display-tight mt-5 text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-[3rem]">
          {post.title}
        </h1>
        {leadText(post) ? <p className="mt-6 text-[1.125rem] leading-[1.55] text-[var(--slot4-muted-text)]">{leadText(post)}</p> : null}
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] pl-6 pr-2 py-2 text-[1rem] font-medium text-white transition duration-300 hover:bg-[var(--slot4-accent)]"
          >
            Open resource
            <span className="editable-arrow-chip bg-white text-[var(--slot4-page-text)]">
              <ExternalLink className="h-4 w-4" />
            </span>
          </a>
        ) : null}
        <BodyContent post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* --------------------------------------------------------- PDF Detail

   Split-canvas reference layout (new — matches ListingDetail shape):
   - Dark hero band w/ breadcrumbs, huge h1, pull-quote lead + CTAs on left,
     neon-pear PDF glyph identity card on right (filename + inline meta).
   - Punch-up card overlapping the band w/ ticker chips + definition-list spec
     sheet (Category/Pages/File size/Format/Uploader) — replaces the old sticky sidebar.
   - Floating full-bleed PDF viewer with pill overlay bar (filename + Download).
   - Centered reading-column prose (max-w 64ch) w/ tag chips.
   - "What's inside" numbered outline (three cards).
   - Article-bottom slot ad inline.
   - Cite-this-reference panel (copyable citation).
   - Repeated dark CTA callout.
   - Horizontal snap-rail of related PDFs (glyphs only, no images).
   - Floating action rail w/ Download primary CTA.
---------------------------------------------------------------------------- */
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const uploader = getField(post, ['uploader', 'author', 'contributor']) || SITE_CONFIG.name
  const filename = fileUrl ? decodeURIComponent(fileUrl.split('/').pop() || `${post.slug || 'reference'}.pdf`) : `${post.slug || 'reference'}.pdf`
  const tags = getTags(post)

  const insidePoints = [
    'Executive summary and key findings',
    'Reference tables and citations',
    'Community notes and appendix',
  ]

  const citation = `${uploader}. ${post.title}. ${SITE_CONFIG.name} Reference Library. ${filename}`
  const primaryHref = fileUrl || '#'

  return (
    <>
      {/* ============ PDF viewer ============ */}
      {fileUrl ? (
        <section className={`${container} pt-16 pb-10 sm:pt-24`}>
          <EditableReveal index={0}>
            <div className="overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--editable-border)] p-5">
                <div className="inline-flex min-w-0 items-center gap-2 text-[0.9375rem] font-semibold text-[var(--slot4-page-text)]">
                  <FileText className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                  <span className="truncate">{filename}</span>
                </div>
                <a
                  href={fileUrl}
                  download
                  className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] pl-4 pr-1.5 py-1.5 text-[0.8125rem] font-medium text-white transition duration-300 hover:bg-[var(--slot4-accent)]"
                >
                  Download
                  <span className="editable-arrow-chip h-7 w-7 bg-white text-[var(--slot4-page-text)]">
                    <Download className="h-3.5 w-3.5" />
                  </span>
                </a>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[85vh] w-full border-0 bg-[var(--slot4-media-bg)]" />
            </div>
          </EditableReveal>
        </section>
      ) : null}

      {/* ============ Reading-column prose ============ */}
      <section className={`${container} pt-4 pb-10 sm:pt-8`}>
        <EditableReveal index={0}>
          <ProseColumn>
            <span className="editable-eyebrow text-[var(--slot4-muted-text)]">Overview</span>
            <h2 className="editable-display-tight mt-3 text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.035em] sm:text-[2.5rem]">
              What this reference covers
            </h2>
            <BodyContent post={post} />
            <TagChips tags={tags} />
          </ProseColumn>
        </EditableReveal>
      </section>

      {/* ============ What's inside — numbered outline ============ */}
      <section className={`${container} pb-10`}>
        <EditableReveal index={0}>
          <div className="mb-6 flex items-baseline justify-between">
            <h3 className="editable-display text-[1.375rem] font-semibold tracking-[-0.025em]">What's inside</h3>
            <span className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]">
              {insidePoints.length} sections
            </span>
          </div>
        </EditableReveal>
        <div className="grid gap-4 md:grid-cols-3">
          {insidePoints.map((text, i) => (
            <EditableReveal key={text} index={i + 1}>
              <div className="flex h-full flex-col rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_44px_-24px_rgba(12,12,12,0.22)]">
                <span className="editable-display-tight text-[2.5rem] font-semibold leading-none tracking-[-0.05em] text-[var(--slot4-accent)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="editable-display mt-8 text-[1.0625rem] font-semibold leading-[1.3] tracking-[-0.02em]">
                  {text}
                </p>
              </div>
            </EditableReveal>
          ))}
        </div>
      </section>

      {/* ============ Article-bottom ad ============ */}
      <section className={`${container} pb-10`}>
        <EditableReveal index={0}>
          <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel className="mx-auto w-full" />
        </EditableReveal>
      </section>

      {/* ============ Cite this reference ============ */}
      <section className={`${container} pb-10`}>
        <EditableReveal index={0}>
          <div className="rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="editable-eyebrow text-[var(--slot4-muted-text)]">Cite this reference</span>
                <h3 className="editable-display mt-3 text-[1.375rem] font-semibold tracking-[-0.025em]">Give it credit if you use it.</h3>
              </div>
              
            </div>
            <div className="mt-6 rounded-[1.25rem] bg-[var(--slot4-warm)] p-5">
              <p className="font-mono text-[0.875rem] leading-[1.6] text-[var(--slot4-page-text)] break-words">
                {citation}
              </p>
            </div>
          </div>
        </EditableReveal>
      </section>

      {/* ============ Related — horizontal snap rail (glyph cards) ============ */}
      <PdfRelatedRail related={related} />

      {/* ============ Floating action rail ============ */}
      {fileUrl ? (
        <FloatingActionRail label="Download PDF" href={primaryHref} download Icon={Download} shareLabel="Jump to related" />
      ) : null}
    </>
  )
}

/* --------------------------------------------------------- Profile Detail */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className={`${container} py-14 sm:py-20`}>
        <BackLink task="profile" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--editable-border)] bg-[var(--slot4-media-bg)]">
                {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--slot4-muted-text)]" />}
              </div>
              <h1 className="editable-display mt-6 text-[1.5rem] font-semibold tracking-[-0.02em]">{post.title}</h1>
              {role ? <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{role}</p> : null}
              <DetailMeta post={post} center />
              <ContactAction website={website} email={email} bare />
            </div>
          </aside>
          <article className="min-w-0">
            <Kicker task="profile">Profile</Kicker>
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Gallery" />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* --------------------------------------------------------- Shared blocks */

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-10">
      <p className="editable-eyebrow text-[var(--slot4-muted-text)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt=""
            className="aspect-[4/3] rounded-[1.25rem] border border-[var(--editable-border)] object-cover"
          />
        ))}
      </div>
    </section>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${bare ? 'justify-center' : ''}`}>
      {website ? (
        <a href={website} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] pl-5 pr-2 py-2 text-[0.9375rem] font-medium text-white transition duration-300 hover:bg-[var(--slot4-accent)]">
          Website
          <span className="editable-arrow-chip bg-white text-[var(--slot4-page-text)]">
            <ExternalLink className="h-4 w-4" />
          </span>
        </a>
      ) : null}
      {phone ? (
        <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-4 py-2 text-[0.9375rem] font-medium transition duration-300 hover:border-[var(--slot4-page-text)]">
          <Phone className="h-4 w-4" /> Call
        </a>
      ) : null}
      {email ? (
        <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-4 py-2 text-[0.9375rem] font-medium transition duration-300 hover:border-[var(--slot4-page-text)]">
          <Mail className="h-4 w-4" /> Email
        </a>
      ) : null}
    </div>
  )
  if (bare) return <div className="mt-6">{buttons}</div>
  return (
    <div className="rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
      <p className="editable-eyebrow text-[var(--slot4-muted-text)]">Quick actions</p>
      <div className="mt-4">{buttons}</div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1rem] border border-[var(--editable-border)] bg-[var(--slot4-warm)] px-4 py-3 text-[0.875rem]">
      <span className="font-semibold uppercase tracking-[0.12em] text-[var(--slot4-muted-text)]">{label}</span>
      <span className="font-semibold text-[var(--slot4-page-text)]">{value}</span>
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const label = getTaskDisplayLabel(task, taskConfig?.label || 'entries').toLowerCase()
  return (
    <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-14 sm:py-20`}>
        <EditableReveal index={0}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="editable-display-tight text-[1.875rem] font-semibold tracking-[-0.035em] sm:text-[2.5rem]">
              More {label}
            </h2>
            <Link
              href={taskConfig?.route || '/'}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] pl-5 pr-1.5 py-1.5 text-[0.9375rem] font-medium transition duration-300 hover:border-[var(--slot4-page-text)]"
            >
              View all
              <span className="editable-arrow-chip h-8 w-8 bg-[var(--slot4-dark-bg)] text-white">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </EditableReveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, i) => (
            <EditableReveal key={item.id || item.slug} index={i + 1}>
              <RelatedCard task={task} post={item} grid />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, grid = false }: { task: TaskKey; post: SitePost; grid?: boolean }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (grid) {
    return (
      <Link
        href={href}
        className="group block overflow-hidden rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_44px_-24px_rgba(12,12,12,0.22)]"
      >
        <div className="relative m-3 aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-[var(--slot4-media-bg)]">
          {image ? (
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]" />
          ) : (
            <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--slot4-muted-text)]" /></div>
          )}
        </div>
        <div className="px-5 pb-6 pt-1">
          <h3 className="editable-display line-clamp-2 text-[1rem] font-semibold leading-[1.25] tracking-[-0.02em]">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-[0.875rem] leading-6 text-[var(--slot4-muted-text)]">{stripHtml(summaryText(post))}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex gap-3 rounded-[1rem] border border-[var(--editable-border)] p-3 transition duration-300 hover:border-[var(--slot4-page-text)]">
      {image && task !== 'sbm' ? (
        <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-[0.75rem] object-cover" />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[0.75rem] bg-[var(--slot4-warm)]">
          <FileText className="h-5 w-5 text-[var(--slot4-muted-text)]" />
        </div>
      )}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-[0.875rem] font-semibold leading-snug tracking-[-0.01em]">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[0.75rem] leading-5 text-[var(--slot4-muted-text)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}
