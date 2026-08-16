import React from 'react'
import { Link } from 'react-router-dom'
import About from '../components/About'
import Brand from '../components/Brand'
import Hero from '../components/Hero'
import OwnTransitionCard from '../components/OwnTransitionCard'
import TransitionCard from '../components/TransitionCard'
import { useSimulationState } from '../state/SimulationState'
import { simulations } from '../data/simulations'
import { transitions } from '../data/transitions'

const resumeRouteKeys = {
  explore: 'explore',
  decide: 'decide',
  respond: 'respond',
  reflect: 'reflect',
  'future-feeling': 'futureFeeling',
  'next-experiment': 'nextExperiment',
}

export default function Home() {
  const { activeSimulations, savedFutures } = useSimulationState()
  const unfinishedEntry = Object.entries(activeSimulations)
    .filter(([, state]) => state.hasStarted && !state.completedAt)
    .sort(([, first], [, second]) => (second.updatedAt || '').localeCompare(first.updatedAt || ''))[0]
  const unfinished = Boolean(unfinishedEntry)
  const unfinishedSimulation = unfinished ? simulations[unfinishedEntry[0]] : null
  const unfinishedState = unfinishedEntry?.[1]
  const baseContinueRoute = unfinishedSimulation?.routes[resumeRouteKeys[unfinishedState?.currentStage]] || unfinishedSimulation?.routes.context
  const continueRoute = unfinishedState?.currentStage === 'next-experiment' && unfinishedState.futureFeeling
    ? `${baseContinueRoute}/${unfinishedState.futureFeeling}`
    : baseContinueRoute

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[54rem] -translate-x-1/2 rounded-full bg-sage/35 blur-3xl" aria-hidden="true" />

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
        <Brand />
        <div className="flex items-center gap-5">
          <span className="hidden text-xs font-medium tracking-wide text-muted lg:block">POSSIBILITIES, MADE TANGIBLE</span>
          <Link to="/my-futures" className="text-sm font-semibold text-muted transition-colors hover:text-accent">My Futures</Link>
        </div>
      </header>

      <main className="relative">
        {(unfinished || savedFutures.length > 0) && (
          <aside className="mx-auto max-w-6xl px-6 pt-3 sm:px-8 lg:px-10" aria-label="Your Career GPS activity">
            <div className="flex flex-col gap-3 rounded-2xl border border-accent/15 bg-sage/45 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">{unfinished ? 'Continue your exploration' : `Welcome back. You have ${savedFutures.length} saved ${savedFutures.length === 1 ? 'future' : 'futures'}.`}</p>
                <p className="mt-1 text-sm text-muted">{unfinished ? `You were exploring ${unfinishedSimulation.transitionLabel} — ${unfinishedSimulation.experienceLabel}.` : 'Your Career Snapshots are saved on this device.'}</p>
              </div>
              <Link to={unfinished ? continueRoute : '/my-futures'} className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-white/70 px-4 text-sm font-semibold text-ink transition hover:border-accent/40 hover:text-accent">{unfinished ? 'Continue where I left off' : 'View My Futures'}</Link>
            </div>
          </aside>
        )}
        <Hero />

        <section id="transitions" className="scroll-mt-6 border-t border-line/80 bg-white/45 px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Try a path</p>
              <h2 className="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] text-ink sm:text-5xl">
                Choose a transition to experience
              </h2>
              <p className="mt-5 text-base leading-7 text-muted">
                Step into the work itself. Notice what energizes you, what stretches you, and what you want to understand more deeply.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {transitions.map((transition) => (
                <TransitionCard key={transition.id} transition={transition} />
              ))}
            </div>

            <OwnTransitionCard />
          </div>
        </section>
        <About />
      </main>

      <footer className="border-t border-line bg-canvas px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <Brand />
          <p>Explore the work. Find your own direction.</p>
        </div>
      </footer>
    </div>
  )
}
