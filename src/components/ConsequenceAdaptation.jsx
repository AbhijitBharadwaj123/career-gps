import React from 'react'
import SelectionCard from './SelectionCard'
import VoiceInputButton from './VoiceInputButton'

export default function ConsequenceAdaptation({ consequence, state, onSelect, onCustomChange }) {
  return (
    <section className="mt-10 border-t border-line pt-10" aria-labelledby="consequence-heading">
      <div className="rounded-[1.75rem] border border-accent/20 bg-white/80 p-6 shadow-card sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{consequence.eyebrow}</p>
        <h2 id="consequence-heading" className="mt-3 font-display text-[1.8rem] leading-[1.15] tracking-[-0.035em] text-ink sm:text-[2.2rem]">
          {consequence.heading}
        </h2>
        <div className="mt-6 space-y-3 text-[15px] leading-7 text-muted">
          {consequence.statements.map((statement) => <p key={statement}>{statement}</p>)}
        </div>
      </div>

      <div className="mt-9">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Adapt</p>
        <h2 className="mt-3 font-display text-3xl tracking-[-0.035em] text-ink">{consequence.prompt}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{consequence.supportingCopy}</p>

        <div className="mt-5 space-y-3" aria-label="Adaptation options">
          {consequence.adaptations.map((option) => (
            <SelectionCard
              key={option.id}
              title={option.title}
              description={option.description}
              tradeOff={option.tradeOff}
              selected={state.adaptationId === option.id}
              onSelect={() => onSelect(option.id)}
            />
          ))}
        </div>

        <div className={`mt-3 rounded-[1.35rem] border p-5 sm:p-6 ${state.adaptationId === 'custom' ? 'border-accent/40 bg-sage/45' : 'border-line bg-white/70'}`}>
          <label htmlFor="custom-adaptation" className="font-display text-xl tracking-[-0.025em] text-ink sm:text-2xl">I’d adapt differently</label>
          <textarea
            id="custom-adaptation"
            value={state.customAdaptation}
            onFocus={() => onSelect('custom')}
            onChange={(event) => onCustomChange(event.target.value)}
            placeholder="What would you do next?"
            rows={3}
            className="mt-4 w-full resize-y rounded-2xl border border-line bg-white/85 p-4 text-sm leading-6 text-ink outline-none placeholder:text-muted/65 focus:border-accent focus:ring-2 focus:ring-accent/15"
          />
          <div className="mt-4">
            <VoiceInputButton value={state.customAdaptation} label="your adaptation" onChange={onCustomChange} />
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-muted">There is no right recovery path. Your choice is used only to make the reflection more specific.</p>
      </div>
    </section>
  )
}
