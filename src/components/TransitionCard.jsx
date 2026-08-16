import React from 'react'
import { Link } from 'react-router-dom'

export default function TransitionCard({ transition }) {
  return (
    <article className="group flex min-h-[290px] flex-col rounded-[1.75rem] border border-line bg-white/80 p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lift sm:p-8 lg:p-7 xl:p-8 motion-reduce:transform-none">
      <div className="flex justify-end">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-accent/50 transition duration-300 group-hover:translate-x-1 group-hover:text-accent motion-reduce:transform-none" aria-hidden="true">
          <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-[1.75rem] leading-tight tracking-[-0.04em] text-ink sm:text-[2rem] lg:flex-nowrap lg:text-[clamp(1.4rem,2.15vw,1.75rem)] lg:whitespace-nowrap">
        <span>{transition.currentRole}</span>
        <span className="font-sans text-xl font-normal text-accent" aria-hidden="true">→</span>
        <span>{transition.futureRole}</span>
      </div>
      <p className="mt-5 max-w-md text-[15px] leading-7 text-muted lg:text-sm xl:max-w-none xl:whitespace-nowrap xl:text-[0.875rem]">{transition.description}</p>

      <Link
        to={transition.path}
        className="mt-auto inline-flex w-fit items-center gap-2 border-b border-ink/30 pb-1 pt-8 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
        aria-label={`Simulate the transition from ${transition.currentRole} to ${transition.futureRole}`}
      >
        Simulate this transition
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}
