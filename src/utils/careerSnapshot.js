import { mayaBaToPmSimulation } from '../data/mayaSimulation.js'
import { getTransitionSimulations } from '../data/simulations.js'

function withCustomSelection(selections = [], customValue = '') {
  return selections.map((selection) => selection === 'Something else' && customValue.trim()
    ? customValue.trim()
    : selection)
}

const unique = (items) => [...new Set(items)]

export function createCareerSnapshot(state, outcomeId, simulation = mayaBaToPmSimulation, activeSimulations = null) {
  const transitionId = simulation.transitionId || simulation.id
  const transitionSimulations = getTransitionSimulations(transitionId)
  const completedExperiences = activeSimulations
    ? transitionSimulations.map((scenario) => ({ scenario, state: activeSimulations[scenario.id] })).filter(({ state: scenarioState }) => scenarioState?.completedAt)
    : [{ scenario: simulation, state }]
  const experiences = completedExperiences.length ? completedExperiences : [{ scenario: simulation, state }]
  const baseSimulation = transitionSimulations.find((scenario) => !scenario.isFollowUp) || simulation
  const { fromRole, toRole, futureFeeling } = simulation
  const outcome = futureFeeling.choices.find((choice) => choice.id === outcomeId)
  const completedAt = state.completedAt || new Date().toISOString()
  const completionDates = experiences.map(({ state: scenarioState }) => scenarioState.completedAt).filter(Boolean).sort()

  return {
    id: `snapshot-${transitionId}`,
    transitionId,
    fromRole: baseSimulation.fromRole || fromRole,
    toRole: baseSimulation.toRole || toRole,
    completedAt,
    firstExploredAt: completionDates[0] || completedAt,
    lastExploredAt: completionDates.at(-1) || completedAt,
    outcome: outcomeId,
    outcomeLabel: outcome?.title || '',
    completedScenarioIds: experiences.map(({ scenario }) => scenario.scenarioId),
    experiencesTried: experiences.map(({ scenario }) => scenario.experienceLabel),
    availableExperienceCount: transitionSimulations.length,
    energizingSelections: unique(experiences.flatMap(({ state: scenarioState }) => withCustomSelection(scenarioState.energizing, scenarioState.customEnergizing))),
    uncomfortableSelections: unique(experiences.flatMap(({ state: scenarioState }) => withCustomSelection(scenarioState.uncomfortable, scenarioState.customUncomfortable))),
    nextExperiment: state.nextExperiment || "I'll decide later.",
    questionsStillToInvestigate: unique(experiences.flatMap(({ state: scenarioState }) => scenarioState.savedQuestions || [])),
  }
}

export function formatSnapshotDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

export function createSnapshotEmailHref(snapshot, publicUrl) {
  const asList = (items) => items.length ? items.map((item) => `- ${item}`).join('\n') : '- Nothing specific stood out yet.'
  const questions = snapshot.questionsStillToInvestigate || []
  const subject = `My Try the Work Snapshot — ${snapshot.fromRole} → ${snapshot.toRole}`
  const body = [
    'Try the Work — My Career Snapshot',
    '',
    `Future explored: ${snapshot.fromRole} → ${snapshot.toRole}`,
    '',
    ...(snapshot.experiencesTried?.length ? ['Experiences tried:', asList(snapshot.experiencesTried), ''] : []),
    `How this future feels now: ${snapshot.outcomeLabel}`,
    '',
    'What keeps pulling me in:',
    asList(snapshot.energizingSelections),
    '',
    'What keeps giving me pause:',
    asList(snapshot.uncomfortableSelections),
    '',
    'What I want to explore next:',
    snapshot.nextExperiment,
    ...(questions.length ? ['', "Questions I'd still want answered:", asList(questions)] : []),
    '',
    'First explored:',
    formatSnapshotDate(snapshot.firstExploredAt || snapshot.completedAt),
    '',
    'Last explored:',
    formatSnapshotDate(snapshot.lastExploredAt || snapshot.completedAt),
    '',
    'Try the Work:',
    publicUrl,
  ].join('\n')

  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
