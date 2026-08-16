import React from 'react'

export default function SelectionCard({ title, description, tradeOff, selected, onSelect, label }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full rounded-[1.35rem] border p-5 text-left shadow-card transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-3 sm:p-6 ${selected ? 'border-accent/40 bg-sage/55' : 'border-line bg-white/80 hover:border-accent/30 hover:bg-white'}`}
    >
      {label && <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">{label}</span>}
      <span className="block font-display text-xl leading-tight tracking-[-0.025em] text-ink sm:text-2xl">{title}</span>
      {description && <span className="mt-3 block text-[15px] leading-7 text-muted">{description}</span>}
      {tradeOff && <span className="mt-3 block border-t border-line/70 pt-3 text-sm leading-6 text-accent">{tradeOff}</span>}
    </button>
  )
}
