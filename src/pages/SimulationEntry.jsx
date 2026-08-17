import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Brand from '../components/Brand'
import ConfirmationDialog from '../components/ConfirmationDialog'
import SimulationProgress from '../components/SimulationProgress'
import { getSimulation } from '../data/simulations'
import { useTransitionSimulation } from '../state/SimulationState'

const stageLabels = {
  explore: 'Explore',
  decide: 'Decide',
  respond: 'Respond',
  reflect: 'Reflect',
  'future-feeling': 'How did that future feel?',
  'next-experiment': 'Choose what to test next',
}

export default function SimulationEntry() {
  const { transitionId } = useParams()
  const simulation = getSimulation(transitionId)
  const { state, setField, resetSimulation } = useTransitionSimulation(transitionId)
  const [startAgainOpen, setStartAgainOpen] = useState(false)
  if (!simulation) return <div className="grid min-h-screen place-items-center bg-canvas px-6 text-center"><div><h1 className="font-display text-4xl text-ink">This transition is coming soon.</h1><Link to="/#transitions" className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Explore available transitions</Link></div></div>

  const { transitionLabel, routes, entry } = simulation
  const resumeRoute = state.currentStage === 'next-experiment' && state.futureFeeling
    ? `${routes.nextExperiment}/${state.futureFeeling}`
    : routes[state.currentStage]
  const resume = stageLabels[state.currentStage] && resumeRoute ? { label: stageLabels[state.currentStage], route: resumeRoute } : null
  const hasUnfinishedJourney = state.hasStarted && !state.completedAt && resume

  if (hasUnfinishedJourney) {
    return (
      <div className="min-h-screen bg-canvas px-6 text-ink sm:px-8">
        <header className="mx-auto flex max-w-6xl items-center justify-between py-6"><Brand /><Link to="/my-futures" className="text-sm font-semibold text-muted hover:text-accent">My Futures</Link></header>
        <main className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-2xl place-items-center pb-20 text-center">
          <div className="w-full rounded-[1.75rem] border border-line bg-white/75 p-7 shadow-card sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-accent">A future in progress</p>
            <h1 className="mt-5 font-display text-5xl tracking-[-0.045em] sm:text-6xl">Welcome back.</h1>
            <p className="mt-5 text-lg leading-8 text-muted">You were exploring {transitionLabel}.</p>
            <p className="mt-3 text-sm font-semibold text-ink">You left off in: {simulation.experienceLabel} — {resume.label}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to={resume.route} className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white shadow-card hover:bg-accent-dark">Continue where I left off</Link>
              <button type="button" onClick={() => setStartAgainOpen(true)} className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-white px-6 text-sm font-semibold text-muted hover:border-accent/30 hover:text-ink">Start again</button>
            </div>
          </div>
        </main>
        <ConfirmationDialog
          open={startAgainOpen}
          title="Start this simulation again?"
          description="Your unfinished progress for this simulation will be cleared. Saved Career Snapshots will not be affected."
          confirmLabel="Start again"
          cancelLabel="Keep my progress"
          onConfirm={() => {
            setStartAgainOpen(false)
            resetSimulation()
          }}
          onCancel={() => setStartAgainOpen(false)}
          destructive
        />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute -right-40 top-20 h-[34rem] w-[34rem] rounded-full bg-sage/45 blur-3xl" aria-hidden="true" />

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
        <Brand />
        <p className="hidden text-xs font-medium tracking-wide text-muted sm:block">TRY ON THE WORK</p>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-12 lg:px-10 lg:pb-24">
        <SimulationProgress currentStage="context" />

        <section className="mt-10 grid gap-10 lg:mt-16 lg:grid-cols-[0.75fr_1.25fr] lg:items-start lg:gap-12">
          <div className="lg:sticky lg:top-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{entry.eyebrow}</p>
            <p className="mt-5 text-sm font-medium text-muted">{transitionLabel}</p>
            <h1 className="mt-5 max-w-lg font-display text-[2.75rem] leading-[1.05] tracking-[-0.045em] text-ink sm:text-6xl lg:text-[3.5rem]">
              {entry.heading}
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted">
              {entry.introduction}
            </p>
          </div>

          <article className="rounded-[2rem] border border-line bg-white/85 p-6 shadow-lift sm:p-9 lg:py-10 xl:px-8">
            <div className="space-y-3.5 text-[1.05rem] leading-8 text-ink/85">
              {entry.scenario.map((statement, index) => (
                <p key={statement} className={index === 0 ? 'font-semibold text-ink' : undefined}>{statement}</p>
              ))}
            </div>

            <div className="mt-9 rounded-2xl border border-accent/10 bg-sage/60 p-4 sm:px-5">
              <p className="font-display text-xl leading-8 tracking-[-0.02em] text-ink sm:text-2xl sm:leading-8 lg:text-[1.3rem] lg:tracking-[-0.03em]">
                {entry.reassurance[0]}<br className="hidden sm:block" /> {entry.reassurance[1]}
              </p>
            </div>

            <p className="mt-6 text-sm leading-6 text-muted">
              <span className="font-semibold text-ink/80">Prefer to speak?</span> Voice input is available during open-ended moments, and every transcript stays editable.
            </p>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to={routes.explore}
                onClick={() => {
                  if (state.completedAt) resetSimulation()
                  setField('hasStarted', true)
                  setField('currentStage', 'explore')
                }}
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-card transition duration-300 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 motion-reduce:transform-none"
              >
                Step into the situation
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/#transitions"
                className="inline-flex min-h-12 items-center justify-center px-4 text-sm font-semibold text-muted transition-colors hover:text-accent focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
              >
                Back to career transitions
              </Link>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
