import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[85rem] items-center gap-12 px-5 sm:px-8 lg:px-10 py-16 lg:grid-cols-[1fr_0.9fr]">
          <EditableReveal index={0}>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" />
                {pagesContent.auth.login.badge}
              </span>
              <h1 className="editable-display-tight mt-6 max-w-xl text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[3rem] lg:text-[3.75rem]">
                {pagesContent.auth.login.title}
              </h1>
              <p className="mt-6 max-w-lg text-[1.0625rem] leading-[1.55] text-[var(--slot4-muted-text)]">
                {pagesContent.auth.login.description}
              </p>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <div className="rounded-[2rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
              <h2 className="editable-display text-[1.5rem] font-semibold tracking-[-0.02em]">{pagesContent.auth.login.formTitle}</h2>
              <EditableLocalLoginForm />
              <p className="mt-6 text-[0.9375rem] text-[var(--slot4-muted-text)]">
                New here?{' '}
                <Link href="/signup" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                  {pagesContent.auth.login.createCta}
                </Link>
              </p>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
