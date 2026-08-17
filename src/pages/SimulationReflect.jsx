import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Brand from '../components/Brand'
import ChoiceChips from '../components/ChoiceChips'
import EvidenceBackedReflection from '../components/EvidenceBackedReflection'
import SimulationProgress from '../components/SimulationProgress'
import { getSimulation } from '../data/simulations'
import { useTrackSimulationStage, useTransitionSimulation } from '../state/SimulationState'
import { createEvidenceBackedReflection } from '../utils/reflectionInsights'

export default function SimulationReflect() {
  const { transitionId } = useParams()
  const simulation = getSimulation(transitionId)
  const { state, setField, toggleValue } = useTransitionSimulation(transitionId)
  useTrackSimulationStage(transitionId, 'reflect', Boolean(simulation))
  if (!simulation) return null
  const { transitionLabel, routes, reflect } = simulation
  const evidenceReflection = createEvidenceBackedReflection(state, simulation)
  const canContinue = state.energizing.length > 0 && state.uncomfortable.length > 0

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute -right-44 top-20 h-[34rem] w-[34rem] rounded-full bg-sage/40 blur-3xl" aria-hidden="true" />
      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10"><Brand /><p className="hidden text-xs font-medium tracking-wide text-muted sm:block">NOTICE THE EXPERIENCE</p></header>
      <main className="relative mx-auto max-w-5xl px-6 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-12 lg:px-10 lg:pb-24">
        <SimulationProgress currentStage="reflect" />
        <section className="mx-auto mt-10 max-w-4xl lg:mt-14">
          <p className="text-sm font-medium text-muted">{transitionLabel}</p>
          <h1 className="mt-5 font-display text-[2.7rem] leading-[1.06] tracking-[-0.045em] sm:text-6xl lg:text-[3.5rem]">{reflect.heading}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{reflect.supportingCopy}</p>

          <EvidenceBackedReflection reflection={evidenceReflection} />

          <section className="mt-12 border-t border-line pt-10">
            <h2 className="font-display text-4xl tracking-[-0.04em] text-ink">{reflect.feelingHeading}</h2>
            <div className="mt-8 space-y-9">
              <div>
                <h3 className="text-sm font-semibold text-ink">{reflect.energizing.heading}</h3>
                <div className="mt-4"><ChoiceChips options={reflect.energizing.options} selected={state.energizing} onToggle={(value) => toggleValue('energizing', value)} /></div>
                {state.energizing.includes('Something else') && <input value={state.customEnergizing} onChange={(event) => setField('customEnergizing', event.target.value)} placeholder={reflect.energizing.placeholder} className="mt-4 min-h-11 w-full rounded-full border border-line bg-white/80 px-5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">{reflect.uncomfortable.heading}</h3>
                <div className="mt-4"><ChoiceChips options={reflect.uncomfortable.options} selected={state.uncomfortable} onToggle={(value) => toggleValue('uncomfortable', value)} /></div>
                {state.uncomfortable.includes('Something else') && <input value={state.customUncomfortable} onChange={(event) => setField('customUncomfortable', event.target.value)} placeholder={reflect.uncomfortable.placeholder} className="mt-4 min-h-11 w-full rounded-full border border-line bg-white/80 px-5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" />}
              </div>
            </div>
          </section>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to={routes.futureFeeling} aria-disabled={!canContinue} onClick={(event) => !canContinue && event.preventDefault()} className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition ${canContinue ? 'bg-ink text-white shadow-card hover:bg-accent-dark' : 'cursor-not-allowed bg-line/70 text-muted'}`}>{reflect.cta}<span aria-hidden="true">→</span></Link>
            <Link to={routes.respond} className="inline-flex min-h-11 items-center justify-center px-4 text-sm font-semibold text-muted hover:text-accent">Back to the response</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
