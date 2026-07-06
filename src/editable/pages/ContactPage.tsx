'use client'

import { Building2, Download, MapPin, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const lanes = [
  { icon: Building2, title: 'Add a place to the directory', body: 'Nominate a business, service or space for the Local Directory. We review before publish.' },
  { icon: Download, title: 'Suggest a reference briefing', body: 'Point us at a report, guide or briefing worth adding to the Reference Library.' },
  { icon: MapPin, title: 'Correction or missing detail', body: 'Something inaccurate on a record? Send us the URL and the fix — we will update it.' },
  { icon: Sparkles, title: 'Partnerships & collaboration', body: 'Neighbourhood associations, publishers, community groups — reach us any time.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[85rem] px-5 sm:px-8 lg:px-10 py-14 sm:py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <EditableReveal index={0}>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" />
                  {pagesContent.contact.eyebrow}
                </span>
                <h1 className="editable-display-tight mt-6 text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[3rem] lg:text-[3.75rem]">
                  {pagesContent.contact.title}
                </h1>
                <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.55] text-[var(--slot4-muted-text)]">
                  {pagesContent.contact.description}
                </p>
                <div className="mt-10 space-y-4">
                  {lanes.map((lane, i) => (
                    <EditableReveal key={lane.title} index={i + 1}>
                      <div className="rounded-[1.25rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                          <lane.icon className="h-4 w-4" />
                        </span>
                        <h2 className="editable-display mt-4 text-[1.125rem] font-semibold tracking-[-0.02em]">{lane.title}</h2>
                        <p className="mt-2 text-[0.9375rem] leading-[1.55] text-[var(--slot4-muted-text)]">{lane.body}</p>
                      </div>
                    </EditableReveal>
                  ))}
                </div>
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className="rounded-[2rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
                <h2 className="editable-display text-[1.5rem] font-semibold tracking-[-0.02em]">{pagesContent.contact.formTitle}</h2>
                <EditableContactLeadForm />
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
