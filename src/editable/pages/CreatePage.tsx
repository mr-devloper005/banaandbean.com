'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight, Bookmark, Building2, CheckCircle2, FileText, Image as ImageIcon, Lock, Send,
  Sparkles, UserRound,
} from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { getTaskDisplayLabel } from '@/editable/content/tasks.config'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: Sparkles,
  image: ImageIcon,
  profile: UserRound,
  pdf: FileText,
  sbm: Bookmark,
}

const fieldClass =
  'rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-[0.9375rem] font-medium text-[var(--slot4-page-text)] outline-none transition duration-300 placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]'
const areaClass =
  'rounded-[1.25rem] border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-[0.9375rem] font-medium text-[var(--slot4-page-text)] outline-none transition duration-300 placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]
  const activeLabel = getTaskDisplayLabel(activeTask?.key || '', activeTask?.label || 'entry')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] px-5 py-16 text-[var(--slot4-page-text)] sm:px-8 lg:px-10">
          <EditableReveal index={0}>
            <section className="mx-auto grid max-w-5xl gap-8 rounded-[2rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 md:grid-cols-[0.9fr_1.1fr] md:p-12">
              <div className="flex h-full min-h-72 items-center justify-center rounded-[1.5rem] bg-[var(--slot4-dark-bg)] text-white">
                <Lock className="h-20 w-20 opacity-80" />
              </div>
              <div className="self-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" />
                  {pagesContent.create.locked.badge}
                </span>
                <h1 className="editable-display-tight mt-6 text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[3rem] lg:text-[3.5rem]">
                  {pagesContent.create.locked.title}
                </h1>
                <p className="mt-5 max-w-xl text-[1.0625rem] leading-[1.55] text-[var(--slot4-muted-text)]">
                  {pagesContent.create.locked.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/login"
                    className="group inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] pl-6 pr-2 py-2 text-[0.9375rem] font-medium text-white transition duration-300 hover:bg-[var(--slot4-accent)]"
                  >
                    Sign in
                    <span className="editable-arrow-chip bg-white text-[var(--slot4-page-text)]">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-5 py-2 text-[0.9375rem] font-medium transition duration-300 hover:border-[var(--slot4-page-text)]"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </section>
          </EditableReveal>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[85rem] px-5 sm:px-8 lg:px-10 py-14 sm:py-20">
          <EditableReveal index={0}>
            <div className="grid gap-10 rounded-[2rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
              <aside>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" />
                  {pagesContent.create.hero.badge}
                </span>
                <h1 className="editable-display-tight mt-6 text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[2.75rem] lg:text-[3.25rem]">
                  {pagesContent.create.hero.title}
                </h1>
                <p className="mt-5 max-w-xl text-[1.0625rem] leading-[1.55] text-[var(--slot4-muted-text)]">
                  {pagesContent.create.hero.description}
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {enabledTasks.map((item) => {
                    const Icon = taskIcon[item.key] || FileText
                    const active = item.key === task
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setTask(item.key)}
                        className={`rounded-[1.25rem] border p-5 text-left transition duration-300 ${
                          active
                            ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-dark-bg)] text-white'
                            : 'border-[var(--editable-border)] bg-[var(--slot4-page-bg)] hover:-translate-y-[2px] hover:border-[var(--slot4-page-text)]'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="editable-display mt-3 block text-[0.9375rem] font-semibold tracking-[-0.02em]">
                          {getTaskDisplayLabel(item.key, item.label)}
                        </span>
                        <span className={`mt-1 block text-[0.8125rem] ${active ? 'text-white/70' : 'text-[var(--slot4-muted-text)]'}`}>
                          {item.description}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </aside>

              <form onSubmit={submit} className="rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="editable-eyebrow text-[var(--slot4-muted-text)]">Submit to {activeLabel}</p>
                    <h2 className="editable-display mt-2 text-[1.625rem] font-semibold tracking-[-0.025em]">
                      {pagesContent.create.formTitle}
                    </h2>
                  </div>
                  <span className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.18em]">
                    {session.name}
                  </span>
                </div>

                <div className="mt-6 grid gap-4">
                  <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Entry title" required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                    <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                  </div>
                  <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                  <textarea className={`${areaClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                  <textarea className={`${areaClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Full details or body content" required />
                </div>

                {created ? (
                  <div className="mt-5 rounded-[1.25rem] border border-[var(--slot4-accent-secondary)] bg-[var(--slot4-accent-secondary-soft)] p-4 text-[var(--slot4-on-secondary)]">
                    <p className="flex items-center gap-2 text-[0.9375rem] font-semibold">
                      <CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}
                    </p>
                    <p className="mt-1 text-[0.875rem] font-medium opacity-80">{created.title}</p>
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 text-[0.9375rem] font-medium text-white transition duration-300 hover:bg-[var(--slot4-accent)]"
                >
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                  <span className="editable-arrow-chip h-8 w-8 bg-white text-[var(--slot4-page-text)]">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>
              </form>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
