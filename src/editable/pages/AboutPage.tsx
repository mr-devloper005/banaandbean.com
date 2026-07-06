import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[85rem] px-5 sm:px-8 lg:px-10 py-14 sm:py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <EditableReveal index={0}>
              <article className="rounded-[2rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-12">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" />
                  {pagesContent.about.badge}
                </span>
                <h1 className="editable-display-tight mt-6 text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[3rem] lg:text-[3.75rem]">
                  About {SITE_CONFIG.name}
                </h1>
                <p className="mt-6 max-w-2xl text-[1.125rem] leading-[1.55] text-[var(--slot4-muted-text)]">
                  {pagesContent.about.description}
                </p>
                <div className="mt-8 space-y-5 text-[1rem] leading-[1.65] text-[var(--slot4-muted-text)]">
                  {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </article>
            </EditableReveal>
            <aside className="space-y-5">
              {pagesContent.about.values.map((value, i) => (
                <EditableReveal key={value.title} index={i + 1}>
                  <div className="rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7">
                    <h2 className="editable-display text-[1.25rem] font-semibold tracking-[-0.025em]">{value.title}</h2>
                    <p className="mt-3 text-[0.9375rem] leading-[1.55] text-[var(--slot4-muted-text)]">{value.description}</p>
                  </div>
                </EditableReveal>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
