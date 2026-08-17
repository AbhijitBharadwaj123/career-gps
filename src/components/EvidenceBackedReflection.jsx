import React from 'react'

export default function EvidenceBackedReflection({ reflection }) {
  return (
    <section className="mt-10" aria-label="Evidence-backed reflection">
      <article className="rounded-[1.5rem] border border-line bg-white/80 p-5 shadow-card sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">What you did</p>
        <ul className="mt-4 space-y-3 pl-5 text-[15px] leading-7 text-muted marker:text-accent/55">
          {reflection.evidence.map((item) => <li key={item} className="pl-1">{item}</li>)}
        </ul>
      </article>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <article className="rounded-[1.5rem] border border-accent/15 bg-sage/55 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">What that may suggest</p>
          <p className="mt-4 font-display text-xl leading-8 tracking-[-0.02em] text-ink sm:text-2xl">{reflection.suggestion}</p>
          {reflection.supportingSuggestion && <p className="mt-4 text-sm leading-7 text-muted">{reflection.supportingSuggestion}</p>}
        </article>

        <article className="rounded-[1.5rem] border border-line bg-white/75 p-5 shadow-card sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">A tension to explore</p>
          <p className="mt-4 font-display text-xl leading-8 tracking-[-0.02em] text-ink sm:text-2xl">{reflection.tension}</p>
        </article>

        <article className="rounded-[1.5rem] border border-line bg-white/75 p-5 shadow-card sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">What remains uncertain</p>
          <p className="mt-4 text-[15px] leading-7 text-muted">{reflection.uncertainty}</p>
        </article>

        <article className="rounded-[1.5rem] border border-accent/15 bg-sage/40 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Try this outside the simulation</p>
          <p className="mt-4 text-[15px] leading-7 text-ink/85">{reflection.experiment}</p>
        </article>
      </div>

      <div className="mt-4 rounded-2xl border border-line/80 bg-white/45 px-4 py-3.5 sm:px-5">
        <p className="text-xs leading-5 text-muted"><span className="font-semibold text-ink/75">How this reflection was formed:</span> {reflection.methodology}</p>
      </div>
    </section>
  )
}
