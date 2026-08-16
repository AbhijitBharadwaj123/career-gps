import React from 'react'
import { siteConfig } from '../config/site'

const linkClasses = 'font-semibold text-accent underline decoration-accent/30 underline-offset-4 transition hover:text-accent-dark focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white'

export default function About() {
  return (
    <section className="border-t border-line bg-white/45 px-6 py-7 sm:px-8 lg:px-10" aria-label="Career GPS philosophy and contact">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm leading-6 text-muted md:flex-row md:items-center md:justify-between md:gap-8">
        <p className="max-w-3xl italic">Career GPS is an experiment in making career decisions more experiential, reversible, and human.</p>
        <p className="md:shrink-0">
          <span>Built with ChatGPT + Codex</span>
          <span className="mx-2 text-line" aria-hidden="true">·</span>
          {siteConfig.linkedInUrl && (
            <>
              <a href={siteConfig.linkedInUrl} target="_blank" rel="noreferrer" className={linkClasses}>LinkedIn</a>
              <span className="mx-2 text-line" aria-hidden="true">·</span>
            </>
          )}
          <span>Reach me: </span>
          <a href="mailto:bharadwaj.abhijit@gmail.com" className={linkClasses}>bharadwaj.abhijit@gmail.com</a>
        </p>
      </div>
    </section>
  )
}
