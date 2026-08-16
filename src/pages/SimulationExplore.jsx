import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Brand from '../components/Brand'
import ExplorationOption from '../components/ExplorationOption'
import SimulationProgress from '../components/SimulationProgress'
import { getSimulation } from '../data/simulations'
import { useTrackSimulationStage, useTransitionSimulation } from '../state/SimulationState'

export default function SimulationExplore() {
  const { transitionId } = useParams()
  const simulation = getSimulation(transitionId)
  const [questionDraft, setQuestionDraft] = useState('')
  const { state, addUnique, setField } = useTransitionSimulation(transitionId)
  useTrackSimulationStage(transitionId, 'explore', Boolean(simulation))
  if (!simulation) return null
  const { transitionLabel, routes, explore } = simulation

  const exploreSignal = (optionId) => {
    addUnique('exploredIds', optionId)
  }

  const saveQuestion = (event) => {
    event.preventDefault()
    if (!questionDraft.trim()) return

    setField('savedQuestions', [...state.savedQuestions, questionDraft])
    setQuestionDraft('')
  }

  const removeQuestion = (questionIndex) => {
    setField('savedQuestions', state.savedQuestions.filter((_, index) => index !== questionIndex))
  }

  const hasExplored = state.exploredIds.length > 0

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute -left-48 top-32 h-[32rem] w-[32rem] rounded-full bg-sage/40 blur-3xl" aria-hidden="true" />

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
        <Brand />
        <p className="hidden text-xs font-medium tracking-wide text-muted sm:block">FOLLOW YOUR CURIOSITY</p>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-12 lg:px-10 lg:pb-24">
        <SimulationProgress currentStage="explore" />

        <section className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-14">
          <div className="lg:sticky lg:top-10">
            <p className="text-sm font-medium text-muted">{transitionLabel}</p>
            <h1 className="mt-5 max-w-lg font-display text-[2.7rem] leading-[1.05] tracking-[-0.045em] text-ink sm:text-6xl lg:text-[3.5rem]">
              {explore.heading}
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted">{explore.supportingCopy}</p>
          </div>

          <div>
            <div id="signals" className="space-y-3 scroll-mt-8">
              {explore.options.map((option) => (
                <ExplorationOption
                  key={option.id}
                  option={option}
                  isExplored={state.exploredIds.includes(option.id)}
                  onExplore={exploreSignal}
                />
              ))}
            </div>

            <aside className="mt-8 border-t border-line pt-7">
              <form onSubmit={saveQuestion}>
                <label htmlFor="custom-question" className="text-sm font-semibold text-ink">{explore.customQuestion.heading}</label>
                {explore.customQuestion.supportingCopy && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{explore.customQuestion.supportingCopy}</p>}
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="custom-question"
                    value={questionDraft}
                    onChange={(event) => setQuestionDraft(event.target.value)}
                    placeholder={explore.customQuestion.placeholder}
                    className="min-h-12 min-w-0 flex-1 rounded-full border border-line bg-white/75 px-5 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/15"
                  />
                  <button
                    type="submit"
                    disabled={!questionDraft.trim()}
                    className="min-h-12 rounded-full border border-line bg-white/80 px-5 text-sm font-semibold text-ink transition hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {explore.customQuestion.submitLabel || 'Save question'}
                  </button>
                </div>
              </form>

              {state.savedQuestions.length > 0 && (
                <div className="mt-6" aria-live="polite">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">{explore.customQuestion.savedLabel}</p>
                  <ul className="mt-3 space-y-2">
                    {state.savedQuestions.map((question, index) => (
                      <li key={`${question}-${index}`} className="flex items-start justify-between gap-4 rounded-xl border border-line bg-white/60 px-4 py-3 text-sm leading-6 text-muted">
                        <span className="min-w-0 break-words">{question}</span>
                        <button type="button" onClick={() => removeQuestion(index)} aria-label={`Remove question: ${question}`} className="shrink-0 text-xs font-semibold text-muted underline decoration-muted/30 underline-offset-4 hover:text-[#7A3F38]">Remove</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>

            {hasExplored && (
              <div className="mt-8 rounded-[1.5rem] border border-accent/15 bg-sage/45 p-5 sm:p-6">
                <Link
                  to={routes.decide}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-card transition duration-300 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 motion-reduce:transform-none"
                >
                  {explore.continueLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
