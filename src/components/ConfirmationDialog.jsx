import React from 'react'

export default function ConfirmationDialog({ open, title, description, confirmLabel, cancelLabel, onConfirm, onCancel, destructive = false }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/35 p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="w-full max-w-md rounded-[1.75rem] border border-line bg-canvas p-6 shadow-lift sm:p-8" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
        <h2 id="confirmation-title" className="font-display text-3xl tracking-[-0.035em] text-ink">{title}</h2>
        <p className="mt-4 text-[15px] leading-7 text-muted">{description}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onConfirm} className={`min-h-11 rounded-full px-5 text-sm font-semibold text-white ${destructive ? 'bg-[#7A3F38] hover:bg-[#65332E]' : 'bg-ink hover:bg-accent-dark'}`}>{confirmLabel}</button>
          <button type="button" autoFocus onClick={onCancel} className="min-h-11 rounded-full border border-line bg-white px-5 text-sm font-semibold text-muted hover:text-ink">{cancelLabel}</button>
        </div>
      </section>
    </div>
  )
}
