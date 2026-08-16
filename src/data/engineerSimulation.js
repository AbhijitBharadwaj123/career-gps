const baseRoute = '/simulate/engineer-to-pm'

export const engineerToPmSimulation = {
  id: 'engineer-to-pm',
  transitionId: 'engineer-to-pm',
  scenarioId: 'ai-support',
  experienceLabel: 'AI support assistant',
  person: 'Arjun',
  fromRole: 'Software Engineer',
  toRole: 'Product Manager',
  transitionLabel: 'Software Engineer → Product Manager',
  routes: {
    context: baseRoute,
    explore: `${baseRoute}/explore`,
    decide: `${baseRoute}/decide`,
    respond: `${baseRoute}/respond`,
    reflect: `${baseRoute}/reflect`,
    futureFeeling: `${baseRoute}/future-feeling`,
    outcomes: `${baseRoute}/outcome`,
    nextExperiment: `${baseRoute}/next-experiment`,
  },
  entry: {
    eyebrow: 'Your first moment as the PM',
    heading: "You're the PM for an AI support assistant.",
    introduction: 'Step into a real moment from the role and notice how it feels to own the product decision rather than the implementation.',
    scenario: [
      'Your team is preparing to launch an AI-powered order-support assistant.',
      'Early users love how quickly it answers questions, but 12% of responses are confidently wrong.',
      'Engineering has three possible ways to reduce the problem, but each affects quality, cost, latency, or launch timing differently.',
      'Customer Support is worried about harmful answers reaching customers.',
      'The VP wants the product launched in three weeks.',
    ],
    reassurance: [
      "You don't need to know the right answer.",
      'Just explore the situation the way you naturally would.',
    ],
  },
  explore: {
    heading: 'What do you want to understand first?',
    supportingCopy: 'There are several ways to look at the problem. Start wherever your curiosity takes you.',
    options: [
      {
        id: 'customer-impact',
        label: 'Customer impact',
        title: 'See what the assistant is getting wrong',
        decisionSummary: 'The 12% error rate includes a small but consequential set of high-severity customer failures.',
        reflectionPhrase: 'which failures mattered to customers, not just the overall error rate',
        reflectionSummary: 'You looked at which failures mattered to customers, not just the overall error rate.',
        evidence: {
          summary: "The 12% error rate isn't evenly distributed.",
          bullets: [
            '6% of all responses contain minor factual mistakes that customers can usually recover from.',
            '4% give incorrect order-status or return-policy information.',
            '2% could create serious customer problems, such as telling someone a refund was approved when it was not.',
            'The highest-severity errors happen much less often, but they generate significantly more Support escalation.',
          ],
        },
      },
      {
        id: 'usage-patterns',
        label: 'Usage patterns',
        title: 'See how customers are using it',
        decisionSummary: 'Customers increasingly use the assistant for consequential support issues, while correct answers resolve them substantially faster.',
        reflectionPhrase: 'how customers were already relying on the assistant',
        reflectionSummary: 'You looked at how customers were already relying on the assistant and where it was creating value.',
        evidence: {
          summary: 'Customers are already relying on the assistant for more than simple FAQs.',
          bullets: [
            '61% of conversations involve order status, returns, refunds, or delivery problems.',
            'Users often ask follow-up questions rather than leaving after the first response.',
            'Customers who receive a correct answer resolve their issue substantially faster than through the existing support flow.',
            'Usage has increased every week during the pilot.',
          ],
        },
      },
      {
        id: 'engineering-options',
        label: 'Engineering',
        title: 'Understand the technical options',
        decisionSummary: 'Engineering can improve average quality, constrain high-risk answers, or add human review, with different effects on risk, latency, cost, and capacity.',
        reflectionPhrase: 'how the system could be changed',
        reflectionSummary: 'You spent time understanding how the system could be changed before making your call.',
        evidence: {
          summary: 'Engineering proposes three approaches, each with a different product trade-off.',
          sections: [
            {
              title: 'Improve retrieval quality',
              bullets: ['Overall wrong-answer rate could fall from 12% to roughly 7%.', 'Relatively little additional latency.', 'Requires most of the remaining pre-launch engineering capacity.', 'Highest-severity mistakes may still occur.'],
            },
            {
              title: 'Add stronger guardrails',
              bullets: ['Blocks many high-risk answer types.', 'Users will sometimes receive “I can’t answer that” instead.', 'Reduces severe errors more than overall errors.', 'Adds some latency and conversational friction.'],
            },
            {
              title: 'Human review for high-risk cases',
              bullets: ['Substantially reduces severe customer-impact errors.', 'Adds 20–60 seconds to certain conversations.', 'Increases operating cost.', 'Requires Support staffing changes before launch.'],
            },
          ],
        },
      },
      {
        id: 'launch-pressure',
        label: 'Launch pressure',
        title: 'Understand what the business is optimizing for',
        decisionSummary: 'The announced launch offers potential support savings, while a delay has planning costs and the company has no defined acceptable error threshold.',
        reflectionPhrase: 'the business constraints alongside the technical problem',
        reflectionSummary: 'You chose to understand the business constraints alongside the technical problem.',
        evidence: {
          summary: 'The VP sees the assistant as a major launch commitment.',
          bullets: [
            'Marketing has already announced the upcoming AI support experience.',
            'Delaying the full launch by one month would create reputational and planning costs, but no contractual penalties.',
            'Support currently spends significant time answering repetitive order questions.',
            'Finance expects meaningful support-cost savings if the assistant handles enough conversations successfully.',
            'The company has not defined an explicit acceptable error threshold for launch.',
          ],
        },
      },
    ],
    customQuestion: {
      heading: 'What else would you want to investigate?',
      supportingCopy: "Add a question you'd want answered in the real world. We'll save it only in your Career Snapshot on this device. It won't be used to score you or sent to Career GPS unless you choose to include it in feedback.",
      placeholder: 'What else would you want to know?',
      savedLabel: "You'd also want to investigate",
      submitLabel: 'Add question',
    },
    continueLabel: 'I have enough to make a call',
  },
  decide: {
    eyebrow: 'Decide',
    heading: 'The team needs a launch direction.',
    supportingCopy: "You can't eliminate every risk before launch. What do you want the team to optimize for?",
    evidenceHeading: "What you've looked at",
    options: [
      { id: 'retrieval', title: 'Improve retrieval before launch', description: 'Use most of the remaining engineering capacity to reduce the overall wrong-answer rate before shipping.', tradeOff: 'Better average answer quality, but some high-severity failures may remain.' },
      { id: 'guardrails', title: 'Guard high-risk conversations', description: 'Use stronger guardrails so the assistant refuses or redirects conversations where a wrong answer could cause serious customer harm.', tradeOff: 'Fewer severe mistakes, but a less seamless customer experience.' },
      { id: 'human-review', title: 'Add human review for high-risk cases', description: 'Launch on schedule, but route sensitive conversations to a human before the assistant gives a final answer.', tradeOff: 'Lower customer risk, with higher cost and slower responses.' },
      { id: 'staged-launch', title: 'Narrow the launch', description: 'Launch the assistant only for lower-risk order questions while continuing to improve higher-risk workflows.', tradeOff: 'Less launch impact initially, but more control over where mistakes can occur.' },
    ],
    customLabel: "I'd take a different approach",
    customPrompt: 'What would you ask the team to do?',
    customPlaceholder: 'Write a short direction in your own words.',
    reasonHeading: 'What matters most in your decision?',
    reasons: ['Customer harm', 'Overall answer quality', 'Launch timing', 'Customer experience', 'Operating cost', 'Reversibility', 'Learning quickly', 'Engineering capacity', 'Something else'],
    customReasonPlaceholder: 'What else matters here?',
    cta: 'Make the call',
  },
  respond: {
    heading: 'Your direction meets the team.',
    supportingCopy: 'Engineering can execute several approaches. The team needs you to define what the product should optimize for.',
    prompt: 'How would you respond?',
    customLabel: 'Respond in your own words',
    customPlaceholder: 'What would you say?',
    cta: 'See what you noticed',
    branches: {
      retrieval: {
        stakeholder: 'Priya — Engineering Lead',
        message: ['We can focus the team on retrieval and probably get the overall error rate down meaningfully.', "But I can't promise that the rare, high-impact errors disappear.", 'What level of customer risk are you actually comfortable accepting at launch?'],
        responses: [
          { id: 'define-boundary', title: 'Define a product boundary', description: "Let's optimize retrieval, but block the few workflows where a wrong answer could create serious customer harm.", reflectionPrompt: 'When another leader challenged the trade-off, you chose to define a clearer product boundary. How did that feel?' },
          { id: 'accept-risk', title: 'Accept measured risk', description: "If we materially improve overall accuracy, I'm comfortable launching while we closely monitor the remaining high-risk cases.", reflectionPrompt: 'When another leader challenged the trade-off, you chose to keep the direction and explain the risk you were willing to accept. How did that feel?' },
          { id: 'revisit-strategy', title: 'Revisit the strategy', description: "If retrieval doesn't sufficiently address the high-impact failures, I want to reconsider whether this should be our primary launch investment.", reflectionPrompt: 'When the trade-off was challenged, you chose to reopen the decision rather than defend it immediately. How did that feel?' },
        ],
      },
      guardrails: {
        stakeholder: 'Marcus — VP, Growth',
        message: ["If the assistant keeps refusing questions, we're going to launch something that feels less intelligent than what customers saw in the pilot.", 'Are we protecting customers, or are we taking too much value out of the product?'],
        responses: [
          { id: 'protect-boundary', title: 'Protect the boundary', description: 'For high-risk cases, reliability matters more than appearing intelligent. We can expand what it handles as confidence improves.', reflectionPrompt: 'When another leader challenged the trade-off, you chose to keep the boundary and explain why. How did that feel?' },
          { id: 'tune-scope', title: 'Tune the scope', description: "Let's guard only the highest-severity cases and preserve the full experience elsewhere.", reflectionPrompt: 'When competing risks surfaced, you looked for a narrower product boundary rather than solving every problem at once. How did that feel?' },
          { id: 'reconsider', title: 'Reconsider', description: 'If guardrails materially damage the experience, I want to compare that cost with a staged launch instead.', reflectionPrompt: 'When the trade-off was challenged, you chose to reopen the decision rather than defend it immediately. How did that feel?' },
        ],
      },
      'human-review': {
        stakeholder: 'Lena — Head of Support',
        message: ['I can support human review, but this changes the economics. If adoption grows the way Product expects, my team could become the bottleneck.', 'Is that an acceptable launch model, or are we just moving the problem from AI quality to Support capacity?'],
        responses: [
          { id: 'accept-temporarily', title: 'Accept it temporarily', description: "For launch, reducing severe customer mistakes is worth the temporary operating cost. We'll measure how often review is actually triggered.", reflectionPrompt: 'When another leader challenged the trade-off, you chose to keep the direction and explain why the temporary cost was acceptable. How did that feel?' },
          { id: 'narrow-review', title: 'Narrow human review', description: "Let's reserve human review only for the highest-risk workflows so Support doesn't become the default fallback.", reflectionPrompt: 'When competing risks surfaced, you looked for a narrower product boundary rather than solving every problem at once. How did that feel?' },
          { id: 'reconsider-scope', title: 'Reconsider launch scope', description: "If human review makes the model unsustainable, I'd rather narrow what the assistant handles initially.", reflectionPrompt: 'When the trade-off was challenged, you chose to reopen the launch scope. How did that feel?' },
        ],
      },
      'staged-launch': {
        stakeholder: 'Daniel — VP, Product',
        message: ['We promised an AI support launch, not an FAQ bot.', 'If we narrow the scope this much, are we learning responsibly—or avoiding the harder product decision?'],
        responses: [
          { id: 'defend-staged', title: 'Defend the staged approach', description: "We're launching where the product already creates reliable value and using real behavior to earn our way into higher-risk workflows.", reflectionPrompt: 'When another leader challenged the trade-off, you chose to keep the direction and explain why. How did that feel?' },
          { id: 'broaden-slightly', title: 'Broaden slightly', description: "Let's expand the launch enough to test meaningful customer value, but keep the highest-risk workflows out for now.", reflectionPrompt: 'When competing risks surfaced, you looked for a broader but still bounded launch. How did that feel?' },
          { id: 'reopen-decision', title: 'Reopen the decision', description: "That's fair. I want to define what minimum customer value makes a staged launch worthwhile before we lock the scope.", reflectionPrompt: 'When the trade-off was challenged, you chose to reopen the decision rather than defend it immediately. How did that feel?' },
        ],
      },
      custom: {
        stakeholder: 'Priya — Engineering Lead',
        message: ["Engineering can build toward that. What I need from Product is the trade-off we're optimizing for.", "If we can't maximize quality, speed, cost, and launch timing at the same time, which one are you most willing to give up?"],
        responses: [
          { id: 'launch-speed', title: 'Launch speed', reflectionPrompt: 'When the trade-off became explicit, you chose launch speed as the constraint you were most willing to give up. How did that feel?' },
          { id: 'operating-cost', title: 'Operating cost', reflectionPrompt: 'When the trade-off became explicit, you chose operating cost as the constraint you were most willing to give up. How did that feel?' },
          { id: 'smoothness', title: 'Conversational smoothness', reflectionPrompt: 'When the trade-off became explicit, you chose conversational smoothness as the constraint you were most willing to give up. How did that feel?' },
          { id: 'coverage', title: 'Overall coverage', reflectionPrompt: 'When the trade-off became explicit, you chose overall coverage as the constraint you were most willing to give up. How did that feel?' },
          { id: 'uncertainty', title: 'Some remaining uncertainty', reflectionPrompt: 'When the trade-off became explicit, you chose to accept some remaining uncertainty. How did that feel?' },
        ],
      },
    },
  },
  reflect: {
    heading: 'What did you notice about the work?',
    supportingCopy: "There wasn't a right path through that situation. The useful part is noticing what the experience asked of you.",
    roleObservations: [
      'Engineering could build several technically reasonable solutions. The product decision was choosing which trade-off mattered most.',
      'You had to define an acceptable product boundary without being able to eliminate every uncertainty.',
    ],
    feelingHeading: 'How did that experience feel?',
    energizing: {
      heading: 'What felt energizing?',
      options: ['Deciding which customer problem mattered most', 'Connecting technical options to customer impact', 'Making the product trade-off', 'Working through ambiguity', 'Defining what “good enough” means', 'Responding to stakeholder pushback', 'None of these', 'Something else'],
      placeholder: 'What else felt energizing?',
    },
    uncomfortable: {
      heading: 'What felt unfamiliar or uncomfortable?',
      options: ['Not solving the technical problem myself', 'Choosing between technically valid options', 'Accepting that some problems would remain', 'Owning the decision while Engineering owned implementation', 'Explaining a trade-off to other leaders', 'Defining an acceptable level of risk', 'Nothing in particular', 'Something else'],
      placeholder: 'What else felt unfamiliar?',
    },
    cta: 'Continue to your reflection',
  },
  futureFeeling: {
    heading: 'How did that future feel?',
    supportingCopy: "You don't have to decide whether you'd be a great PM. Just decide whether you'd like to experience more of this kind of work.",
    choices: [
      { id: 'explore-more', title: 'I want to explore more', description: 'There was enough here that I want another look at Product Management.' },
      { id: 'unsure', title: "I'm not sure yet", description: 'Some parts interested me, but I need another experience before deciding.' },
      { id: 'not-for-me', title: "This doesn't feel like me", description: "Something about this kind of work didn't resonate with me." },
    ],
    cta: 'See my next step',
  },
  nextExperiment: {
    'explore-more': {
      heading: 'What part of Product Management do you want to try next?',
      supportingCopy: "You've found enough that you want another look. Try a part of Product Management that moves further beyond implementation.",
      choices: [
        { title: 'Build, buy, or partner?', description: 'Experience deciding where the company should invest — even when your team could technically build it.', available: true, simulationId: 'engineer-to-pm-build-buy-partner', cta: 'Try this scenario' },
        { title: 'When growth gets expensive', description: "Experience making product decisions when adoption is growing but the economics aren't working.", available: true, simulationId: 'engineer-to-pm-growth-economics', cta: 'Try this scenario' },
      ],
      decideLaterDescription: "Save what you've learned and return whenever you're curious again.",
    },
    unsure: {
      heading: 'What would help you learn more?',
      supportingCopy: "If you're unsure about the transition, try the parts that change most when you stop owning implementation directly.",
      choices: [
        { title: 'Engineering owns the how', description: "Experience being accountable for the outcome when you wouldn't personally choose the team's implementation.", available: true, simulationId: 'engineer-to-pm-engineering-owns-how', cta: 'Try this scenario' },
        { title: 'The launch is technically ready', description: "Experience a week where the most important PM problems aren't engineering problems.", available: true, simulationId: 'engineer-to-pm-launch-technically-ready', cta: 'Try this scenario' },
      ],
      decideLaterDescription: "Save what you've learned and return when you're ready.",
    },
    'not-for-me': {
      heading: 'What would you want more of instead?',
      choices: ['More hands-on building', 'More technical depth', 'Clearer implementation ownership', 'Less stakeholder negotiation', 'Less ambiguity', 'More time solving one problem deeply', "I'm not sure yet"],
      summary: "Career GPS will eventually help you explore futures that keep more of what you want and less of what didn't resonate here.",
    },
    decideLater: "I'll decide later.",
  },
  outcomes: {
    'explore-more': {
      heading: 'Keep exploring Product Management',
      supportingCopy: "One simulation shouldn't decide a career. You now have a clearer idea of what you want to test next.",
      shareText: 'I tried a Software Engineer → Product Manager career simulation and found enough in the work that I want to explore Product Management further.',
    },
    unsure: {
      heading: "That's useful too.",
      supportingCopy: "You don't need to turn curiosity into commitment yet. Another experience can help you notice more.",
      shareText: 'I tried a Software Engineer → Product Manager career simulation. Some parts clicked, and some made me want another look before deciding.',
    },
    'not-for-me': {
      heading: 'A “no” is useful too.',
      supportingCopy: 'You learned something before spending months pursuing the transition.',
      shareText: 'I tried a Software Engineer → Product Manager career simulation and learned something useful before making the transition.',
    },
  },
}
