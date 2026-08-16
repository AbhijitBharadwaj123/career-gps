import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Brand from '../components/Brand'
import CareerSnapshot from '../components/CareerSnapshot'
import FeedbackModal from '../components/FeedbackModal'
import ShareReflectionModal from '../components/ShareReflectionModal'
import { getSimulation } from '../data/simulations'
import { useTransitionSimulation } from '../state/SimulationState'
import { createCareerSnapshot, createSnapshotEmailHref } from '../utils/careerSnapshot'

export default function SimulationOutcome() {
  const { transitionId, outcomeId } = useParams()
  const simulation = getSimulation(transitionId)
  const { state, activeSimulations, savedFutures, saveSnapshot } = useTransitionSimulation(transitionId)
  const [shareOpen, setShareOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const snapshotSimulation = simulation || getSimulation('ba-to-pm')
  const routes = snapshotSimulation.routes
  const outcomes = simulation?.outcomes || {}
  const outcome = outcomes[outcomeId]
  const snapshot = createCareerSnapshot(state, outcomeId, snapshotSimulation, activeSimulations)
  const isSaved = Boolean(simulation && outcome && savedFutures.some((item) => item.id === snapshot.id))
  const snapshotSignature = JSON.stringify(snapshot)
  const publicPath = snapshotSimulation.publicTransitionRoute || `/simulate/${snapshotSimulation.transitionId || snapshotSimulation.id}`
  const publicSimulationUrl = new URL(publicPath, window.location.origin).href
  const emailHref = createSnapshotEmailHref(snapshot, publicSimulationUrl)
  const shareTextByOutcome = {
    'explore-more': "I've been trying on different parts of Product Management with Try the Work before deciding whether to pursue the transition.",
    'keep-exploring': "I've been trying on different parts of Product Management with Try the Work before deciding whether to pursue the transition.",
    unsure: "I've been exploring what Product Management actually feels like before deciding whether I want to pursue it. Some parts clicked and some made me want another look.",
    'still-unsure': "I've been exploring what Product Management actually feels like before deciding whether I want to pursue it. Some parts clicked and some made me want another look.",
    'not-for-me': 'I tried a Product Management career simulation and learned something useful before making the transition.',
    'learned-enough': "I've been trying on different parts of Product Management with Try the Work and kept what I learned without forcing a decision.",
  }
  const experienceCountCopy = snapshot.experiencesTried?.length > 1 ? ` I've explored ${snapshot.experiencesTried.length} different PM situations so far.` : ''
  const defaultShareText = `${shareTextByOutcome[outcomeId] || outcome?.shareText || ''}${experienceCountCopy}`

  useEffect(() => {
    if (simulation && outcome && isSaved) saveSnapshot(JSON.parse(snapshotSignature))
  }, [isSaved, outcome, saveSnapshot, simulation, snapshotSignature])

  if (!simulation) return null
  if (!outcome) {
    return <div className="grid min-h-screen place-items-center bg-canvas px-6 text-center"><div><h1 className="font-display text-4xl text-ink">Choose how the future felt first.</h1><Link to={routes.futureFeeling} className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Return to reflection</Link></div></div>
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute -right-48 top-20 h-[36rem] w-[36rem] rounded-full bg-sage/45 blur-3xl" aria-hidden="true" />
      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10"><Brand /><Link to="/my-futures" className="text-sm font-semibold text-muted hover:text-accent">My Futures</Link></header>

      <main className="relative mx-auto min-w-0 max-w-5xl px-6 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-10">
        <section className="min-w-0 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">A useful discovery</p>
          <h1 className="mt-5 font-display text-[2.8rem] leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-[4rem]">{outcome.heading}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{outcome.supportingCopy}</p>
        </section>

        <section className="mt-12 min-w-0" aria-label="Your Career Snapshot">
          <CareerSnapshot snapshot={snapshot} />
          <div className="mt-6 rounded-[1.5rem] border border-accent/15 bg-sage/45 p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">Keep this for myself</p>
                {isSaved && <><p className="mt-2 text-sm font-semibold text-accent">Saved on this device.</p><p className="mt-1 text-sm text-muted">Come back anytime to revisit what you discovered.</p></>}
              </div>
              <button type="button" onClick={() => saveSnapshot(snapshot)} className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white shadow-card hover:bg-accent-dark">Save this Career Snapshot</button>
            </div>
            {isSaved && <div className="mt-5 flex flex-col gap-3 border-t border-accent/10 pt-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap items-center gap-x-5 gap-y-3"><Link to="/my-futures" className="text-sm font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:text-accent">View in My Futures</Link><a href={emailHref} className="text-sm font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:text-accent">Email a copy to myself</a></div><p className="text-xs text-muted">Coming soon: keep your explorations across devices.</p></div>}
          </div>
        </section>

        <section className="mt-12 grid gap-4 border-t border-line pt-8 sm:grid-cols-2" aria-label="Optional actions">
          <div className="rounded-2xl border border-line bg-white/60 p-5">
            <h2 className="font-display text-xl text-ink">Share what I discovered</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Share something with another person. You choose the text.</p>
            <button type="button" onClick={() => setShareOpen(true)} className="mt-4 inline-flex min-h-10 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink hover:border-accent/35">Share what I discovered</button>
          </div>
          <div className="rounded-2xl border border-line bg-white/60 p-5">
            <h2 className="font-display text-xl text-ink">Give feedback on Try the Work</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Only the feedback you explicitly enter is sent to the Try the Work team.</p>
            <button type="button" onClick={() => setFeedbackOpen(true)} className="mt-4 inline-flex min-h-10 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink hover:border-accent/35">Give feedback</button>
          </div>
        </section>
      </main>

      <ShareReflectionModal open={shareOpen} onClose={() => setShareOpen(false)} defaultText={defaultShareText} publicPath={publicPath} nextExperiment={snapshot.nextExperiment} />
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} outcomeId={outcomeId} transitionId={simulation.transitionId || transitionId} scenarioId={simulation.scenarioId} />
    </div>
  )
}
