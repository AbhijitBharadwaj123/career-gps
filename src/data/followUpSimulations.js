const makeRoutes = (id) => {
  const base = `/simulate/${id}`
  return {
    context: base,
    explore: `${base}/explore`,
    decide: `${base}/decide`,
    respond: `${base}/respond`,
    reflect: `${base}/reflect`,
    futureFeeling: `${base}/future-feeling`,
    outcomes: `${base}/outcome`,
    nextExperiment: `${base}/next-experiment`,
  }
}

const followUpFeelings = {
  heading: 'How does this future feel now?',
  supportingCopy: 'You have another real moment from the work to draw on. Notice what changed—or what stayed the same.',
  choices: [
    { id: 'keep-exploring', title: 'I want to keep exploring', description: "There's still more about this work I want to experience." },
    { id: 'still-unsure', title: "I'm still unsure", description: 'Another kind of PM moment may help me learn more.' },
    { id: 'learned-enough', title: "I've learned enough for now", description: 'I want to keep what I noticed without forcing another decision.' },
    { id: 'not-for-me', title: "This doesn't feel like me", description: "Something about this kind of work didn't resonate with me." },
  ],
  cta: 'Choose my next step',
}

const followUpOutcomes = {
  'keep-exploring': { heading: 'Keep following your curiosity', supportingCopy: 'Each different PM moment gives you another piece of evidence about the future.', shareText: "I've been trying on different parts of Product Management with Career GPS before deciding whether to pursue the transition." },
  'still-unsure': { heading: 'Staying unsure is useful too.', supportingCopy: "You don't need to force a decision. Another experience—or time away—can still teach you something.", shareText: "I've been trying on different parts of Product Management with Career GPS before deciding whether to pursue the transition." },
  'learned-enough': { heading: 'Keep what you learned', supportingCopy: 'You can stop here without turning exploration into a commitment.', shareText: "I've been trying on different parts of Product Management with Career GPS before deciding whether to pursue the transition." },
  'not-for-me': { heading: 'A “no” is useful too.', supportingCopy: 'You learned something before spending months pursuing the transition.', shareText: "I've been trying on different parts of Product Management with Career GPS and learned something useful before making the transition." },
}

const commonCustomQuestion = {
  heading: 'What else would you want to investigate?',
  supportingCopy: "Add a question you'd want answered in the real world. We'll save it only in your Career Snapshot on this device. It won't be used to score you or sent to Career GPS unless you choose to include it in feedback.",
  placeholder: 'What else would you want to know?',
  savedLabel: "You'd also want to investigate",
  submitLabel: 'Add question',
}

const baMoreOf = ['More analysis', 'More clearly defined ownership', 'Less stakeholder negotiation', 'Less ambiguity', 'More time going deep on one problem', "I'm not sure yet"]
const engineerMoreOf = ['More hands-on building', 'More technical depth', 'Clearer implementation ownership', 'Less stakeholder negotiation', 'Less ambiguity', 'More time solving one problem deeply', "I'm not sure yet"]

const evidence = (id, label, title, summary, bullets, reflectionPhrase) => ({
  id,
  label,
  title,
  decisionSummary: summary,
  reflectionPhrase,
  evidence: { summary, bullets },
})

const customResponses = (items) => items.map(([id, title, description]) => ({
  id,
  title,
  description,
  reflectionPrompt: `When the trade-off became explicit, you chose to focus on ${title.toLowerCase()}. How did that feel?`,
}))

function makeBranches(config) {
  const branchFor = (decision) => {
    const authoredChallenge = config.branchChallenges?.[decision.id]
    return {
      stakeholder: authoredChallenge?.stakeholder || config.stakeholder,
      message: [authoredChallenge?.message || config.challenge],
      responses: [
        { id: 'explain-priority', title: 'Explain the priority and the opportunity cost', description: 'Name what the team is optimizing for, what will wait, and why that trade-off is acceptable for now.', reflectionPrompt: 'When the opportunity cost became explicit, you chose to keep the direction and explain why. How did that feel?' },
        { id: 'narrow-boundary', title: 'Narrow the commitment', description: 'Reduce the scope or boundary so the team can protect the most important outcome.', reflectionPrompt: 'When competing needs surfaced, you looked for a narrower boundary rather than trying to solve everything. How did that feel?' },
        { id: 'reopen-direction', title: 'Reopen the direction', description: 'Pause long enough to compare the risks again before asking the team to commit.', reflectionPrompt: 'When the trade-off was challenged, you chose to reopen the decision rather than defend it immediately. How did that feel?' },
      ],
    }
  }

  return {
    ...Object.fromEntries(config.decisions.map((decision) => [decision.id, branchFor(decision)])),
    custom: {
      stakeholder: config.stakeholder,
      message: [config.customChallenge],
      responses: customResponses(config.customResponseOptions),
    },
  }
}

function makeFollowUpSimulation(config) {
  return {
    id: config.id,
    transitionId: config.transitionId,
    mindset: config.mindset,
    scenarioId: config.scenarioId,
    experienceLabel: config.experienceLabel,
    isFollowUp: true,
    fromRole: config.fromRole,
    toRole: 'Product Manager',
    transitionLabel: `${config.fromRole} → Product Manager`,
    publicTransitionRoute: `/simulate/${config.transitionId}`,
    routes: makeRoutes(config.id),
    entry: {
      eyebrow: 'Another moment as the PM',
      heading: config.heading,
      introduction: config.introduction,
      scenario: config.scenario,
      reassurance: ["You don't need to know the right answer.", 'Just explore the situation the way you naturally would.'],
    },
    explore: {
      heading: 'What do you want to understand first?',
      supportingCopy: 'There are several ways to look at the situation. Start wherever your curiosity takes you.',
      options: config.exploreOptions,
      customQuestion: commonCustomQuestion,
      continueLabel: 'I have enough to make a call',
    },
    decide: {
      eyebrow: 'Decide',
      heading: config.decisionHeading,
      supportingCopy: config.decisionCopy,
      evidenceHeading: "What you've looked at",
      options: config.decisions,
      customLabel: "I'd take a different approach",
      customPrompt: 'What would you ask the team to do?',
      customPlaceholder: 'Write a short direction in your own words.',
      reasonHeading: 'What matters most in your decision?',
      reasons: config.reasons,
      customReasonPlaceholder: 'What else matters here?',
      cta: 'Make the call',
    },
    respond: {
      heading: 'Your direction meets the team.',
      supportingCopy: 'Another capable stakeholder now asks you to own the trade-off—not prove that there was one correct answer.',
      prompt: 'How would you respond?',
      customLabel: 'Respond in your own words',
      customPlaceholder: 'What would you say?',
      cta: 'See what you noticed',
      branches: makeBranches(config),
    },
    reflect: {
      heading: 'What did you notice about the work?',
      supportingCopy: "There wasn't a right path through that situation. The useful part is noticing what the experience asked of you.",
      roleObservations: config.roleObservations,
      feelingHeading: 'How did that experience feel?',
      energizing: { heading: 'What felt energizing?', options: config.energizing, placeholder: 'What else felt energizing?' },
      uncomfortable: { heading: 'What felt unfamiliar or uncomfortable?', options: config.uncomfortable, placeholder: 'What else felt unfamiliar?' },
      cta: 'Continue to your reflection',
    },
    futureFeeling: followUpFeelings,
    nextExperiment: {
      'keep-exploring': { dynamicFollowUps: true },
      'still-unsure': { dynamicFollowUps: true },
      'not-for-me': {
        heading: 'What would you want more of instead?',
        choices: config.moreOfOptions,
        summary: "Career GPS will eventually help you explore futures that keep more of what you want and less of what didn't resonate here.",
      },
      decideLater: "I'll decide later.",
    },
    outcomes: followUpOutcomes,
  }
}

const stakeholderConflictDecisions = [
  { id: 'enterprise-feature', title: 'Build the enterprise approval capability', description: 'Prioritize the renewal request for the strategic account.', tradeOff: 'Protect the account, while broader reliability work waits.' },
  { id: 'reliability', title: 'Prioritize reliability', description: 'Address recurring workflow failures affecting a wider customer base.', tradeOff: 'Improve the core experience, while Sales carries renewal risk.' },
  { id: 'scoped-enterprise', title: 'Deliver a smaller scoped customer solution', description: 'Meet the highest-value approval need without building the full custom capability.', tradeOff: 'Reduce both risks, while fully satisfying neither request.' },
]

export const baStakeholderConflictSimulation = makeFollowUpSimulation({
  id: 'ba-to-pm-stakeholder-conflict', transitionId: 'ba-to-pm', mindset: 'explore-more', scenarioId: 'stakeholder-conflict', experienceLabel: 'Stakeholder conflict', fromRole: 'Business Analyst',
  heading: 'Everyone wants something different.', introduction: 'Experience choosing among legitimate needs and aligning people around what will not be built.',
  scenario: ['You own a B2B workflow product.', 'A large enterprise customer wants a custom approval capability before renewal, and Sales says the account is strategically important.', 'Engineering says the request would delay reliability work affecting many customers.', 'Support says recurring workflow failures are creating broader customer pain.', 'The team has capacity for only one major priority this cycle.'],
  exploreOptions: [
    evidence('strategic-customer', 'Strategic customer', 'Understand the renewal and the users affected', 'The enterprise account is valuable and at renewal risk, while the requested workflow serves a concentrated group of users.', ['The account represents 8% of annual recurring revenue.', 'About 240 users would use the approval workflow.', 'The customer has named it as an important renewal consideration.', 'No contractual commitment requires delivery this cycle.'], 'the strategic customer value and the users affected'),
    evidence('reliability-impact', 'Reliability impact', 'See the broader workflow failures', 'Recurring workflow failures affect 37 customers and interrupt high-value work several times each week.', ['37 customers saw at least one workflow failure last month.', 'Failures occur most often during complex approval chains.', 'Several customers have delayed time-sensitive work.', 'Support escalations tied to the issue rose 22% this quarter.'], 'the frequency and consequences of reliability failures'),
    evidence('commitments', 'Organizational commitments', 'Understand what each team has promised', 'Sales created strong expectations, Engineering has one major cycle of capacity, and Support escalations are rising.', ['Sales described the request as a likely near-term priority.', 'Engineering can fund the capability or the reliability program, not both.', 'Support has promised affected customers a clearer reliability plan.', 'Leadership has not pre-selected a priority.'], 'the commitments and constraints each stakeholder carried'),
  ],
  decisionHeading: 'What should the team prioritize this cycle?', decisionCopy: 'Each option protects something important. Which trade-off do you want the team to make?', decisions: stakeholderConflictDecisions,
  reasons: ['Customer breadth', 'Renewal risk', 'Reliability', 'Existing commitments', 'Reversibility', 'Team capacity', 'Something else'],
  stakeholder: 'Elena — Sales Lead', challenge: "Saying every need matters won't tell the team what we're actually choosing.",
  branchChallenges: {
    'enterprise-feature': { stakeholder: 'Priya — Engineering Lead', message: 'If we build the customer capability, what reliability risk are we asking the broader customer base to carry?' },
    reliability: { stakeholder: 'Elena — Sales Lead', message: 'If we prioritize reliability, what should I tell the account about the renewal risk we are accepting?' },
    'scoped-enterprise': { stakeholder: 'Nadia — VP, Product', message: 'Are we finding a smart boundary, or spreading the team too thin to make either problem meaningfully better?' },
  },
  customChallenge: 'I can work with that direction, but someone is going to be disappointed. Which stakeholder risk are you most willing to accept?',
  customResponseOptions: [['renewal-risk', 'enterprise renewal risk', 'Accept that the strategic account may not get what it wants this cycle.'], ['reliability-risk', 'broader reliability risk', 'Accept that recurring failures may continue while the team works elsewhere.'], ['expectation-risk', 'stakeholder expectation risk', 'Accept that more than one stakeholder may remain partly dissatisfied.']],
  moreOfOptions: baMoreOf,
  roleObservations: ['Product Management often means choosing among legitimate competing needs rather than finding an option everyone prefers.', 'The direction becomes real when you explain what will not be built and own the opportunity cost that remains.'],
  energizing: ['Comparing competing customer needs', 'Choosing the priority', 'Finding a workable boundary', 'Explaining the trade-off', 'Influencing across teams', 'None of these', 'Something else'],
  uncomfortable: ['Saying no to an important stakeholder', 'Accepting renewal risk', 'Delaying broader reliability work', 'Owning opportunity cost', 'Leaving a legitimate need unmet', 'Nothing in particular', 'Something else'],
})

const productStrategyDecisions = [
  { id: 'core', title: 'Deepen the core product', description: 'Invest in the strongest unmet needs of existing enterprise customers.', tradeOff: 'Build on current strength, while new-market and AI opportunities wait.' },
  { id: 'new-segment', title: 'Expand to the new segment', description: 'Adapt the product for mid-market customers with a different buying motion.', tradeOff: 'Pursue a broader market, while accepting product-gap and go-to-market risk.' },
  { id: 'ai', title: 'Invest in AI capability', description: 'Place the major bet on an AI-assisted workflow.', tradeOff: 'Seek differentiation, while evidence and technical certainty remain incomplete.' },
  { id: 'experiment', title: 'Run a smaller strategic experiment first', description: 'Test one critical assumption before making the full bet.', tradeOff: 'Buy learning, while delaying a larger commitment.' },
]

export const baProductStrategySimulation = makeFollowUpSimulation({
  id: 'ba-to-pm-product-strategy', transitionId: 'ba-to-pm', mindset: 'explore-more', scenarioId: 'product-strategy', experienceLabel: 'Product strategy', fromRole: 'Business Analyst',
  heading: 'Where should we place the bet?', introduction: 'Experience choosing a longer-horizon direction before the evidence is complete.',
  scenario: ['You own a mature workflow product with limited investment capacity.', 'Leadership sees three plausible opportunities for the next 6–12 months: deepen the core enterprise workflow, expand into the mid-market, or invest in an AI-assisted capability.', 'All three have plausible upside.', 'None has complete evidence.', 'The team can make one major strategic bet.'],
  exploreOptions: [
    evidence('existing-customer', 'Existing customer opportunity', 'Understand the strength of the core', 'Existing enterprise customers retain well and have valuable unmet workflow needs, but expansion is concentrated.', ['Retention is strongest among customers using the core workflow deeply.', 'Expansion potential is meaningful in two enterprise segments.', 'Customers want better control and automation.', 'The product already has a strong competitive position in the core.'], 'retention, expansion, and unmet needs in the existing customer base'),
    evidence('new-segment', 'New segment opportunity', 'Understand the mid-market path', 'The mid-market is large, but the product and sales motion would need meaningful adaptation.', ['The addressable segment is nearly three times the current enterprise niche.', 'Prospects cite setup complexity and enterprise-oriented packaging.', 'Sales cycles could be shorter but average contract value would fall.', 'Two competitors already serve the segment well.'], 'the market size, product gaps, and competitive position in the new segment'),
    evidence('ai-opportunity', 'AI opportunity', 'Understand the emerging capability', 'Customer interest and competitor activity are increasing, while technical uncertainty and willingness to pay remain unclear.', ['A third of recent customer conversations mention AI-assisted workflows.', 'Two competitors have announced early capabilities.', 'The team can prototype quickly but production reliability is uncertain.', 'Customers describe differentiation potential more often than a clear budget.'], 'customer interest, technical uncertainty, and potential AI differentiation'),
  ],
  decisionHeading: 'Where should the product place its next major bet?', decisionCopy: 'Choose what to pursue—and what not to invest in—for the next 6–12 months.', decisions: productStrategyDecisions,
  reasons: ['Existing customer strength', 'Market size', 'Differentiation', 'Evidence quality', 'Strategic fit', 'Reversibility', 'Something else'],
  stakeholder: 'Nadia — VP, Product', challenge: 'All three directions have a case. What are you explicitly choosing not to pursue, and why is that acceptable?',
  customChallenge: 'All three directions have a case. What are you explicitly choosing not to pursue, and why is that acceptable?',
  customResponseOptions: [['near-term-growth', 'near-term growth', 'Accept slower expansion while the product strengthens another advantage.'], ['existing-base', 'more investment in the existing base', 'Accept that current enterprise opportunities may wait.'], ['emerging-bet', 'the emerging AI bet', 'Accept that the company may enter later if the opportunity becomes real.']],
  moreOfOptions: baMoreOf,
  roleObservations: ['Product strategy means choosing where to invest before every important uncertainty can be resolved.', 'A strategic bet also defines the opportunities the product will deliberately leave unfunded.'],
  energizing: ['Comparing long-horizon opportunities', 'Choosing where to invest', 'Connecting evidence to direction', 'Thinking beyond the next sprint', 'Naming what not to pursue', 'None of these', 'Something else'],
  uncomfortable: ['Choosing before evidence was complete', 'Leaving a plausible opportunity unfunded', 'Owning a longer-horizon bet', 'Balancing current and future customers', 'Accepting strategic opportunity cost', 'Nothing in particular', 'Something else'],
})

const discoveryDecisions = [
  { id: 'build', title: 'Build the requested feature', description: 'Commit to the bulk-edit workflow customers explicitly requested.', tradeOff: 'Respond directly, before the underlying need is fully clear.' },
  { id: 'different', title: 'Solve the underlying need differently', description: 'Address repeated-work frustration without reproducing the request exactly.', tradeOff: 'Potentially solve more broadly, with added discovery and solution risk.' },
  { id: 'experiment', title: 'Run a smaller experiment', description: 'Test the highest-friction part of the workflow first.', tradeOff: 'Learn sooner, while delaying a complete solution.' },
  { id: 'not-now', title: 'Do not prioritize now', description: 'Keep current priorities until the opportunity is clearer.', tradeOff: 'Protect capacity, while customer frustration remains.' },
]

export const baCustomerDiscoverySimulation = makeFollowUpSimulation({
  id: 'ba-to-pm-customer-discovery', transitionId: 'ba-to-pm', mindset: 'unsure', scenarioId: 'customer-discovery', experienceLabel: 'Customer discovery', fromRole: 'Business Analyst',
  heading: 'Is this actually a problem worth solving?', introduction: 'Experience separating an explicit customer request from the need underneath it.',
  scenario: ['Several customers are asking for a bulk-edit workflow.', 'Leadership likes the idea.', 'Usage data is mixed: some users struggle with the existing process, while others created workarounds.', 'Engineering says the requested feature requires meaningful investment.', 'You have to decide whether there is a problem worth solving before committing to the requested solution.'],
  exploreOptions: [
    evidence('conversations', 'Customer conversations', 'Hear the requests and frustrations underneath', 'Customers request bulk editing, but the desired outcomes range from speed to error prevention and repeatable workflows.', ['Operations teams want to update hundreds of records quickly.', 'Managers worry more about inconsistent changes than speed.', 'Some customers export, edit, and import data as a workaround.', 'Several users say the worst part is recovering from a mistaken edit.'], 'the requests, desired outcomes, and workarounds customers described'),
    evidence('behavior', 'Usage behavior', 'See where the current workflow breaks down', 'Heavy users repeat the workflow often, but abandonment and workaround use vary substantially by segment.', ['12% of active accounts perform repeated edits each week.', 'Abandonment is highest among high-volume operations teams.', 'Smaller customers rarely attempt the workflow.', 'Workaround use is concentrated in two enterprise segments.'], 'the frequency, abandonment, and segment differences in usage'),
    evidence('business', 'Business context', 'Understand the opportunity and cost', 'High-value customers feel the problem, but adoption potential is uncertain and the full build would displace other roadmap work.', ['Affected enterprise accounts represent 19% of revenue.', 'Only a subset has committed to adopting a new workflow.', 'The full feature is estimated at eight engineer-weeks.', 'A lightweight experiment could test the core need in two weeks.'], 'customer value, adoption potential, and engineering cost'),
  ],
  decisionHeading: 'What should the team do about the bulk-edit request?', decisionCopy: 'Choose how much evidence—and investment—the problem deserves right now.', decisions: discoveryDecisions,
  reasons: ['Customer pain', 'Problem clarity', 'Adoption potential', 'Revenue impact', 'Engineering cost', 'Learning quickly', 'Something else'],
  stakeholder: 'Nadia — VP, Product', challenge: 'Customers are explicitly asking for this. Why are we making it harder than it needs to be?',
  customChallenge: 'I can work with that direction. What would have to be true for you to feel this problem deserves more investment?',
  customResponseOptions: [['broader-pattern', 'a broader customer pattern', 'Look for evidence that the need extends beyond the customers currently asking.'], ['meaningful-impact', 'meaningful customer impact', 'Look for evidence that the current workflow prevents an important outcome.'], ['testable-path', 'a smaller testable path', 'Look for a lower-cost step that clarifies the opportunity.']],
  moreOfOptions: baMoreOf,
  roleObservations: ['A feature request can be evidence of a problem without defining the right solution.', 'Product Management includes deciding whether a problem deserves investment before a solution creates momentum.'],
  energizing: ['Finding the need beneath the request', 'Comparing customer segments', 'Deciding what deserves investment', 'Designing a smaller learning step', 'Staying curious before committing', 'None of these', 'Something else'],
  uncomfortable: ['Not taking requests literally', 'Delaying a visible solution', 'Working with mixed evidence', 'Saying the problem is not a priority', 'Choosing before solution details were clear', 'Nothing in particular', 'Something else'],
})

const livingDecisionDecisions = [
  { id: 'keep-investing', title: 'Keep investing in the current direction', description: 'Give the launched workflow more time and improvement.', tradeOff: 'Preserve the bet, while delaying other roadmap work.' },
  { id: 'change-experience', title: 'Change the experience', description: 'Address the confusion and reposition the workflow.', tradeOff: 'Invest again without knowing whether execution or direction is the main issue.' },
  { id: 'focused-experiment', title: 'Run a focused experiment', description: 'Test the largest adoption uncertainty with a bounded change.', tradeOff: 'Buy clearer evidence, while postponing a definitive call.' },
  { id: 'stop', title: 'Stop / roll back', description: 'End the current direction and recover capacity.', tradeOff: 'Limit further cost, while giving up possible delayed value.' },
]

export const baLivingWithDecisionSimulation = makeFollowUpSimulation({
  id: 'ba-to-pm-living-with-decision', transitionId: 'ba-to-pm', mindset: 'unsure', scenarioId: 'living-with-decision', experienceLabel: 'Living with the decision', fromRole: 'Business Analyst',
  heading: "The launch didn't work the way you expected.", introduction: 'Experience owning what happens after a product decision becomes real.',
  scenario: ['Three weeks ago, your team launched a major workflow improvement.', 'Initial adoption is below expectations.', 'Sales says customers need more time, Engineering wants to move on, and Support says some customers are confused.', 'Leadership asks whether the team should keep investing, change direction, gather more evidence, or stop.', 'There is no crisis and no obvious answer.'],
  exploreOptions: [
    evidence('adoption', 'Adoption', 'See how customers are using the launch', 'Adoption is below forecast, varies by segment, and weakens after customers try the workflow once.', ['18% of eligible accounts have tried the workflow.', 'Adoption is strongest among customers included in the beta.', 'Only 41% of first-time users return within a week.', 'Abandonment concentrates at the new setup step.'], 'the adoption trend, repeated usage, and abandonment pattern'),
    evidence('customer-response', 'Customer response', 'Hear how customers experience the change', 'Customers see potential value, but confusion and established workarounds reduce the urgency to change.', ['Some customers are unsure when the new workflow should be used.', 'Power users value the improvement once configured.', 'Several teams returned to existing workarounds.', 'Support questions focus on setup and expected value.'], 'customer confusion, perceived value, and workarounds'),
    evidence('continuing-cost', 'Cost of continuing', 'Understand what another investment would displace', 'Meaningful improvement is possible, but it would consume capacity promised to other roadmap work.', ['A focused onboarding change would take two weeks.', 'A broader redesign would take most of the next cycle.', 'Sales has already referenced the workflow in several accounts.', 'Two planned roadmap items would move if investment continues.'], 'engineering effort, commitments, and the opportunity cost of continuing'),
  ],
  decisionHeading: 'What should happen next?', decisionCopy: 'Decide whether the weak launch needs persistence, a change, more evidence, or an ending.', decisions: livingDecisionDecisions,
  reasons: ['Adoption trend', 'Customer value', 'Quality of execution', 'Cost to continue', 'Existing commitments', 'Learning value', 'Something else'],
  stakeholder: 'Priya — Engineering Lead', challenge: "We've already spent a quarter on this. How much more evidence do we need before we move on?",
  customChallenge: "We've already spent a quarter on this. How much more evidence do we need before we move on?",
  customResponseOptions: [['adoption-signal', 'a clear adoption signal', 'Define the usage change that would justify continued investment.'], ['customer-value', 'evidence of repeat customer value', 'Look for customers returning because the workflow solves an important need.'], ['time-boundary', 'a time-bounded decision point', 'Set a clear point for choosing whether to persist or stop.']],
  moreOfOptions: baMoreOf,
  roleObservations: ['Product ownership continues after launch, when evidence can challenge a decision the team already made.', 'The PM has to separate weak execution from weak direction and decide when to persist or change.'],
  energizing: ['Reading post-launch evidence', 'Staying with a decision over time', 'Separating execution from direction', 'Choosing whether to persist', 'Defining the next learning step', 'None of these', 'Something else'],
  uncomfortable: ['Revisiting a previous decision', 'Continuing after weak adoption', 'Stopping work the team invested in', 'Owning outcomes after launch', 'Choosing without a crisis or obvious answer', 'Nothing in particular', 'Something else'],
})

const buildBuyDecisions = [
  { id: 'build', title: 'Build', description: 'Create and maintain the fraud-detection capability internally.', tradeOff: 'Own the capability, while delaying other roadmap work.' },
  { id: 'buy', title: 'Buy', description: 'Adopt the production-ready vendor product.', tradeOff: 'Move faster, with higher cost and limited differentiation.' },
  { id: 'partner', title: 'Partner', description: 'Use the strategic platform API.', tradeOff: 'Gain accuracy and speed, while accepting external dependency.' },
  { id: 'hybrid', title: 'Hybrid approach', description: 'Combine an external foundation with targeted internal differentiation.', tradeOff: 'Balance leverage and control, with added integration complexity.' },
]

export const engineerBuildBuyPartnerSimulation = makeFollowUpSimulation({
  id: 'engineer-to-pm-build-buy-partner', transitionId: 'engineer-to-pm', mindset: 'explore-more', scenarioId: 'build-buy-partner', experienceLabel: 'Build, buy, or partner?', fromRole: 'Software Engineer',
  heading: "Being able to build it doesn't mean we should.", introduction: 'Experience deciding where the company should invest, beyond what the team can technically build.',
  scenario: ['You own a product that needs a new fraud-detection capability.', 'Engineering can build a strong solution, but it would require significant capacity and delay other roadmap work.', 'A vendor can deliver in six weeks, but it is expensive and offers limited differentiation.', 'A strategic platform offers an accurate API and faster time-to-market, but creates external dependency.', 'The PM decision is about where the company should invest.'],
  exploreOptions: [
    evidence('engineering', 'Engineering', 'Understand the internal build path', 'The team can build the capability, but development, maintenance, and roadmap opportunity cost are substantial.', ['An initial production version would take four months.', 'The team has relevant machine-learning and platform expertise.', 'Ongoing tuning and fraud operations would require dedicated ownership.', 'Two customer-facing roadmap items would move into the following half.'], 'engineering capability, maintenance, and roadmap opportunity cost'),
    evidence('external', 'Vendor / partner', 'Compare external paths', 'The vendor offers operational maturity; the partner offers speed and accuracy but deeper platform dependency.', ['The vendor contract is expensive but includes fraud operations.', 'The partner API is faster to integrate and performs best in tests.', 'Both require customer-data review and integration work.', 'Switching away from the partner later would be costly.'], 'external cost, reliability, integration, and dependency'),
    evidence('product-value', 'Product / customer value', 'Understand where differentiation matters', 'Customers need reliable fraud prevention quickly, but few view the detection engine itself as the product differentiator.', ['Two large customers require better detection this quarter.', 'Customers value fewer false blocks and clearer resolution workflows.', 'The company differentiates more on workflow than detection models.', 'Owning more data could create longer-term strategic value.'], 'urgency, customer expectations, and long-term differentiation'),
  ],
  decisionHeading: 'How should the company create the capability?', decisionCopy: 'Choose where internal engineering effort creates enough strategic value to justify the investment.', decisions: buildBuyDecisions,
  reasons: ['Time to market', 'Differentiation', 'Engineering capacity', 'Long-term control', 'Cost', 'External dependency', 'Something else'],
  stakeholder: 'Marcus — Engineering Lead', challenge: 'We can absolutely build this ourselves. Why should we give a vendor something our team is capable of owning?',
  customChallenge: 'We can absolutely build this ourselves. Why should we give a vendor something our team is capable of owning?',
  customResponseOptions: [['differentiation', 'where differentiation matters', 'Clarify which part of the capability customers should uniquely value from us.'], ['leverage', 'business leverage', 'Compare the outcome created by each unit of internal capacity.'], ['long-term-control', 'long-term control', 'Name which dependency or strategic asset is worth owning.']],
  moreOfOptions: engineerMoreOf,
  roleObservations: ['Technical capability does not by itself determine where the company should invest.', 'Product ownership includes deciding where engineering effort creates differentiation and where external leverage is useful.'],
  energizing: ['Comparing build, buy, and partner paths', 'Connecting architecture to strategy', 'Allocating engineering investment', 'Thinking about business leverage', 'Choosing where to differentiate', 'None of these', 'Something else'],
  uncomfortable: ['Not building what the team could build', 'Accepting vendor dependency', 'Trading technical control for speed', 'Choosing business leverage over technical elegance', 'Moving other engineering work', 'Nothing in particular', 'Something else'],
})

const growthDecisions = [
  { id: 'optimize', title: 'Invest heavily in optimization', description: 'Use engineering capacity to reduce infrastructure cost.', tradeOff: 'Improve economics through code, while delaying product features.' },
  { id: 'pricing', title: 'Change pricing / packaging', description: 'Align customer price more closely with costly usage.', tradeOff: 'Improve margin, while risking slower adoption and customer friction.' },
  { id: 'limits', title: 'Introduce usage limits', description: 'Bound the most expensive behaviors.', tradeOff: 'Protect economics, while changing the unrestricted experience customers value.' },
  { id: 'lower-margin', title: 'Accept lower margins temporarily', description: 'Preserve growth while the team learns more.', tradeOff: 'Keep momentum, while economics remain unattractive.' },
  { id: 'combined', title: 'Combine smaller moves', description: 'Pair bounded optimization with targeted packaging or limits.', tradeOff: 'Spread the response across levers, with less impact from any one move.' },
]

export const engineerGrowthEconomicsSimulation = makeFollowUpSimulation({
  id: 'engineer-to-pm-growth-economics', transitionId: 'engineer-to-pm', mindset: 'explore-more', scenarioId: 'growth-economics', experienceLabel: 'When growth gets expensive', fromRole: 'Software Engineer',
  heading: "The product works. The economics don't.", introduction: 'Experience owning growth and sustainability when code is only one lever.',
  scenario: ['You own a rapidly growing developer API.', 'Usage is increasing faster than expected and customers love the product.', 'Infrastructure cost per customer is making the economics increasingly unattractive.', 'Engineering can optimize the system, Finance wants pricing changes, and Sales fears that limits or higher prices will hurt adoption.', 'Customers expect the current experience to remain unrestricted.'],
  exploreOptions: [
    evidence('usage', 'Product usage', 'See what is driving growth and cost', 'Growth is strong, but a small set of high-volume behaviors creates disproportionate cost and value.', ['API usage grew 68% in three months.', 'Enterprise workloads create most revenue and most infrastructure cost.', 'Two high-cost request patterns drive 46% of compute.', 'Customers using those patterns report the strongest product value.'], 'growth, customer segments, and high-cost behaviors'),
    evidence('economics', 'Economics', 'Understand margin and pricing', 'Current packaging disconnects price from the usage patterns that create infrastructure cost.', ['Gross margin fell from 72% to 49%.', 'The highest-cost 10% of customers are profitable only on expansion assumptions.', 'Current tiers include generous pooled usage.', 'Five customers represent a third of total infrastructure cost.'], 'infrastructure cost, margin, pricing, and customer concentration'),
    evidence('engineering-options', 'Engineering options', 'Understand the optimization path', 'Engineering can reduce cost meaningfully, but the largest savings require time and carry technical risk.', ['A two-week change could reduce cost by 8–12%.', 'A deeper caching and routing effort could save 25–35%.', 'The deeper work would delay two planned features by a quarter.', 'Savings estimates depend on workload behavior remaining stable.'], 'optimization effort, expected savings, roadmap impact, and technical risk'),
  ],
  decisionHeading: 'How should the product respond to expensive growth?', decisionCopy: 'Choose how to balance adoption, customer value, margin, and engineering investment.', decisions: growthDecisions,
  reasons: ['Customer value', 'Sustainable economics', 'Growth momentum', 'Engineering opportunity cost', 'Pricing fairness', 'Reversibility', 'Something else'],
  stakeholder: 'Leah — Head of Sales', challenge: "If we change the economics now, we may slow the exact adoption everyone has been celebrating. What are we optimizing for?",
  customChallenge: "If we change the economics now, we may slow the exact adoption everyone has been celebrating. What are we optimizing for?",
  customResponseOptions: [['sustainable-value', 'sustainable customer value', 'Protect the value customers rely on while creating a viable economic model.'], ['growth', 'continued growth', 'Preserve adoption while accepting a bounded period of weaker margins.'], ['learning', 'faster economic learning', 'Use a reversible move to learn how customers respond.']],
  moreOfOptions: engineerMoreOf,
  roleObservations: ['Product economics can make pricing, packaging, and customer behavior as important as technical optimization.', 'The PM owns the balance between growth and sustainability even when Engineering controls the optimization work.'],
  energizing: ['Connecting usage to economics', 'Choosing among product and technical levers', 'Thinking about pricing', 'Balancing growth and sustainability', 'Owning business outcomes', 'None of these', 'Something else'],
  uncomfortable: ['Changing a product customers love', 'Making pricing trade-offs', 'Accepting lower margins', 'Delaying features for optimization', 'Owning an economic outcome', 'Nothing in particular', 'Something else'],
})

const ownsHowDecisions = [
  { id: 'let-own', title: 'Let Engineering own the implementation', description: 'Accept the proposed architecture because it meets the product requirements.', tradeOff: 'Protect trust and timing, while setting aside your preferred technical approach.' },
  { id: 'specific-risk', title: 'Challenge one specific product risk', description: 'Focus the discussion on a customer, reliability, performance, or security outcome.', tradeOff: 'Use technical judgment narrowly, without reopening the whole architecture.' },
  { id: 'reconsider', title: 'Ask Engineering to reconsider the architecture', description: 'Request a broader technical review before launch.', tradeOff: 'Seek a stronger approach, while delaying delivery.' },
  { id: 'validation', title: 'Run a small technical validation', description: 'Test the most consequential assumption before committing.', tradeOff: 'Buy evidence, with a smaller delay and an incomplete answer.' },
]

export const engineerOwnsHowSimulation = makeFollowUpSimulation({
  id: 'engineer-to-pm-engineering-owns-how', transitionId: 'engineer-to-pm', mindset: 'unsure', scenarioId: 'engineering-owns-how', experienceLabel: 'Engineering owns the how', fromRole: 'Software Engineer',
  heading: "You wouldn't build it this way.", introduction: 'Experience using technical judgment when you do not own the implementation.',
  scenario: ["Your engineering team proposes an implementation that meets the customer outcome, timeline, reliability expectations, and security requirements.", 'Your technical background leads you to prefer a different architecture.', 'The Engineering Lead believes the proposed approach is easier to operate and good enough for the product.', 'Changing it would delay launch.', 'You must determine whether you are identifying a product risk or preferring a different technical approach.'],
  exploreOptions: [
    evidence('requirements', 'Product requirements', 'Clarify what the product needs', 'The proposed approach meets the stated customer, reliability, performance, security, and timeline requirements.', ['Customers need the workflow before a seasonal peak.', 'The reliability target is 99.9%.', 'Expected latency remains within the product requirement.', 'Security review found no blocking issue.'], 'the customer outcome, reliability, performance, and timeline requirements'),
    evidence('reasoning', 'Engineering reasoning', 'Understand why the team prefers its approach', 'Engineering chose the simpler design for operability and delivery risk, while accepting some longer-term limits.', ['The team has operated similar services successfully.', 'The proposed architecture has fewer new dependencies.', 'On-call diagnosis would be simpler.', 'A future scale threshold may require rework.'], 'the architecture rationale, maintainability, and delivery risk'),
    evidence('alternative', 'Alternative approach', 'Compare your preferred architecture', 'Your alternative offers stronger long-term flexibility but adds work, dependencies, and near-term delivery risk.', ['The alternative scales further before rework.', 'It requires a new platform dependency.', 'Implementation would add four to six weeks.', 'Customers would not notice a difference at expected launch volume.'], 'the benefits, added work, risks, and customer impact of the alternative'),
  ],
  decisionHeading: 'How should you handle the implementation disagreement?', decisionCopy: 'Decide how technical depth should influence Product without assuming implementation ownership.', decisions: ownsHowDecisions,
  reasons: ['Customer outcome', 'Product risk', 'Engineering trust', 'Launch timing', 'Long-term flexibility', 'Evidence needed', 'Something else'],
  stakeholder: 'Marcus — Engineering Lead', challenge: "I value your technical background, but I need to understand whether you're raising a product risk or telling Engineering how to implement the solution.",
  customChallenge: "I value your technical background, but I need to understand whether you're raising a product risk or telling Engineering how to implement the solution.",
  customResponseOptions: [['customer-outcome', 'the customer outcome at risk', 'Name the specific user or business outcome the implementation could threaten.'], ['requirement-boundary', 'the product requirement boundary', 'Clarify what Product needs and leave the implementation choice with Engineering.'], ['evidence', 'a small piece of evidence', 'Identify the validation that would distinguish product risk from technical preference.']],
  moreOfOptions: engineerMoreOf,
  roleObservations: ['Outcome ownership and implementation ownership are different, even when the PM has technical depth.', 'Technical judgment can influence Product without removing Engineering ownership or trust.'],
  energizing: ['Translating technical concerns into product risk', 'Clarifying outcome requirements', 'Using technical depth without implementing', 'Building trust with Engineering', 'Choosing when to intervene', 'None of these', 'Something else'],
  uncomfortable: ['Not choosing the architecture', 'Trusting a design I would not choose', 'Separating preference from product risk', 'Being accountable without implementation control', 'Possibly delaying launch', 'Nothing in particular', 'Something else'],
})

const launchReadyDecisions = [
  { id: 'delay', title: 'Delay launch until organizational readiness improves', description: 'Resolve several launch-system gaps before customers receive the product.', tradeOff: 'Create a more prepared launch, while losing timing and momentum.' },
  { id: 'narrow', title: 'Launch narrowly to a smaller customer group', description: 'Use a limited rollout to support customers closely and learn.', tradeOff: 'Preserve timing and reduce risk, while limiting reach.' },
  { id: 'parallel', title: 'Launch on time and fix readiness gaps in parallel', description: 'Keep the date while teams close gaps during rollout.', tradeOff: 'Protect momentum, while accepting customer and organizational friction.' },
  { id: 'one-blocker', title: 'Prioritize one critical non-technical blocker', description: 'Choose the readiness gap most likely to undermine customer success.', tradeOff: 'Focus the week, while other gaps remain.' },
]

export const engineerLaunchReadySimulation = makeFollowUpSimulation({
  id: 'engineer-to-pm-launch-technically-ready', transitionId: 'engineer-to-pm', mindset: 'unsure', scenarioId: 'launch-technically-ready', experienceLabel: 'The launch is technically ready', fromRole: 'Software Engineer',
  heading: 'Almost nothing left is code.', introduction: 'Experience a launch week where the highest-value work may involve little technical problem-solving.',
  scenario: ['The product is technically ready to launch next week.', 'Engineering says its work is essentially complete.', 'Support is unprepared for likely questions, Sales is unclear which customers should receive it first, pricing is unresolved, onboarding is confusing, and Analytics cannot yet tell whether customers succeed.', 'You have one week before launch.', 'The highest-value work may involve very little technical problem-solving.'],
  exploreOptions: [
    evidence('go-to-market', 'Go-to-market readiness', 'Understand Sales and rollout readiness', 'The product has customer interest, but targeting, positioning, pricing, and rollout ownership remain unclear.', ['Sales has a broad prospect list but no first-customer criteria.', 'Positioning differs across three internal decks.', 'Pricing approval is still pending.', 'No owner has been named for launch communications.'], 'sales enablement, targeting, positioning, and rollout readiness'),
    evidence('customer-readiness', 'Customer readiness', 'Understand onboarding and support', 'Customers can use the product, but onboarding and support gaps could make the first experience confusing.', ['Setup instructions assume knowledge beta users already had.', 'Support has no troubleshooting guide.', 'Two expected questions require policy decisions.', 'A guided first-run experience is not ready.'], 'onboarding, support, education, and expected customer friction'),
    evidence('measurement', 'Measurement', 'Understand post-launch learning', 'The team can measure activation but not whether customers achieve the outcome the product promises.', ['Basic event tracking is live.', 'The success metric has not been agreed across teams.', 'Instrumentation misses the final customer outcome.', 'A manual review could fill part of the gap for a small rollout.'], 'success metrics, instrumentation gaps, and post-launch learning'),
  ],
  decisionHeading: 'How should the product launch next week?', decisionCopy: 'Choose how to handle readiness when Engineering is done but the customer experience is not.', decisions: launchReadyDecisions,
  reasons: ['Customer success', 'Launch timing', 'Organizational readiness', 'Learning quality', 'Commercial momentum', 'Reversibility', 'Something else'],
  stakeholder: 'Marcus — Engineering Lead', challenge: "The product is ready. If we delay now, it's not because of Engineering. What exactly makes this a Product blocker?",
  customChallenge: "The product is ready. If we delay now, it's not because of Engineering. What exactly makes this a Product blocker?",
  customResponseOptions: [['customer-success', 'customer success risk', 'Name the readiness gap most likely to prevent customers from reaching value.'], ['learning', 'post-launch learning risk', 'Explain what the team would be unable to learn from the current launch.'], ['rollout-boundary', 'a narrower rollout boundary', 'Define the customer group the organization can support well next week.']],
  moreOfOptions: engineerMoreOf,
  roleObservations: ['Product launch readiness includes customer success, go-to-market coordination, and measurement—not only working software.', 'The PM remains accountable when the hardest launch problems sit outside Engineering.'],
  energizing: ['Orchestrating across teams', 'Preparing customers for success', 'Defining launch scope', 'Choosing the critical blocker', 'Designing post-launch learning', 'None of these', 'Something else'],
  uncomfortable: ['Working on problems that were not code', 'Owning organizational readiness', 'Delaying technically complete work', 'Launching with unresolved gaps', 'Coordinating without direct authority', 'Nothing in particular', 'Something else'],
})

export const followUpSimulations = [
  baStakeholderConflictSimulation,
  baProductStrategySimulation,
  baCustomerDiscoverySimulation,
  baLivingWithDecisionSimulation,
  engineerBuildBuyPartnerSimulation,
  engineerGrowthEconomicsSimulation,
  engineerOwnsHowSimulation,
  engineerLaunchReadySimulation,
]
