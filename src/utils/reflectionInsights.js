const intentionLanguage = {
  reversible: {
    suggestion: 'You deliberately preserved reversibility, which may mean you enjoy using bounded moves to learn before making a larger commitment.',
    tension: 'You preserved optionality here. How would this work feel when timing, contracts, or organizational commitments make the decision difficult to undo?',
  },
  'success-threshold': {
    suggestion: 'You wanted an explicit success or rollback condition, which may mean you enjoy turning uncertainty into observable decision boundaries.',
    tension: 'You looked for a clear threshold. How comfortable would you be when success cannot be reduced to one clean measure?',
  },
  'parallel-investigation': {
    suggestion: 'You kept learning active alongside the decision, which may mean you enjoy acting without treating the first answer as final.',
    tension: 'You kept investigation open while moving forward. At what point would additional learning become delay rather than useful risk reduction?',
  },
  commit: {
    suggestion: 'You intentionally created commitment, which may mean you enjoy giving a team clarity even while some uncertainty remains.',
    tension: 'You chose commitment over additional optionality. How would it feel to remain accountable if later evidence weakened the direction?',
  },
  'make-risk-explicit': {
    suggestion: 'You made the accepted risk visible, which may mean you enjoy helping teams move forward with a shared understanding of the trade-off.',
    tension: 'Naming a risk does not remove it. Would carrying that visible risk through launch feel energizing or draining?',
  },
  alignment: {
    suggestion: 'You invested in stakeholder alignment, which may mean you enjoy creating shared clarity across people with different priorities.',
    tension: 'You sought alignment here. How would this work feel when agreement remains impossible and the PM still has to choose?',
  },
  'customer-boundary': {
    suggestion: 'You defined a customer-protection boundary, which may mean you enjoy deciding where a product should deliberately limit itself.',
    tension: 'You protected a customer boundary at the expense of some product capability. How would you respond if growth pressure kept pushing that boundary outward?',
  },
}

const primaryTransitionLanguage = {
  'ba-to-pm': {
    decisions: {
      'promo-experience': {
        suggestion: 'You moved from customer and behavioral evidence toward a concrete experience change, which may mean you enjoy turning an ambiguous diagnosis into visible action under time pressure.',
        tension: 'You acted on the strongest customer-facing signal while technical risk remained. Would carrying an unresolved competing explanation feel productive or distracting?',
        experiment: 'Take one frustrating workflow you know, interview two people who use it, and propose the smallest change that would test the most important explanation.',
      },
      performance: {
        suggestion: 'You prioritized a technical system signal because it affected the wider checkout journey, which may mean you enjoy connecting system behavior to customer and business outcomes.',
        tension: 'You spent scarce capacity on a broad technical risk while visible customer confusion remained. How comfortable would you be explaining that trade-off through a high-stakes launch?',
        experiment: 'Choose a product problem with both UX and technical explanations. Write down the evidence that would make you fund one explanation before the other.',
      },
      'smaller-intervention': {
        suggestion: 'You chose a bounded intervention while more than one explanation remained plausible, which may mean you enjoy hypothesis-driven product work and learning through reversible action.',
        tension: 'A smaller move protects optionality, but leaders may sometimes read it as avoiding commitment. Would repeatedly defending that distinction feel energizing or draining?',
        experiment: 'Prioritize five competing requests, choose one reversible first step, and define the result that would make you expand, stop, or reverse it.',
      },
      custom: {
        suggestion: 'You created a direction outside the authored options, which may mean you enjoy reframing a constrained problem rather than accepting the choices already on the table.',
        tension: 'A novel direction can create better options, but it also creates additional alignment work. Would you enjoy earning commitment to an approach the team did not begin with?',
        experiment: 'Take a real decision framed as two or three fixed options. Propose a different path, then name its opportunity cost and the evidence that would invalidate it.',
      },
    },
    uncertainty: 'This checkout moment tested diagnosis, prioritization, and stakeholder influence. It did not test sustained roadmap ownership, customer discovery over time, writing requirements, or living with a launch result.',
    fallbackExperiment: 'Ask a working PM to describe a recent decision made with incomplete evidence, including what they chose not to do and what happened afterward.',
  },
  'engineer-to-pm': {
    decisions: {
      retrieval: {
        suggestion: 'You directed technical capacity toward improving overall product quality, which may mean you enjoy connecting engineering options to a measurable customer outcome rather than prescribing implementation.',
        tension: 'Average quality can improve while rare harmful failures remain. How would it feel to own a launch where the aggregate metric looked better but the hardest risk was unresolved?',
        experiment: 'Compare three technical approaches to the same customer problem. Choose one using customer impact, delivery cost, and residual risk—not technical elegance alone.',
      },
      guardrails: {
        suggestion: 'You protected customers by deliberately limiting product behavior, which may mean you enjoy defining where an emerging product should say no before it earns broader trust.',
        tension: 'A safer boundary can make the product feel less capable. Would you enjoy repeatedly defending reduced scope when customers and growth leaders want a more impressive experience?',
        experiment: 'Take an AI feature you use and define which requests it should refuse, what customer harm that boundary prevents, and what evidence would justify expanding it.',
      },
      'human-review': {
        suggestion: 'You used an operational safeguard around imperfect technology, which may mean you enjoy designing complete product systems that include people, cost, and workflow—not only software.',
        tension: 'Human review protects customers but can create a costly bottleneck. Would owning that operational trade-off feel as interesting as improving the technical system itself?',
        experiment: 'Map a human-in-the-loop workflow for one risky automated decision. Define when review is triggered, what it costs, and when automation has earned more autonomy.',
      },
      'staged-launch': {
        suggestion: 'You sequenced the launch around where the product could already create reliable value, which may mean you enjoy earning broader scope through customer evidence rather than treating launch as all-or-nothing.',
        tension: 'A staged launch can protect learning and customers, but it may disappoint leaders expecting a bigger promise. Would you enjoy holding that boundary under pressure?',
        experiment: 'Take a planned product launch and define the smallest customer group that could create meaningful learning, plus the evidence required for the next expansion.',
      },
      custom: {
        suggestion: 'You created a product direction outside the technical options presented, which may mean you enjoy reframing the outcome Engineering should optimize for.',
        tension: 'A different frame can improve the decision, but Product still has to leave implementation ownership with Engineering. Where would you draw that boundary?',
        experiment: 'Rewrite one technical debate as a product-outcome decision. Specify the customer boundary and success evidence, while leaving the implementation choice open.',
      },
    },
    uncertainty: 'This AI-support moment tested product boundaries, acceptable risk, and translating technical options into a launch direction. It did not test long-term roadmap ownership, go-to-market coordination, product economics, or being accountable when Engineering chooses an implementation you would not choose.',
    fallbackExperiment: 'Ask a technical PM about a decision where Engineering owned the implementation and Product owned the outcome. Notice which side of that boundary you would find hardest to release.',
  },
}

function joinNaturally(items) {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`
}

function lowerFirst(value = '') {
  return value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value
}

function selectedReasons(state) {
  return (state.decisionReasons || []).map((reason) => reason === 'Something else' && state.customReason?.trim()
    ? state.customReason.trim()
    : reason)
}

function selectedIntentions(state, simulation) {
  const options = simulation.respond.intentOptions || []
  return (state.responseIntentions || []).map((id) => options.find((option) => option.id === id)).filter(Boolean)
}

function selectedResponse(state, simulation) {
  const branch = simulation.respond.branches[state.decisionId] || simulation.respond.branches.custom
  return branch?.responses.find((response) => response.id === state.responseId)
}

function genericSuggestion(reasons, simulation) {
  const normalized = reasons.join(' ').toLowerCase()
  if (normalized.includes('customer')) return 'You gave customer consequences meaningful weight, which may mean you enjoy grounding product choices in who experiences the benefit or risk.'
  if (normalized.includes('reversib') || normalized.includes('learning')) return 'You emphasized learning and reversibility, which may mean you enjoy reducing uncertainty through bounded product moves.'
  if (normalized.includes('evidence') || normalized.includes('confidence')) return 'You emphasized the quality of the evidence, which may mean you enjoy deciding how much certainty a product choice actually requires.'
  if (normalized.includes('engineering') || normalized.includes('capacity') || normalized.includes('cost')) return 'You emphasized capacity and opportunity cost, which may mean you enjoy deciding where limited product investment creates the most leverage.'
  return `You made the trade-off explicit rather than trying to remove it, which may help you notice whether owning this part of ${simulation.toRole || 'the role'} feels engaging.`
}

const intentionOverlapTerms = {
  reversible: ['reversib', 'bounded', 'optionality'],
  'success-threshold': ['threshold', 'success condition', 'rollback condition'],
  'parallel-investigation': ['parallel', 'keep learning', 'investigat'],
  commit: ['commitment', 'commit to', 'team clarity'],
  'make-risk-explicit': ['risk visible', 'accepted risk', 'make the risk'],
  alignment: ['alignment', 'shared clarity'],
  'customer-boundary': ['customer boundary', 'product boundary', 'limiting product', 'should say no'],
}

function addsDistinctSignal(intention, suggestion = '') {
  const normalizedSuggestion = suggestion.toLowerCase()
  return !(intentionOverlapTerms[intention.id] || []).some((term) => normalizedSuggestion.includes(term))
}

export function createEvidenceBackedReflection(state, simulation) {
  const transitionId = simulation.transitionId || simulation.id
  const transitionLanguage = primaryTransitionLanguage[transitionId]
  const decisionLanguage = transitionLanguage?.decisions[state.decisionId]
    || transitionLanguage?.decisions.custom
  const explored = (state.exploredIds || []).map((id) => simulation.explore.options.find((option) => option.id === id)).filter(Boolean)
  const reasons = selectedReasons(state)
  const response = selectedResponse(state, simulation)
  const intentions = selectedIntentions(state, simulation)
  const consequence = simulation.respond.consequences?.[state.decisionId] || simulation.respond.consequences?.custom
  const adaptation = consequence?.adaptations.find((option) => option.id === state.adaptationId)
  const decision = simulation.decide.options.find((option) => option.id === state.decisionId)
  const decisionLabel = decision?.title || state.customDecision?.trim() || 'a direction outside the authored options'
  const responseLabel = state.responseId === 'custom'
    ? 'responded in your own words'
    : response?.title
      ? `chose to ${lowerFirst(response.title)}`
      : 'responded to the stakeholder challenge'
  const signalLabels = explored.map((option) => option.label || option.title)
  const evidence = [
    `You explored ${explored.length} of ${simulation.explore.options.length} available signals${signalLabels.length ? `: ${joinNaturally(signalLabels)}` : ''}.`,
    `You chose “${decisionLabel}”${reasons.length ? ` and identified ${joinNaturally(reasons)} as important to the decision` : ''}.`,
    `When the trade-off was challenged, you ${responseLabel}.`,
  ]

  if (intentions.length) {
    evidence.push(`You described your intention as ${joinNaturally(intentions.map((intention) => lowerFirst(intention.label)))}.`)
  }

  if (state.consequenceRevealed && consequence?.resultSummary) {
    evidence.push(`The next result was mixed: ${consequence.resultSummary}.`)
  }

  if (state.adaptationId === 'custom' && state.customAdaptation?.trim()) {
    evidence.push('You created your own next move after the result changed.')
  } else if (adaptation?.reflectionPhrase) {
    evidence.push(`You adapted by ${adaptation.reflectionPhrase}.`)
  }

  const primaryIntention = intentions[0] ? intentionLanguage[intentions[0].id] : null
  const customAdaptationSuggestion = state.adaptationId === 'custom' && state.customAdaptation?.trim()
    ? 'You created a new next move after the result changed, which may mean you enjoy reframing a product decision as evidence develops rather than treating the first call as final.'
    : ''
  const suggestion = adaptation?.suggestion || customAdaptationSuggestion || decisionLanguage?.suggestion || primaryIntention?.suggestion || genericSuggestion(reasons, simulation)
  const distinctIntention = intentions.find((intention) => addsDistinctSignal(intention, suggestion))
  const distinctIntentionLanguage = distinctIntention ? intentionLanguage[distinctIntention.id] : null
  const decisionSuggestion = decisionLanguage?.suggestion && decisionLanguage.suggestion !== suggestion
    ? decisionLanguage.suggestion
    : ''
  const supportingSuggestion = decisionSuggestion || (distinctIntentionLanguage?.suggestion && distinctIntentionLanguage.suggestion !== suggestion
    ? distinctIntentionLanguage.suggestion
    : '')
  const customAdaptationTension = state.adaptationId === 'custom' && state.customAdaptation?.trim()
    ? 'Would adapting still feel comfortable if changing direction meant publicly revisiting a decision the team had already acted on?'
    : ''
  const tension = adaptation?.tension || customAdaptationTension || primaryIntention?.tension || decisionLanguage?.tension || 'You made one trade-off visible. How would it feel to keep owning that choice after new evidence and competing priorities appeared?'

  return {
    evidence,
    suggestion,
    supportingSuggestion,
    tension,
    uncertainty: transitionLanguage?.uncertainty || `This was one bounded moment from ${simulation.toRole || 'the role'}. It cannot represent the full range of teams, responsibilities, or working environments you might encounter.`,
    experiment: adaptation?.experiment || decisionLanguage?.experiment || transitionLanguage?.fallbackExperiment || 'Ask someone in the role to walk you through a recent difficult decision, including what remained uncertain and what happened next.',
    methodology: state.adaptationId
      ? 'Built from the signals you opened, the direction and reasons you selected, the intentions you explicitly identified, and how you adapted after the result. Your private written response and adaptation were not semantically analyzed or scored.'
      : intentions.length
        ? 'Built from the signals you opened, the direction and reasons you selected, and the intentions you explicitly identified. Your private written response was not semantically analyzed or scored.'
        : 'Built from the signals you opened, the direction and reasons you selected, and the authored response you chose. Your private written response was not semantically analyzed or scored.',
  }
}
