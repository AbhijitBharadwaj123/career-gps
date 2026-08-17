import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Brand from '../components/Brand'
import ChoiceChips from '../components/ChoiceChips'
import ConsequenceAdaptation from '../components/ConsequenceAdaptation'
import SelectionCard from '../components/SelectionCard'
import SimulationProgress from '../components/SimulationProgress'
import StakeholderMessage from '../components/StakeholderMessage'
import VoiceInputButton from '../components/VoiceInputButton'
import { getSimulation } from '../data/simulations'
import { useTrackSimulationStage, useTransitionSimulation } from '../state/SimulationState'

export default function SimulationRespond() {
  const { transitionId } = useParams()
  const simulation = getSimulation(transitionId)
  const { state, setField } = useTransitionSimulation(transitionId)
  useTrackSimulationStage(transitionId, 'respond', Boolean(simulation))
  if (!simulation) return null
  const { transitionLabel, routes, decide, respond } = simulation
  const branch = respond.branches[state.decisionId] || respond.branches.custom
  const selectedDecision = decide.options.find((option) => option.id === state.decisionId)
  const intentionOptions = respond.intentOptions || []
  const consequence = respond.consequences?.[state.decisionId] || respond.consequences?.custom
  const hasConsequence = Boolean(consequence)
  const hasResponse = Boolean(state.responseId) && (state.responseId !== 'custom' || state.customResponse.trim())
  const hasRequiredIntention = intentionOptions.length === 0 || state.responseIntentions.length > 0
  const canRevealConsequence = hasResponse && hasRequiredIntention
  const hasAdaptation = Boolean(state.adaptationId)
    && (state.adaptationId !== 'custom' || state.customAdaptation.trim())
  const canContinue = hasConsequence ? state.consequenceRevealed && hasAdaptation : canRevealConsequence

  const resetConsequence = () => {
    setField('consequenceRevealed', false)
    setField('adaptationId', '')
    setField('customAdaptation', '')
  }

  const selectResponse = (responseId) => {
    if (state.responseId === responseId) return
    setField('responseId', responseId)
    setField('responseIntentions', [])
    resetConsequence()
  }

  const selectAdaptation = (adaptationId) => {
    setField('adaptationId', adaptationId)
    if (adaptationId !== 'custom') setField('customAdaptation', '')
  }

  const toggleIntention = (intentionId) => {
    const selected = state.responseIntentions || []
    if (selected.includes(intentionId)) {
      setField('responseIntentions', selected.filter((id) => id !== intentionId))
      return
    }
    if (selected.length < 2) setField('responseIntentions', [...selected, intentionId])
  }

  if (!state.decisionId) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas px-6 text-center text-ink">
        <div><h1 className="font-display text-4xl">Choose a direction first.</h1><Link to={routes.decide} className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Go to Decide</Link></div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute -left-40 top-28 h-[32rem] w-[32rem] rounded-full bg-sage/40 blur-3xl" aria-hidden="true" />
      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10"><Brand /><p className="hidden text-xs font-medium tracking-wide text-muted sm:block">OWN THE TRADE-OFF</p></header>

      <main className="relative mx-auto max-w-6xl px-6 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-12 lg:px-10 lg:pb-24">
        <SimulationProgress currentStage="respond" />
        <section className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-14">
          <div className="lg:sticky lg:top-10">
            <p className="text-sm font-medium text-muted">{transitionLabel}</p>
            <h1 className="mt-5 font-display text-[2.7rem] leading-[1.06] tracking-[-0.045em] sm:text-6xl lg:text-[3.5rem]">{respond.heading}</h1>
            <p className="mt-6 text-base leading-7 text-muted">{respond.supportingCopy}</p>
            <div className="mt-7 rounded-2xl border border-line bg-white/60 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">Your direction</p>
              <p className="mt-2 text-sm font-medium leading-6 text-ink">{selectedDecision?.title || state.customDecision}</p>
            </div>
          </div>

          <div>
            <StakeholderMessage stakeholder={branch.stakeholder} message={branch.message} />
            <section className="mt-9">
              <h2 className="font-display text-3xl tracking-[-0.035em] text-ink">{respond.prompt}</h2>
              <div className="mt-5 space-y-3">
                {branch.responses.map((option) => (
                  <SelectionCard key={option.id} title={option.title} description={option.description} selected={state.responseId === option.id} onSelect={() => selectResponse(option.id)} />
                ))}
              </div>

              <div className={`mt-3 rounded-[1.35rem] border p-5 sm:p-6 ${state.responseId === 'custom' ? 'border-accent/40 bg-sage/45' : 'border-line bg-white/70'}`}>
                <label htmlFor="custom-response" className="font-display text-xl tracking-[-0.025em] text-ink sm:text-2xl">{respond.customLabel}</label>
                <textarea
                  id="custom-response"
                  value={state.customResponse}
                  onFocus={() => selectResponse('custom')}
                  onChange={(event) => {
                    selectResponse('custom')
                    setField('customResponse', event.target.value)
                    resetConsequence()
                  }}
                  placeholder={respond.customPlaceholder}
                  rows={4}
                  className="mt-4 w-full resize-y rounded-2xl border border-line bg-white/85 p-4 text-sm leading-6 text-ink outline-none placeholder:text-muted/65 focus:border-accent focus:ring-2 focus:ring-accent/15"
                />
                <div className="mt-4">
                  <VoiceInputButton
                    value={state.customResponse}
                    label="your response"
                    onChange={(nextValue) => {
                      selectResponse('custom')
                      setField('customResponse', nextValue)
                      resetConsequence()
                    }}
                  />
                </div>
              </div>
            </section>

            {hasResponse && intentionOptions.length > 0 && (
              <section className="mt-9 rounded-[1.5rem] border border-accent/15 bg-sage/45 p-5 sm:p-6" aria-labelledby="response-intention-heading">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Your intention</p>
                <h2 id="response-intention-heading" className="mt-3 font-display text-2xl leading-8 tracking-[-0.03em] text-ink sm:text-3xl">{respond.intentHeading}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{respond.intentSupportingCopy}</p>
                <div className="mt-5">
                  <ChoiceChips options={intentionOptions} selected={state.responseIntentions || []} onToggle={toggleIntention} />
                </div>
                <p className="mt-4 text-xs leading-5 text-muted">{state.responseIntentions.length}/2 selected · Your response stays editable and is not scored.</p>
              </section>
            )}

            {hasConsequence && !state.consequenceRevealed && (
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  disabled={!canRevealConsequence}
                  onClick={() => setField('consequenceRevealed', true)}
                  className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition ${canRevealConsequence ? 'bg-ink text-white shadow-card hover:bg-accent-dark' : 'cursor-not-allowed bg-line/70 text-muted'}`}
                >
                  {respond.consequenceCta || 'See what happens next'}<span aria-hidden="true">→</span>
                </button>
                <Link to={routes.decide} className="inline-flex min-h-11 items-center justify-center px-4 text-sm font-semibold text-muted hover:text-accent">Back to the decision</Link>
              </div>
            )}

            {hasConsequence && state.consequenceRevealed && (
              <ConsequenceAdaptation
                consequence={consequence}
                state={state}
                onSelect={selectAdaptation}
                onCustomChange={(value) => {
                  setField('adaptationId', 'custom')
                  setField('customAdaptation', value)
                }}
              />
            )}

            {(!hasConsequence || state.consequenceRevealed) && (
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to={routes.reflect} aria-disabled={!canContinue} onClick={(event) => !canContinue && event.preventDefault()} className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition ${canContinue ? 'bg-ink text-white shadow-card hover:bg-accent-dark' : 'cursor-not-allowed bg-line/70 text-muted'}`}>{respond.cta}<span aria-hidden="true">→</span></Link>
                <Link to={routes.decide} className="inline-flex min-h-11 items-center justify-center px-4 text-sm font-semibold text-muted hover:text-accent">Back to the decision</Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
