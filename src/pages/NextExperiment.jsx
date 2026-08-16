import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Brand from '../components/Brand'
import ChoiceChips from '../components/ChoiceChips'
import { getSimulation } from '../data/simulations'
import { useTrackSimulationStage, useTransitionSimulation } from '../state/SimulationState'

const mindsetByOutcome = {
  'explore-more': 'explore-more',
  'keep-exploring': 'explore-more',
  unsure: 'unsure',
  'still-unsure': 'unsure',
}

export default function NextExperiment() {
  const { transitionId, outcomeId } = useParams()
  const simulation = getSimulation(transitionId)
  const { state, activeSimulations, setField } = useTransitionSimulation(transitionId)
  useTrackSimulationStage(transitionId, 'next-experiment', Boolean(simulation))

  if (!simulation) return null
  const { transitionLabel, routes, nextExperiment } = simulation
  const selectedConfig = nextExperiment[outcomeId]
  const parentTransitionId = simulation.transitionId || simulation.id
  const parentSimulation = getSimulation(parentTransitionId)
  const targetMindset = mindsetByOutcome[outcomeId]
  const isDynamic = Boolean(selectedConfig?.dynamicFollowUps)
  const config = isDynamic ? parentSimulation.nextExperiment[targetMindset] : selectedConfig
  if (!config) return <div className="grid min-h-screen place-items-center bg-canvas"><Link to={routes.futureFeeling} className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Return to your reflection</Link></div>

  const authoredChoices = config.choices
  const scenarioChoices = (authoredChoices || []).filter((choice) => {
    if (!isDynamic) return true
    const choiceSimulation = getSimulation(choice.simulationId)
    return choiceSimulation?.mindset === targetMindset
      && choice.simulationId !== simulation.id
      && !activeSimulations[choice.simulationId]?.completedAt
  })
  const noFollowUpsRemain = isDynamic && scenarioChoices.length === 0

  const completeScenario = (nextChoice) => {
    setField('nextExperiment', nextChoice)
    if (!state.completedAt) setField('completedAt', new Date().toISOString())
  }

  const togglePreference = (preference) => {
    const next = state.nextPreferences.includes(preference)
      ? state.nextPreferences.filter((item) => item !== preference)
      : [...state.nextPreferences, preference]
    setField('nextPreferences', next)
    setField('nextExperiment', next.length ? next.join('; ') : '')
  }

  const decideLater = () => {
    setField('nextPreferences', [])
    completeScenario(nextExperiment.decideLater)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute left-1/2 top-10 h-[36rem] w-[48rem] -translate-x-1/2 rounded-full bg-sage/40 blur-3xl" aria-hidden="true" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-8"><Brand /><Link to="/my-futures" className="text-sm font-semibold text-muted hover:text-accent">My Futures</Link></header>
      <main className="relative mx-auto max-w-4xl px-6 pb-20 pt-12 sm:px-8 sm:pt-16">
        <p className="text-sm font-medium text-muted">{transitionLabel}</p>
        <h1 className="mt-5 max-w-3xl font-display text-[2.8rem] leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-[4rem]">{config.heading}</h1>
        {(config.supportingCopy || config.introduction) && <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{config.supportingCopy || config.introduction}</p>}

        {outcomeId === 'not-for-me' ? (
          <div className="mt-10">
            <ChoiceChips options={config.choices} selected={state.nextPreferences} onToggle={togglePreference} />
            {state.nextPreferences.length > 0 && <div className="mt-8 rounded-[1.5rem] border border-accent/15 bg-sage/45 p-5 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Explore adjacent futures — Coming soon</p><p className="mt-4 font-display text-xl leading-8 sm:text-2xl">{config.summary}</p></div>}
            <Link to={`${routes.outcomes}/${outcomeId}`} onClick={() => completeScenario(state.nextExperiment || nextExperiment.decideLater)} className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white shadow-card hover:bg-accent-dark">View my Career Snapshot</Link>
          </div>
        ) : noFollowUpsRemain ? (
          <section className="mt-10 rounded-[1.75rem] border border-accent/15 bg-sage/45 p-6 sm:p-8">
            <h2 className="font-display text-3xl tracking-[-0.035em]">{outcomeId === 'still-unsure' ? "You've tried the available moments in this exploration path. Staying unsure is a valid outcome." : "You've experienced the available moments in this exploration path. You don't need to force a decision today."}</h2>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to={`${routes.outcomes}/${outcomeId}`} onClick={() => completeScenario(nextExperiment.decideLater)} className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white">Save what I&apos;ve learned</Link>
              {outcomeId === 'keep-exploring' && <span className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-white/70 px-5 text-sm font-semibold text-muted">I&apos;m ready to explore the transition further — Coming soon</span>}
              {outcomeId === 'keep-exploring' && <Link to={`${routes.outcomes}/not-for-me`} onClick={() => setField('futureFeeling', 'not-for-me')} className="inline-flex min-h-12 items-center justify-center px-4 text-sm font-semibold text-muted hover:text-accent">This doesn&apos;t feel like me</Link>}
              {outcomeId === 'still-unsure' && <Link to={`${routes.outcomes}/${outcomeId}`} onClick={() => completeScenario(nextExperiment.decideLater)} className="inline-flex min-h-12 items-center justify-center px-4 text-sm font-semibold text-muted hover:text-accent">Come back later</Link>}
              {outcomeId === 'still-unsure' && <Link to="/#transitions" className="inline-flex min-h-12 items-center justify-center px-4 text-sm font-semibold text-muted hover:text-accent">Explore another future</Link>}
            </div>
          </section>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {scenarioChoices.map((choice) => {
              const nextSimulation = getSimulation(choice.simulationId)
              return (
                <article key={choice.title} className="flex flex-col rounded-[1.5rem] border border-line bg-white/80 p-5 shadow-card sm:p-6">
                  <h2 className="font-display text-2xl tracking-[-0.03em]">{choice.title}</h2>
                  <p className="mt-3 flex-1 text-[15px] leading-7 text-muted">{choice.description}</p>
                  <Link to={nextSimulation.routes.context} onClick={() => completeScenario(choice.title)} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white hover:bg-accent-dark">{choice.cta || 'Try this scenario'}</Link>
                </article>
              )
            })}
            <article className="flex flex-col rounded-[1.5rem] border border-line bg-white/65 p-5 sm:p-6">
              <h2 className="font-display text-2xl tracking-[-0.03em]">I&apos;ll decide later</h2>
              <p className="mt-3 flex-1 text-[15px] leading-7 text-muted">{config.decideLaterDescription || "Save what you've learned and come back whenever you're curious again."}</p>
              <Link to={`${routes.outcomes}/${outcomeId}`} onClick={decideLater} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink hover:border-accent/35">Save and come back later</Link>
            </article>
          </div>
        )}

        <Link to={routes.futureFeeling} className="mt-9 inline-flex min-h-11 items-center justify-center px-4 text-sm font-semibold text-muted hover:text-accent">Back</Link>
      </main>
    </div>
  )
}
