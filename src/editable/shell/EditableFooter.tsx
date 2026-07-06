'use client'

import Link from 'next/link'
import { ArrowUpRight, Twitter, Instagram, Linkedin, Github, Mail } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { getTaskDisplayLabel } from '@/editable/content/tasks.config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Montera-inspired dark multi-column footer.

  - Brand column: logo, description, socials.
  - Discovery column: renamed task categories (footer keeps this — nav does not).
  - Resources column: About, Contact, Search, etc.
  - Account column: Sign in / Get started or Submit / Logout.
  - Bottom CTA strip: full-bleed neon-pear band linking to Submit / Contact.
  - Fine hairline dividers, © line.
*/
export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const description =
    globalContent.footer?.description ||
    SITE_CONFIG.description ||
    `Discover local businesses and download reference material from ${SITE_CONFIG.name}.`

  const socials = []

  return (
    <footer className="bg-[var(--slot4-dark-bg)] text-white">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-[85rem] gap-6 px-5 py-14 sm:px-8 lg:grid-cols-[1.35fr_auto] lg:items-center lg:gap-16 lg:px-10 lg:py-20">
          <h2 className="editable-display-tight max-w-3xl text-[2.125rem] font-semibold tracking-[-0.045em] sm:text-[3rem] lg:text-[3.75rem] lg:leading-[1.02]">
            Have something to add to {SITE_CONFIG.name}?
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={session ? '/create' : '/signup'}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-secondary)] pl-6 pr-2 py-2 text-[1rem] font-medium text-[var(--slot4-on-secondary)] transition duration-300 hover:bg-white"
            >
              {session ? 'Submit a listing' : 'Get started'}
              <span className="editable-arrow-chip bg-[var(--slot4-dark-bg)] text-white">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full border border-white/25 pl-6 pr-2 py-2 text-[1rem] font-medium text-white transition duration-300 hover:border-white hover:bg-white/5"
            >
              Contact us
              <span className="editable-arrow-chip bg-white text-[var(--slot4-dark-bg)]">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="mx-auto grid max-w-[85rem] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-14 lg:px-10 lg:py-20">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center">
              <img
                src="/favicon.png?v=20260413"
                alt={SITE_CONFIG.name}
                className="h-10 w-10 object-contain"
              />
            </span>
            <span className="editable-display text-[1.375rem] font-semibold tracking-[-0.03em]">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <p className="mt-6 max-w-md text-[0.9375rem] leading-[1.6] text-white/60">{description}</p>
          
        </div>

        {/* Discovery — the ONLY place task labels live outside archive pages */}
        <div>
          <h3 className="editable-eyebrow text-white/50">Discover</h3>
          <ul className="mt-6 grid gap-3">
            {taskLinks.map((task) => (
              <li key={task.key}>
                <Link
                  href={task.route}
                  className="inline-flex items-center gap-1 text-[0.9375rem] font-medium text-white/80 transition duration-300 hover:text-white"
                >
                  {getTaskDisplayLabel(task.key, task.label)}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="editable-eyebrow text-white/50">Resources</h3>
          <ul className="mt-6 grid gap-3">
            {[
              ['About', '/about'],
              ['Contact', '/contact'],
              ['Search', '/search'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href as string}
                  className="text-[0.9375rem] font-medium text-white/80 transition duration-300 hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="editable-eyebrow text-white/50">Account</h3>
          <ul className="mt-6 grid gap-3">
            {session ? (
              <>
                <li>
                  <Link href="/create" className="text-[0.9375rem] font-medium text-white/80 transition duration-300 hover:text-white">
                    Submit
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-left text-[0.9375rem] font-medium text-white/80 transition duration-300 hover:text-white"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="text-[0.9375rem] font-medium text-white/80 transition duration-300 hover:text-white">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-[0.9375rem] font-medium text-white/80 transition duration-300 hover:text-white">
                    Get started
                  </Link>
                </li>
              </>
            )}
            <li>
              
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[85rem] flex-col items-center justify-between gap-3 px-5 py-6 text-[0.8125rem] text-white/50 sm:flex-row sm:px-8 lg:px-10">
          <span>© {year} {SITE_CONFIG.name}. All rights reserved.</span>
          <span className="text-white/45">
            {globalContent.footer?.bottomNote || 'Built for local discovery and downloadable reference material.'}
          </span>
        </div>
      </div>
    </footer>
  )
}
