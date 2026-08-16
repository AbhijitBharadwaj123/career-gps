import React, { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import Brand from '../components/Brand'
import ChoiceChips from '../components/ChoiceChips'
import SelectionCard from '../components/SelectionCard'
import SimulationProgress from '../components/SimulationProgress'
import { getSimulation } from '../data/simulations'
import { useTrackSimulationStage, useTransitionSimulation } from '../state/SimulationState'

export default function SimulationDecide() {
  const customDecisionInputRef = useRef(null)
  const { transitionId } = useParams()
  const simulation = getSimulation(transitionId)
  const { state, setField, toggleValue } = useTransitionSimulation(transitionId)
  useTrackSimulationStage(transitionId, 'decide', Boolean(simulation))
  if (!simulation) return null
  const { transitionLabel, routes, explore, decide } = simulation
  const exploredOptions = state.exploredIds
    .map((id) => explore.options.find((option) => option.id === id))
    .filter(Boolean)
  const hasDecision = Boolean(state.decisionId) && (state.decisionId !== 'custom' || (state.customDecisionCaptured && state.customDecision.trim()))
  const hasReason = state.decisionReasons.length > 0

  const selectDecision = (decisionId) => {
    if (state.decisionId !== decisionId) {
      setField('decisionId', decisionId)
      setField('responseId', '')
      setField('customResponse', '')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute -right-44 top-24 h-[34rem] w-[34rem] rounded-full bg-sage/40 blur-3xl" aria-hidden="true" />
      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
        <Brand />
        <p className="hidden text-xs font-medium tracking-wide text-muted sm:block">CHOOSE A DIRECTION</p>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-12 lg:px-10 lg:pb-24">
        <SimulationProgress currentStage="decide" />

        <div className="mx-auto mt-10 max-w-4xl lg:mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{decide.eyebrow}</p>
          <p className="mt-4 text-sm font-medium text-muted">{transitionLabel}</p>
          <h1 className="mt-5 max-w-3xl font-display text-[2.65rem] leading-[1.06] tracking-[-0.045em] sm:text-6xl lg:text-[3.5rem]">{decide.heading}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{decide.supportingCopy}</p>

          <section className="mt-10 rounded-[1.5rem] border border-line bg-white/65 p-5 sm:p-6" aria-labelledby="evidence-summary-heading">
            <h2 id="evidence-summary-heading" className="text-sm font-semibold text-ink">{decide.evidenceHeading}</h2>
            <ul className="mt-4 space-y-2.5 pl-5 text-[15px] leading-7 text-muted marker:text-accent/55">
              {exploredOptions.map((option) => <li key={option.id} className="pl-1">{option.decisionSummary}</li>)}
            </ul>
          </section>

          <section className="mt-10 space-y-3" aria-label="Decision options">
            {decide.options.map((option) => (
              <SelectionCard
                key={option.id}
                title={option.title}
                description={option.description}
                tradeOff={option.tradeOff}
                selected={state.decisionId === option.id}
                onSelect={() => selectDecision(option.id)}
              />
            ))}

            <SelectionCard
              title={decide.customLabel}
              description={decide.customDescription || 'Write a short direction in your own words.'}
              selected={state.decisionId === 'custom'}
              onSelect={() => selectDecision('custom')}
            />

            {state.decisionId === 'custom' && (
              <div className="rounded-[1.35rem] border border-accent/25 bg-sage/45 p-5 shadow-card sm:p-6">
                {state.customDecisionCaptured ? (
                  <div aria-live="polite">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Your approach</p>
                    <p className="mt-3 whitespace-pre-wrap font-display text-xl leading-8 tracking-[-0.02em] text-ink sm:text-2xl">{state.customDecision}</p>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <p className="text-sm leading-6 text-muted">Saved on this device for this scenario.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setField('customDecisionCaptured', false)
                          window.requestAnimationFrame(() => customDecisionInputRef.current?.focus())
                        }}
                        className="inline-flex min-h-10 items-center justify-center rounded-full border border-line bg-white/80 px-4 text-sm font-semibold text-ink transition hover:border-accent/35 hover:text-accent"
                      >
                        Edit my approach
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="custom-decision" className="font-display text-xl tracking-[-0.025em] text-ink sm:text-2xl">{decide.customPrompt || 'What would you ask the team to do?'}</label>
                    <textarea
                      ref={customDecisionInputRef}
                      id="custom-decision"
                      value={state.customDecision}
                      onChange={(event) => {
                        setField('customDecision', event.target.value)
                        setField('customDecisionCaptured', false)
                      }}
                      placeholder={decide.customPlaceholder}
                      rows={3}
                      className="mt-4 w-full resize-y rounded-2xl border border-line bg-white/85 p-4 text-sm leading-6 text-ink outline-none placeholder:text-muted/65 focus:border-accent focus:ring-2 focus:ring-accent/15"
                    />
                    <button
                      type="button"
                      disabled={!state.customDecision.trim()}
                      onClick={() => setField('customDecisionCaptured', true)}
                      className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
                    >
                      Use this approach
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {hasDecision && (
            <section className="mt-10 border-t border-line pt-9">
              <h2 className="font-display text-3xl tracking-[-0.035em] text-ink">{decide.reasonHeading}</h2>
              <div className="mt-5">
                <ChoiceChips options={decide.reasons} selected={state.decisionReasons} onToggle={(value) => toggleValue('decisionReasons', value)} />
              </div>
              {state.decisionReasons.includes('Something else') && (
                <input
                  value={state.customReason}
                  onChange={(event) => setField('customReason', event.target.value)}
                  placeholder={decide.customReasonPlaceholder}
                  className="mt-4 min-h-11 w-full rounded-full border border-line bg-white/80 px-5 text-sm text-ink outline-none placeholder:text-muted/65 focus:border-accent focus:ring-2 focus:ring-accent/15"
                />
              )}
            </section>
          )}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to={routes.respond}
              aria-disabled={!hasDecision || !hasReason}
              onClick={(event) => (!hasDecision || !hasReason) && event.preventDefault()}
              className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition ${hasDecision && hasReason ? 'bg-ink text-white shadow-card hover:bg-accent-dark' : 'cursor-not-allowed bg-line/70 text-muted'}`}
            >
              {decide.cta}<span aria-hidden="true">→</span>
            </Link>
            <Link to={routes.explore} className="inline-flex min-h-11 items-center justify-center px-4 text-sm font-semibold text-muted hover:text-accent">Back to the signals</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
