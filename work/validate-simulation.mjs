import { mayaBaToPmSimulation as simulation } from '../src/data/mayaSimulation.js'
import { engineerToPmSimulation as engineerSimulation } from '../src/data/engineerSimulation.js'
import { baStakeholderConflictSimulation, followUpSimulations } from '../src/data/followUpSimulations.js'
import { simulations } from '../src/data/simulations.js'
import { createCareerSnapshot, createSnapshotEmailHref } from '../src/utils/careerSnapshot.js'
import { readFileSync } from 'node:fs'

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

assert(simulation.explore.options.length === 4, 'Explore must contain four evidence sources')
assert(new Set(simulation.explore.options.map(({ id }) => id)).size === 4, 'Evidence IDs must be unique')
assert(simulation.explore.options.every(({ decisionSummary, evidence }) => decisionSummary && evidence.summary), 'Every evidence source needs factual summaries')
assert(simulation.decide.options.length === 3, 'Decide must contain three authored options')

for (const option of simulation.decide.options) {
  const branch = simulation.respond.branches[option.id]
  assert(branch, `Missing response branch for ${option.id}`)
  assert(branch.responses.length === 3, `${option.id} must contain three response approaches`)
  assert(branch.responses.every(({ reflectionPrompt }) => reflectionPrompt), `${option.id} responses need reflection prompts`)
}

assert(simulation.respond.branches.custom.responses.length === 4, 'Custom decisions need four authored trade-off choices')
assert(simulation.futureFeeling.choices.length === 3, 'Future feeling must contain three self-selected outcomes')
assert(simulation.futureFeeling.choices.every(({ id }) => simulation.outcomes[id]), 'Every future feeling needs an outcome')
assert(simulation.nextExperiment['explore-more'].choices.filter(({ available }) => available).length === 2, 'BA explore-more needs two available follow-ups')
assert(simulation.nextExperiment.unsure.choices.filter(({ available }) => available).length === 2, 'BA unsure needs two available follow-ups')
assert(simulation.nextExperiment['explore-more'].choices.map(({ simulationId }) => simulationId).join() === 'ba-to-pm-stakeholder-conflict,ba-to-pm-product-strategy', 'BA explore-more needs its authored mindset branch')
assert(simulation.nextExperiment.unsure.choices.map(({ simulationId }) => simulationId).join() === 'ba-to-pm-customer-discovery,ba-to-pm-living-with-decision', 'BA unsure needs its authored mindset branch')
assert(simulation.nextExperiment.unsure.choices.every(({ simulationId }) => !simulation.nextExperiment['explore-more'].choices.some((choice) => choice.simulationId === simulationId)), 'BA mindset branches must be disjoint')
assert(simulation.nextExperiment['not-for-me'].choices.length === 6, 'Not-for-me needs six neutral preference choices')
assert(simulation.outcomes['not-for-me'].leastAppealingOptions.every(({ futures }) => Array.isArray(futures)), 'Least-appealing choices need neutral future mappings')

assert(engineerSimulation.explore.options.length === 4, 'Engineer Explore must contain four evidence sources')
assert(new Set(engineerSimulation.explore.options.map(({ id }) => id)).size === 4, 'Engineer evidence IDs must be unique')
assert(engineerSimulation.explore.options.every(({ decisionSummary, evidence }) => decisionSummary && evidence.summary), 'Engineer evidence needs factual summaries')
assert(engineerSimulation.decide.options.length === 4, 'Engineer Decide must contain four authored options')
for (const option of engineerSimulation.decide.options) {
  const branch = engineerSimulation.respond.branches[option.id]
  assert(branch, `Missing Engineer response branch for ${option.id}`)
  assert(branch.responses.length === 3, `${option.id} must contain three response approaches`)
  assert(branch.responses.every(({ reflectionPrompt }) => reflectionPrompt), `${option.id} responses need reflection prompts`)
}
assert(engineerSimulation.respond.branches.custom.responses.length === 5, 'Engineer custom decisions need five authored trade-off choices')
assert(engineerSimulation.futureFeeling.choices.every(({ id }) => engineerSimulation.outcomes[id]), 'Every Engineer future feeling needs an outcome')
assert(engineerSimulation.nextExperiment['explore-more'].choices.filter(({ available }) => available).length === 2, 'Engineer explore-more needs two available follow-ups')
assert(engineerSimulation.nextExperiment.unsure.choices.filter(({ available }) => available).length === 2, 'Engineer unsure needs two available follow-ups')
assert(engineerSimulation.nextExperiment['explore-more'].choices.map(({ simulationId }) => simulationId).join() === 'engineer-to-pm-build-buy-partner,engineer-to-pm-growth-economics', 'Engineer explore-more needs its authored mindset branch')
assert(engineerSimulation.nextExperiment.unsure.choices.map(({ simulationId }) => simulationId).join() === 'engineer-to-pm-engineering-owns-how,engineer-to-pm-launch-technically-ready', 'Engineer unsure needs its authored mindset branch')
assert(engineerSimulation.nextExperiment.unsure.choices.every(({ simulationId }) => !engineerSimulation.nextExperiment['explore-more'].choices.some((choice) => choice.simulationId === simulationId)), 'Engineer mindset branches must be disjoint')
assert(engineerSimulation.nextExperiment['not-for-me'].choices.length === 7, 'Engineer not-for-me needs seven neutral preference choices')

assert(followUpSimulations.length === 8, 'There must be exactly eight authored follow-up scenarios')
for (const transitionId of ['ba-to-pm', 'engineer-to-pm']) {
  for (const mindset of ['explore-more', 'unsure']) {
    assert(followUpSimulations.filter((scenario) => scenario.transitionId === transitionId && scenario.mindset === mindset).length === 2, `${transitionId} / ${mindset} needs exactly two scenarios`)
  }
}

for (const followUp of followUpSimulations) {
  assert(followUp.isFollowUp, `${followUp.id} must be marked as a follow-up`)
  assert(['explore-more', 'unsure'].includes(followUp.mindset), `${followUp.id} needs authored mindset metadata`)
  assert(followUp.explore.options.length === 3, `${followUp.id} needs three evidence sources`)
  assert(followUp.decide.options.length >= 3, `${followUp.id} needs at least three authored decisions`)
  assert(followUp.futureFeeling.choices.length === 4, `${followUp.id} needs four follow-up feelings`)
  assert(followUp.decide.options.every(({ id }) => followUp.respond.branches[id]?.responses.length === 3), `${followUp.id} needs a stakeholder branch for every decision`)
  assert(followUp.respond.branches.custom.responses.length === 3, `${followUp.id} needs a custom decision branch`)
}

const expectedCustomChallenges = {
  'ba-to-pm': 'I can work with that direction. Before we commit the sprint, what trade-off are you most comfortable accepting?',
  'ba-to-pm-stakeholder-conflict': 'I can work with that direction, but someone is going to be disappointed. Which stakeholder risk are you most willing to accept?',
  'ba-to-pm-product-strategy': 'All three directions have a case. What are you explicitly choosing not to pursue, and why is that acceptable?',
  'ba-to-pm-customer-discovery': 'I can work with that direction. What would have to be true for you to feel this problem deserves more investment?',
  'ba-to-pm-living-with-decision': "We've already spent a quarter on this. How much more evidence do we need before we move on?",
  'engineer-to-pm': "Engineering can build toward that. What I need from Product is the trade-off we're optimizing for. If we can't maximize quality, speed, cost, and launch timing at the same time, which one are you most willing to give up?",
  'engineer-to-pm-build-buy-partner': 'We can absolutely build this ourselves. Why should we give a vendor something our team is capable of owning?',
  'engineer-to-pm-growth-economics': 'If we change the economics now, we may slow the exact adoption everyone has been celebrating. What are we optimizing for?',
  'engineer-to-pm-engineering-owns-how': "I value your technical background, but I need to understand whether you're raising a product risk or telling Engineering how to implement the solution.",
  'engineer-to-pm-launch-technically-ready': "The product is ready. If we delay now, it's not because of Engineering. What exactly makes this a Product blocker?",
}

for (const scenario of Object.values(simulations)) {
  assert(scenario.decide.customLabel === "I'd take a different approach", `${scenario.id} needs the agency-preserving custom label`)
  assert(scenario.decide.customPrompt === 'What would you ask the team to do?', `${scenario.id} needs the shared custom prompt`)
  assert(scenario.respond.branches.custom.responses.length > 0, `${scenario.id} needs authored generic custom responses`)
  assert(scenario.respond.branches.custom.message.join(' ') === expectedCustomChallenges[scenario.id], `${scenario.id} needs the correct generic stakeholder challenge`)
  assert(scenario.explore.customQuestion.heading === 'What else would you want to investigate?', `${scenario.id} needs the shared private-question heading`)
  assert(scenario.explore.customQuestion.submitLabel === 'Add question', `${scenario.id} needs the shared private-question action`)
  assert(scenario.explore.customQuestion.supportingCopy.includes("won't be used to score you"), `${scenario.id} needs an explicit question privacy boundary`)
}

for (const followUp of followUpSimulations) {
  assert(followUp.nextExperiment['not-for-me'].choices.length >= 6, `${followUp.id} needs transition-specific preferences after a no`)
}

const sampleState = {
  completedAt: '2026-08-15T12:00:00.000Z',
  energizing: ['Making the trade-off', 'Something else'],
  customEnergizing: 'Connecting the details',
  uncomfortable: ['Having my decision challenged'],
  customUncomfortable: '',
  nextExperiment: 'Stakeholder conflict',
  savedQuestions: ['What would I still want to learn?'],
  decisionId: 'custom',
  customDecision: 'Keep investigating and stage the release.',
  customDecisionCaptured: true,
  responseId: 'custom',
  customResponse: 'I would explain the trade-off in my own words.',
}
const sampleSnapshot = createCareerSnapshot(sampleState, 'explore-more')
assert(sampleSnapshot.transitionId === 'ba-to-pm', 'Snapshot needs the transition ID')
assert(sampleSnapshot.energizingSelections.length === 2, 'Snapshot must preserve only explicit energizing selections')
assert(sampleSnapshot.energizingSelections.includes('Connecting the details'), 'Snapshot must preserve explicit custom reflection')
assert(sampleSnapshot.uncomfortableSelections.length === 1, 'Snapshot must not infer additional concerns')
assert(sampleSnapshot.nextExperiment === 'Stakeholder conflict', 'Snapshot needs the authored next experiment')
assert(sampleSnapshot.questionsStillToInvestigate[0] === 'What would I still want to learn?', 'Snapshot must preserve exploration questions exactly')
const emailHref = createSnapshotEmailHref(sampleSnapshot, 'https://example.com/simulate/ba-to-pm')
assert(emailHref.startsWith('mailto:?subject='), 'Snapshot email must use a mailto export')
assert(!decodeURIComponent(emailHref).includes('custom stakeholder'), 'Snapshot email must not infer private response content')
assert(!JSON.stringify(sampleSnapshot).includes(sampleState.customDecision), 'Snapshot must not include the private custom decision')
assert(!decodeURIComponent(emailHref).includes(sampleState.customDecision), 'Snapshot email must not include the private custom decision')
assert(!decodeURIComponent(emailHref).includes(sampleState.customResponse), 'Snapshot email must not include the private custom response')

const engineerSnapshot = createCareerSnapshot({ ...sampleState, nextExperiment: 'Build, buy, or partner?' }, 'explore-more', engineerSimulation)
assert(engineerSnapshot.id !== sampleSnapshot.id, 'Snapshots from different transitions need distinct IDs')
assert(engineerSnapshot.transitionId === 'engineer-to-pm', 'Engineer Snapshot needs its transition ID')
assert(engineerSnapshot.fromRole === 'Software Engineer', 'Engineer Snapshot needs the correct source role')
const engineerEmailHref = decodeURIComponent(createSnapshotEmailHref(engineerSnapshot, 'https://example.com/simulate/engineer-to-pm'))
assert(engineerEmailHref.includes('Software Engineer → Product Manager'), 'Engineer email needs the correct transition')
assert(engineerEmailHref.includes('/simulate/engineer-to-pm'), 'Engineer email needs the public Engineer simulation URL')
assert(engineerEmailHref.includes("Questions I'd still want answered"), 'Snapshot email needs explicit exploration questions')
assert(engineerEmailHref.includes('What would I still want to learn?'), 'Snapshot email must preserve question wording')

const secondScenarioState = {
  ...sampleState,
  completedAt: '2026-08-16T12:00:00.000Z',
  energizing: ['Explaining the trade-off', 'Making the trade-off'],
  uncomfortable: ['Saying no to an important stakeholder'],
  savedQuestions: ['Who else would be affected?'],
  nextExperiment: 'Customer discovery',
}
const cumulativeSnapshot = createCareerSnapshot(secondScenarioState, 'keep-exploring', baStakeholderConflictSimulation, {
  'ba-to-pm': sampleState,
  'ba-to-pm-stakeholder-conflict': secondScenarioState,
})
assert(cumulativeSnapshot.id === 'snapshot-ba-to-pm', 'Follow-ups must roll into the transition Snapshot')
assert(cumulativeSnapshot.experiencesTried.length === 2, 'Cumulative Snapshot must list both completed experiences')
assert(cumulativeSnapshot.energizingSelections.filter((item) => item === 'Making the trade-off').length === 1, 'Cumulative reflections must avoid duplicates')
assert(cumulativeSnapshot.questionsStillToInvestigate.length === 2, 'Cumulative Snapshot must aggregate private questions')
assert(cumulativeSnapshot.firstExploredAt < cumulativeSnapshot.lastExploredAt, 'Cumulative Snapshot needs first and last dates')

const authoredText = JSON.stringify([simulation, engineerSimulation]).toLowerCase()
for (const prohibited of ['readiness score', 'fit percentage', 'correct choice', 'incorrect choice', 'good choice', 'strong response', 'pass / fail']) {
  assert(!authoredText.includes(prohibited), `Prohibited evaluation language found: ${prohibited}`)
}

const netlifyHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const netlifyConfig = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8')
assert(netlifyHtml.includes('name="career-gps-feedback"'), 'Netlify feedback form must be statically detectable')
assert(netlifyHtml.includes('name="career-gps-waitlist"'), 'Netlify waitlist form must be statically detectable')
assert(netlifyConfig.includes('publish = "dist"'), 'Netlify must publish the Vite dist directory')
assert(netlifyConfig.includes('to = "/index.html"'), 'Netlify needs an SPA fallback')

console.log(JSON.stringify({
  evidenceSources: simulation.explore.options.length,
  decisionBranches: simulation.decide.options.length,
  authoredResponses: simulation.decide.options.reduce((count, option) => count + simulation.respond.branches[option.id].responses.length, 0),
  futureFeelings: simulation.futureFeeling.choices.length,
  outcomes: Object.keys(simulation.outcomes).length,
  engineerEvidenceSources: engineerSimulation.explore.options.length,
  engineerDecisionBranches: engineerSimulation.decide.options.length,
  engineerAuthoredResponses: engineerSimulation.decide.options.reduce((count, option) => count + engineerSimulation.respond.branches[option.id].responses.length, 0),
  followUpScenarios: followUpSimulations.length,
  cumulativeExperiences: cumulativeSnapshot.experiencesTried.length,
  privateQuestionFlows: Object.keys(simulations).length,
  netlifyForms: 2,
  snapshotFields: Object.keys(sampleSnapshot).length,
  validation: 'passed',
}, null, 2))
