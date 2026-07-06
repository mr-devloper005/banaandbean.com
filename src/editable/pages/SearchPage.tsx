import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'
import { getTaskDisplayLabel } from '@/editable/content/tasks.config'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => {
  const raw = post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''
  return stripHtml(raw).replace(/\s+/g, ' ').trim()
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const chipLabel = getTaskDisplayLabel(task || '', SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Entry')
  const wide = index % 5 === 0

  return (
    <EditableReveal index={Math.min(index, 8)}>
      <Link
        href={href}
        className={`group block overflow-hidden rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_54px_-28px_rgba(12,12,12,0.22)] ${wide ? 'md:col-span-2' : ''}`}
      >
        {image ? (
          <div className={`relative m-3 overflow-hidden rounded-[1.25rem] bg-[var(--slot4-media-bg)] ${wide ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]" />
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-page-text)]">
              {chipLabel}
            </span>
          </div>
        ) : null}
        <div className="px-5 pb-6 pt-1 sm:px-6">
          {!image ? (
            <span className="rounded-full bg-[var(--slot4-dark-bg)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white">
              {chipLabel}
            </span>
          ) : null}
          <h2 className="editable-display mt-4 line-clamp-3 text-[1.375rem] font-semibold leading-[1.2] tracking-[-0.03em]">
            {post.title}
          </h2>
          {summary ? (
            <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-[1.55] text-[var(--slot4-muted-text)]">{summary}</p>
          ) : null}
          <span className="mt-4 inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-[var(--slot4-accent)]">
            Open match <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </EditableReveal>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[85rem] px-5 sm:px-8 lg:px-10 py-14 sm:py-20">
          <EditableReveal index={0}>
            <div className="grid gap-10 rounded-[2rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" />
                  {pagesContent.search.hero.badge}
                </span>
                <h1 className="editable-display-tight mt-6 text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[3rem] lg:text-[3.75rem]">
                  {pagesContent.search.hero.title}
                </h1>
                <p className="mt-5 max-w-xl text-[1.0625rem] leading-[1.55] text-[var(--slot4-muted-text)]">
                  {pagesContent.search.hero.description}
                </p>
              </div>
              <form action="/search" className="self-end rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] p-5">
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-5 py-3">
                  <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input
                    name="q"
                    defaultValue={query}
                    placeholder={pagesContent.search.hero.placeholder}
                    className="min-w-0 flex-1 bg-transparent text-[0.9375rem] font-medium outline-none placeholder:text-[var(--slot4-muted-text)]"
                  />
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-4 py-3">
                    <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                    <input
                      name="category"
                      defaultValue={category}
                      placeholder="Category"
                      className="min-w-0 flex-1 bg-transparent text-[0.875rem] font-medium outline-none placeholder:text-[var(--slot4-muted-text)]"
                    />
                  </label>
                  <select
                    name="task"
                    defaultValue={task}
                    className="rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-[0.875rem] font-medium outline-none"
                  >
                    <option value="">All surfaces</option>
                    {enabledTasks.map((item) => (
                      <option key={item.key} value={item.key}>{getTaskDisplayLabel(item.key, item.label)}</option>
                    ))}
                  </select>
                </div>
                <button
                  className="group mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 text-[0.9375rem] font-medium text-white transition duration-300 hover:bg-[var(--slot4-accent)]"
                  type="submit"
                >
                  Search
                  <span className="editable-arrow-chip h-8 w-8 bg-white text-[var(--slot4-page-text)]">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>
              </form>
            </div>
          </EditableReveal>

          <EditableReveal index={1}>
            <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="editable-eyebrow text-[var(--slot4-muted-text)]">{results.length} matches</p>
                <h2 className="editable-display-tight mt-3 text-[1.875rem] font-semibold tracking-[-0.035em] sm:text-[2.5rem]">
                  {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
                </h2>
              </div>
              <Link
                href="/listings"
                className="group inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] pl-5 pr-1.5 py-1.5 text-[0.9375rem] font-medium transition duration-300 hover:border-[var(--slot4-page-text)]"
              >
                Browse latest
                <span className="editable-arrow-chip h-8 w-8 bg-[var(--slot4-dark-bg)] text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </EditableReveal>

          {results.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-10 rounded-[1.5rem] border border-dashed border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] p-10 text-center">
              <p className="editable-display text-[1.5rem] font-semibold tracking-[-0.02em]">No matches yet.</p>
              <p className="mt-2 text-[0.9375rem] text-[var(--slot4-muted-text)]">Try a different keyword, surface or category.</p>
            </div>
          )}

          <div className="mt-14">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
