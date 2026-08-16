import React from 'react'

export default function OutcomeCard({ title, description, children }) {
  return (
    <article className="flex flex-col rounded-[1.5rem] border border-line bg-white/80 p-5 shadow-card sm:p-6">
      <h2 className="font-display text-2xl leading-tight tracking-[-0.03em] text-ink">{title}</h2>
      {description && <p className="mt-3 text-[15px] leading-7 text-muted">{description}</p>}
      {children && <div className="mt-5">{children}</div>}
    </article>
  )
}
