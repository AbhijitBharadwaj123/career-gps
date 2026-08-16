import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'
import CareerSnapshot from '../components/CareerSnapshot'
import ConfirmationDialog from '../components/ConfirmationDialog'
import { getTransitionSimulations, simulations } from '../data/simulations'
import { useSimulationState } from '../state/SimulationState'

const resumeStages = {
  explore: { label: 'Explore', routeKey: 'explore' },
  decide: { label: 'Decide', routeKey: 'decide' },
  respond: { label: 'Respond', routeKey: 'respond' },
  reflect: { label: 'Reflect', routeKey: 'reflect' },
  'future-feeling': { label: 'How did that future feel?', routeKey: 'futureFeeling' },
  'next-experiment': { label: 'Choose what to test next', routeKey: 'nextExperiment' },
}

const continuationOutcomes = new Set(['explore-more', 'unsure', 'keep-exploring', 'still-unsure'])
const mindsetByOutcome = {
  'explore-more': 'explore-more',
  'keep-exploring': 'explore-more',
  unsure: 'unsure',
  'still-unsure': 'unsure',
}

export default function MyFutures() {
  const { activeSimulations, savedFutures, clearAllCareerGpsData } = useSimulationState()
  const [clearOpen, setClearOpen] = useState(false)
  const resumes = Object.entries(activeSimulations).map(([transitionId, state]) => {
    const simulation = simulations[transitionId]
    const stage = resumeStages[state.currentStage]
    if (!simulation || !stage || !state.hasStarted || state.completedAt) return null
    const baseRoute = simulation.routes[stage.routeKey]
    return { simulationId: transitionId, transitionId: simulation.transitionId || transitionId, experienceLabel: simulation.experienceLabel, label: stage.label, transitionLabel: simulation.transitionLabel, route: state.currentStage === 'next-experiment' && state.futureFeeling ? `${baseRoute}/${state.futureFeeling}` : baseRoute, updatedAt: state.updatedAt || '' }
  }).filter(Boolean).sort((first, second) => second.updatedAt.localeCompare(first.updatedAt))
  const isEmpty = savedFutures.length === 0 && resumes.length === 0

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute -right-44 top-10 h-[34rem] w-[34rem] rounded-full bg-sage/40 blur-3xl" aria-hidden="true" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-8"><Brand /><Link to="/" className="text-sm font-semibold text-muted hover:text-accent">Explore futures</Link></header>
      <main className="relative mx-auto max-w-5xl px-6 pb-20 pt-12 sm:px-8 sm:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Private to this device</p>
        <h1 className="mt-5 font-display text-5xl tracking-[-0.05em] sm:text-6xl">My Futures</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">A calm record of what you learned from futures you actually tried.</p>

        {isEmpty && (
          <section className="mt-12 rounded-[1.75rem] border border-line bg-white/75 p-7 shadow-card sm:p-10">
            <h2 className="font-display text-3xl tracking-[-0.035em]">Your explored futures will live here.</h2>
            <p className="mt-4 text-base leading-7 text-muted">Try a future, notice what matters, and save what you learn.</p>
            <Link to="/#transitions" className="mt-7 inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white shadow-card hover:bg-accent-dark">Explore a future</Link>
          </section>
        )}

        {resumes.map((resume) => (
          <section key={resume.simulationId} className="mt-10 rounded-[1.5rem] border border-accent/15 bg-sage/50 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Still exploring</p>
            <h2 className="mt-3 font-display text-2xl tracking-[-0.03em]">{resume.transitionLabel}</h2>
            <p className="mt-2 text-sm font-semibold text-ink">{resume.experienceLabel}</p>
            <p className="mt-2 text-sm text-muted">You left off at: {resume.label}</p>
            <Link to={resume.route} className="mt-5 inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white hover:bg-accent-dark">Continue exploring</Link>
          </section>
        ))}

        {savedFutures.length > 0 && (
          <section className="mt-10 space-y-5" aria-label="Saved Career Snapshots">
            {savedFutures.map((snapshot) => {
              const matchingResume = resumes.find((resume) => resume.transitionId === snapshot.transitionId)
              const transitionScenarios = getTransitionSimulations(snapshot.transitionId)
              const currentMindset = mindsetByOutcome[snapshot.outcome]
              const hasWorkingScenario = transitionScenarios.some((scenario) => scenario.isFollowUp
                && scenario.mindset === currentMindset
                && !activeSimulations[scenario.id]?.completedAt)
              const latestCompletedScenario = transitionScenarios
                .filter((scenario) => activeSimulations[scenario.id]?.completedAt)
                .sort((first, second) => activeSimulations[second.id].completedAt.localeCompare(activeSimulations[first.id].completedAt))[0]
              const continuationRoute = !matchingResume && hasWorkingScenario && continuationOutcomes.has(snapshot.outcome) && latestCompletedScenario
                ? `${latestCompletedScenario.routes.nextExperiment}/${snapshot.outcome}`
                : ''
              return <div key={snapshot.id}>
                <CareerSnapshot snapshot={snapshot} compact />
                <div className="mt-3 flex flex-wrap gap-3 px-2">
                  <Link to={`/my-futures/${snapshot.id}`} className="text-sm font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:text-accent">View Career Snapshot</Link>
                  {matchingResume && <Link to={matchingResume.route} className="text-sm font-semibold text-muted hover:text-accent">Continue exploring</Link>}
                  {continuationRoute && <Link to={continuationRoute} className="text-sm font-semibold text-muted hover:text-accent">Continue exploring</Link>}
                </div>
              </div>
            })}
          </section>
        )}
        {!isEmpty && <div className="mt-14 border-t border-line pt-7"><button type="button" onClick={() => setClearOpen(true)} className="text-sm font-semibold text-muted hover:text-[#7A3F38]">Clear my saved Try the Work data</button></div>}
      </main>
      <ConfirmationDialog
        open={clearOpen}
        title="Clear your saved Try the Work data?"
        description="This will remove your saved Career Snapshots and unfinished simulations from this browser. This cannot be undone."
        confirmLabel="Clear my data"
        cancelLabel="Cancel"
        onConfirm={() => {
          clearAllCareerGpsData()
          setClearOpen(false)
        }}
        onCancel={() => setClearOpen(false)}
        destructive
      />
    </div>
  )
}
