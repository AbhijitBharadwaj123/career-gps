import React from 'react'

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 text-center sm:px-8 sm:pb-32 sm:pt-24 lg:pt-28">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-accent sm:text-sm">
          Explore before you commit
        </p>
        <h1 className="font-display text-[2.75rem] leading-[1.04] tracking-[-0.045em] text-ink sm:text-6xl sm:leading-[1.02] lg:text-[3.75rem]">
          Before you commit to your next career move, simulate it.
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted sm:mt-8 sm:text-lg sm:leading-8">
          Experience the decisions, trade-offs and moments that make up the job — before spending months trying to get it.
        </p>
        <a
          href="#transitions"
          className="group mt-9 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-card transition duration-300 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas motion-reduce:transform-none"
        >
          Explore a career
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transform-none" aria-hidden="true">
            <path d="M10 3v13m0 0 5-5m-5 5-5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
      <p className="mt-16 text-sm text-muted/80 sm:mt-20">A safe place to explore possible futures.</p>
    </section>
  )
}
