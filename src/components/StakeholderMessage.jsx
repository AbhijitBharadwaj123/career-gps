import React from 'react'

export default function StakeholderMessage({ stakeholder, message }) {
  return (
    <aside className="rounded-[1.75rem] border border-accent/15 bg-sage/50 p-5 shadow-card sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Workplace message</p>
      <p className="mt-4 font-semibold text-ink">{stakeholder}</p>
      <div className="mt-4 space-y-3 font-display text-xl leading-8 tracking-[-0.02em] text-ink sm:text-2xl sm:leading-9">
        {message.map((paragraph) => <p key={paragraph}>“{paragraph}”</p>)}
      </div>
    </aside>
  )
}
