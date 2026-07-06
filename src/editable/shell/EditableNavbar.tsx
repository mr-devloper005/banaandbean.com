'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Montera-inspired sticky navbar.

  IMPORTANT RULES (from redesign brief):
  - No task-archive links in the nav. Only About + Contact (non-task static pages).
  - Right side: search icon → /search, then auth actions.
  - Mobile menu mirrors same links — no task labels.
*/
export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const staticLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[76px] w-full max-w-[85rem] items-center gap-6 px-5 sm:px-8 lg:px-10">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] transition duration-500 group-hover:rotate-[15deg] group-hover:bg-[var(--slot4-accent)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
          </span>
          <span className="editable-display text-[1.125rem] font-semibold tracking-[-0.03em]">{SITE_CONFIG.name}</span>
        </Link>

        <div className="mx-auto hidden items-center gap-1 lg:flex">
          {staticLinks.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-[0.9375rem] font-medium tracking-[-0.01em] transition duration-300 ${
                  active
                    ? 'bg-[var(--slot4-dark-bg)] text-white'
                    : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)]/6'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)] transition duration-300 hover:-translate-y-[1px] hover:border-[var(--slot4-page-text)]"
          >
            <Search className="h-4 w-4" />
          </Link>
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] pl-5 pr-2 py-2 text-[0.9375rem] font-medium text-white transition duration-300 hover:bg-[var(--slot4-accent)] sm:inline-flex"
              >
                Submit
                <span className="editable-arrow-chip bg-white text-[var(--slot4-page-text)]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center rounded-full border border-[var(--editable-border)] px-4 py-2 text-[0.875rem] font-medium text-[var(--slot4-muted-text)] transition duration-300 hover:border-[var(--slot4-page-text)] hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center rounded-full border border-[var(--editable-border)] px-4 py-2 text-[0.9375rem] font-medium text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] pl-5 pr-2 py-2 text-[0.9375rem] font-medium text-white transition duration-300 hover:bg-[var(--slot4-accent)] sm:inline-flex"
              >
                Get started
                <span className="editable-arrow-chip bg-white text-[var(--slot4-page-text)]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-5 lg:hidden">
          <div className="grid gap-1">
            {[
              { label: 'Home', href: '/' },
              ...staticLinks,
              ...(session
                ? [{ label: 'Submit', href: '/create' }]
                : [
                    { label: 'Sign in', href: '/login' },
                    { label: 'Get started', href: '/signup' },
                  ]),
            ].map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-full px-4 py-3 text-[0.9375rem] font-medium tracking-[-0.01em] ${
                    active
                      ? 'bg-[var(--slot4-dark-bg)] text-white'
                      : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)]/6'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <button
                type="button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="rounded-full px-4 py-3 text-left text-[0.9375rem] font-medium text-[var(--slot4-muted-text)]"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
