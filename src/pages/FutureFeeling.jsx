import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Brand from '../components/Brand'
import SelectionCard from '../components/SelectionCard'
import { getSimulation } from '../data/simulations'
import { useTrackSimulationStage, useTransitionSimulation } from '../state/SimulationState'

export default function FutureFeeling() {
  const { transitionId } = useParams()
  const simulation = getSimulation(transitionId)
  const { state, setField } = useTransitionSimulation(transitionId)
  useTrackSimulationStage(transitionId, 'future-feeling', Boolean(simulation))
  if (!simulation) return null
  const { transitionLabel, routes, futureFeeling } = simulation
  const directToSnapshot = simulation.isFollowUp && state.futureFeeling === 'learned-enough'
  const nextRoute = directToSnapshot ? `${routes.outcomes}/${state.futureFeeling}` : `${routes.nextExperiment}/${state.futureFeeling}`

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute left-1/2 top-10 h-[36rem] w-[48rem] -translate-x-1/2 rounded-full bg-sage/45 blur-3xl" aria-hidden="true" />
      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10"><Brand /><p className="hidden text-xs font-medium tracking-wide text-muted sm:block">YOUR REFLECTION</p></header>
      <main className="relative mx-auto max-w-4xl px-6 pb-20 pt-14 text-center sm:px-8 sm:pt-20 lg:px-10">
        <p className="text-sm font-medium text-muted">{transitionLabel}</p>
        <h1 className="mt-6 font-display text-[3rem] leading-[1.04] tracking-[-0.05em] text-ink sm:text-6xl lg:text-[4.25rem]">{futureFeeling.heading}</h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-muted">{futureFeeling.supportingCopy}</p>

        <div className="mx-auto mt-12 max-w-2xl space-y-3 text-left">
          {futureFeeling.choices.map((choice) => (
            <SelectionCard key={choice.id} title={choice.title} description={choice.description} selected={state.futureFeeling === choice.id} onSelect={() => {
              setField('futureFeeling', choice.id)
              setField('nextExperiment', '')
              setField('nextPreferences', [])
            }} />
          ))}
        </div>

        {state.futureFeeling && (
          <Link to={nextRoute} onClick={() => simulation.isFollowUp && !state.completedAt && setField('completedAt', new Date().toISOString())} className="mt-10 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-accent-dark">{futureFeeling.cta}<span aria-hidden="true">→</span></Link>
        )}
      </main>
    </div>
  )
}
