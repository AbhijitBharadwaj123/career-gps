import React from 'react'

export default function ExplorationOption({ option, isExplored, onExplore }) {
  const evidenceId = `evidence-${option.id}`

  return (
    <article className={`overflow-hidden rounded-[1.5rem] border bg-white/85 shadow-card transition-colors duration-300 ${isExplored ? 'border-accent/25' : 'border-line hover:border-accent/25'}`}>
      <button
        type="button"
        onClick={() => onExplore(option.id)}
        className="flex w-full items-center justify-between gap-5 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:p-6"
        aria-expanded={isExplored}
        aria-controls={evidenceId}
      >
        <span>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">{option.label}</span>
          <span className="mt-2 block font-display text-xl leading-tight tracking-[-0.025em] text-ink sm:text-2xl">{option.title}</span>
        </span>
        <span className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide ${isExplored ? 'bg-sage text-accent' : 'border border-line text-muted'}`}>
          {isExplored ? 'Explored' : 'Explore'}
        </span>
      </button>

      {isExplored && (
        <div id={evidenceId} className="border-t border-line/80 bg-[#FCFCF9] px-5 pb-6 pt-5 sm:px-6 sm:pb-7">
          <p className="font-semibold leading-7 text-ink">{option.evidence.summary}</p>

          {option.evidence.bullets && (
            <ul className="mt-4 space-y-2.5 pl-5 text-[15px] leading-7 text-muted marker:text-accent/55">
              {option.evidence.bullets.map((item) => <li key={item} className="pl-1">{item}</li>)}
            </ul>
          )}

          {option.evidence.sections && (
            <div className="mt-5 space-y-5">
              {option.evidence.sections.map((section) => (
                <section key={section.title} className="rounded-xl border border-line/80 bg-white/70 p-4">
                  <h3 className="font-display text-lg tracking-[-0.02em] text-ink">{section.title}</h3>
                  <ul className="mt-3 space-y-2 pl-5 text-sm leading-6 text-muted marker:text-accent/55">
                    {section.bullets.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </section>
              ))}
            </div>
          )}

          {option.evidence.quotes && (
            <div className="mt-5 space-y-3 border-l-2 border-sage pl-4 text-[15px] italic leading-7 text-muted">
              {option.evidence.quotes.map((quote) => <blockquote key={quote}>“{quote}”</blockquote>)}
            </div>
          )}

          {option.evidence.signal && (
            <p className="mt-5 border-t border-line/80 pt-4 text-sm font-semibold leading-6 text-accent">{option.evidence.signal}</p>
          )}
        </div>
      )}
    </article>
  )
}
