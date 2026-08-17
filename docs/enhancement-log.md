# Try the Work — Enhancement Log

This is the running product record for meaningful Try the Work enhancements. It captures what changed, why the change was made, and the intended user and product impact. New entries are added at the top.

## 2026-08-17 — Consequence and adaptation

| | Details |
| --- | --- |
| **Enhancement** | Added decision-specific consequences and adaptation choices to both Business Analyst → Product Manager and Software Engineer → Product Manager primary simulations. Users now see what happened after their decision, then choose whether to persist, narrow the move, change direction, establish a boundary, or describe their own adaptation by text or voice. |
| **Reason** | The original experience ended after the user made and defended a decision. Product work also requires living with imperfect results, interpreting new evidence, and deciding what to do next. Without that loop, the simulation felt closer to a situational interview question than an experience of the work. |
| **User impact** | Users experience a fuller PM responsibility loop: investigate → decide → influence → observe consequences → adapt. Mixed outcomes reinforce that there is no single correct answer and let users notice how recovery and continued ownership feel. |
| **Product impact** | Makes the simulation more differentiated from career assessments and interview-preparation tools. It provides stronger behavioral evidence for the reflection while preserving the non-judgmental product philosophy. |
| **Scope** | All authored primary decisions and custom-decision paths in both transitions. Custom adaptations remain private and are not semantically analyzed or scored. Follow-up scenarios were not changed. |
| **Validation** | Production build passed. Both transitions were tested through consequence, adaptation, and reflection on desktop and mobile. No runtime warnings or horizontal mobile overflow were found. |

## 2026-08-17 — Evidence-backed interpretation

| | Details |
| --- | --- |
| **Enhancement** | Added a transparent, rules-based reflection to both Business Analyst → Product Manager and Software Engineer → Product Manager. Users identify up to two intentions behind their stakeholder response, and the reflection connects the signals explored, decision, reasons, response, and intentions to a possible work preference, tension, uncertainty, and real-world experiment. |
| **Reason** | The previous reflection relied heavily on users interpreting the experience themselves. Feedback indicated the product needed to return more specific value without becoming a score, assessment, or opaque AI judgment. |
| **User impact** | Users receive a more concrete explanation of what their choices may suggest and what remains unknown. The language stays provisional and encourages further exploration instead of declaring career fit. |
| **Product impact** | Demonstrates personalized value using inspectable product logic. It creates a credible foundation for future AI enhancement while keeping V0 reliable, private, and easy to explain. |
| **Scope** | Both primary transitions, the on-screen reflection, saved Career Snapshot, and snapshot email export. Private free-form writing is not semantically analyzed or scored. |
| **Validation** | Production build passed. Both transitions and custom-response privacy behavior were tested end to end on desktop and mobile. |

## 2026-08-16 — Voice input for open-ended thinking

| | Details |
| --- | --- |
| **Enhancement** | Added reusable browser-based voice input to open-ended simulation responses and investigation questions, followed by a smaller microphone control and clearer discovery messaging. Transcripts remain editable so users can correct recognition errors before continuing. |
| **Reason** | Product decisions are often easier to explain aloud than compose in a text box. Voice makes the reflective parts of the experience feel more conversational while preserving typing as a reliable fallback. |
| **User impact** | Users can speak naturally, edit the transcript, or continue typing. Unsupported browsers and microphone errors degrade gracefully without blocking the simulation. |
| **Product impact** | Adds a lightweight multimodal interaction without requiring authentication, server storage, or an AI service. It tests whether voice makes career exploration feel more immediate and human. |
| **Scope** | Open-ended stakeholder responses and “What else would you want to investigate?” prompts across the simulation experience. |
| **Validation** | Voice availability, editable transcripts, error fallbacks, and production builds were verified before merge. |

## 2026-08-16 — Renamed Career GPS to Try the Work

| | Details |
| --- | --- |
| **Enhancement** | Renamed the public product from Career GPS to Try the Work and updated interface copy, scenario language, saved-state language, Career Snapshot copy, and social preview assets to match. |
| **Reason** | “Try the Work” expresses the core value more directly: experience the work itself before committing to a career path. It feels experiential and avoids sounding like navigation, assessment, or career advice software. |
| **User impact** | The product promise is easier to understand immediately and remains consistent throughout the full journey. |
| **Product impact** | Creates a clearer, more ownable positioning for demos, outreach, and future transition experiences. |
| **Scope** | Product-facing naming, supporting copy, saved states, snapshot language, and share metadata. Existing routes and user progress behavior were preserved. |
| **Validation** | The renamed experience was reviewed across the landing page, both transition flows, saved snapshots, and social sharing output. |

## 2026-08-15 — Public launch and sharing readiness

| | Details |
| --- | --- |
| **Enhancement** | Prepared V0 for Netlify deployment with client-side routing support, production metadata, social sharing imagery, a quiet public footer, creator contact links, privacy-minded feedback and waitlist forms, and final responsive QA. |
| **Reason** | The prototype needed to work as a credible public product—not only in a local demo—and give interested users a clear way to share it or contact the creator. |
| **User impact** | Users can open deep links, navigate on mobile, share a meaningful preview, provide feedback, and contact the creator without encountering broken routes or incomplete public-site details. |
| **Product impact** | Turned the prototype into a shareable V0 suitable for external feedback, interviews, and founder conversations. |
| **Scope** | Netlify configuration, public metadata, footer/contact treatment, LinkedIn and email links, social preview, and production QA. No authentication, database, or server API was introduced. |
| **Validation** | Production build and route refresh behavior were verified; public metadata and contact links were tested. |

## 2026-08-15 — Career continuity, Career Snapshot, and My Futures

| | Details |
| --- | --- |
| **Enhancement** | Added a post-simulation continuity loop: users record how the future felt, choose what to explore next, save a cumulative Career Snapshot, return through My Futures, and resume progress stored on their device. |
| **Reason** | One simulated moment should not decide a career. The product needed to help users accumulate evidence across experiences and return to an exploration without turning it into a dashboard or score. |
| **User impact** | Users leave with a durable record of what energized them, what created discomfort, what remains uncertain, and what they want to try next. Progress can be resumed without creating an account. |
| **Product impact** | Moves Try the Work from a one-off interactive scenario toward a repeatable career-exploration journey while preserving privacy and reversibility. |
| **Scope** | Future-feeling reflection, next-experiment selection, cumulative snapshots, email export, My Futures, local persistence, resume, and reset controls. |
| **Validation** | Completion, save, resume, reset, and cumulative snapshot paths were tested for both transitions. |

## 2026-08-15 — Follow-up scenarios shaped by user mindset

| | Details |
| --- | --- |
| **Enhancement** | Added eight follow-up PM scenarios across the two transitions. Users who want to explore more receive broader PM challenges; users who remain unsure receive scenarios that test the specific boundary of the career change. Follow-up branching was corrected to reflect the user’s stated mindset. |
| **Reason** | Different reactions require different next experiences. A curious user benefits from breadth, while an unsure user needs a sharper test of what feels unresolved. |
| **User impact** | The next scenario feels connected to what the user just learned instead of behaving like a generic content recommendation. |
| **Product impact** | Demonstrates a scalable simulation library and a simple personalization model based on explicit user intent rather than hidden scoring. |
| **Scope** | Four follow-up experiences for BA → PM and four for Engineer → PM, connected to “explore more” and “unsure” paths. |
| **Validation** | Branch destinations, route continuity, completion state, and cumulative snapshot behavior were tested for both transition families. |

## 2026-08-15 — Open-ended investigation and custom decision paths

| | Details |
| --- | --- |
| **Enhancement** | Added “What else would you want to investigate?”, custom decision directions, custom stakeholder responses, and open-ended reflection notes alongside the authored choices. |
| **Reason** | A simulation that permits only predefined answers can feel like a disguised assessment. Users needed room to express a different mental model or decision path without being marked wrong. |
| **User impact** | Users can follow their own curiosity and describe a decision the prototype did not anticipate. Their notes stay editable and local to their device. |
| **Product impact** | Reinforces the product philosophy that users are trying on work, not auditioning for it, while revealing where authored scenarios may need to expand. |
| **Scope** | Explore, Decide, Respond, and reflection surfaces in the primary simulations. No semantic analysis or scoring of private prose. |
| **Validation** | Custom paths, required-state handling, privacy language, local persistence, and mobile layouts were tested. |

## 2026-08-15 — Software Engineer → Product Manager simulation

| | Details |
| --- | --- |
| **Enhancement** | Built the second end-to-end transition around an AI support assistant with competing quality, safety, customer-experience, operating-cost, and launch considerations. The flow mirrors the reusable Explore → Decide → Respond → Reflect structure. |
| **Reason** | A second transition was necessary to prove the concept and architecture worked beyond Maya’s BA → PM story. It also needed to expose the distinctive shift from owning implementation to owning product outcomes and boundaries. |
| **User impact** | Engineers can experience translating technical options into customer and business trade-offs, then notice how it feels to leave implementation ownership with Engineering. |
| **Product impact** | Validated that the simulation framework supports different source-role mindsets while preserving a consistent product journey. |
| **Scope** | Complete Engineer → PM primary simulation, transition-specific evidence, decisions, stakeholder challenges, reflection language, and continuity paths. |
| **Validation** | The complete transition was tested independently and alongside BA → PM for route, state, and responsive consistency. |

## 2026-08-15 — Business Analyst → Product Manager simulation

| | Details |
| --- | --- |
| **Enhancement** | Expanded Maya’s checkout scenario from an entry screen into an end-to-end Explore → Decide → Respond → Reflect experience. Users investigate signals, prioritize one meaningful move, respond to stakeholder pushback, and reflect on how the work felt. |
| **Reason** | The landing page promise needed a real career moment that let users experience ambiguity, prioritization, and influence rather than read about them. |
| **User impact** | Business Analysts can step into a realistic PM decision with incomplete evidence and notice whether owning the trade-off feels engaging, uncomfortable, or both. |
| **Product impact** | Established the core simulation grammar and the non-evaluative tone used throughout Try the Work. |
| **Scope** | Maya’s checkout-conversion scenario, evidence exploration, decision and reasoning, stakeholder response, reflection, responsive design, and reusable simulation components. |
| **Validation** | The full path was tested on desktop and mobile, including route guards and custom-response behavior. |

## 2026-08-15 — Initial Career GPS landing-page prototype

| | Details |
| --- | --- |
| **Enhancement** | Created the first React, Vite, and Tailwind landing page with two transition cards: Business Analyst → Product Manager and Software Engineer → Product Manager. Added reusable components, data-driven transition configuration, responsive styling, and placeholder simulation routes. |
| **Reason** | The initial hypothesis needed a calm, consumer-oriented expression: experience a possible career before committing months or years to pursuing it. |
| **User impact** | Users could immediately understand the promise, see concrete transitions, and choose a future to explore without encountering assessment, HR, or scoring language. |
| **Product impact** | Established the product thesis, visual system, reusable front-end architecture, and the first testable entry point for the prototype. |
| **Scope** | Landing page, hero, transition cards, own-transition coming-soon state, React Router setup, responsive design, and simulation placeholders only. |
| **Validation** | Production build passed and the landing page was checked at desktop and mobile widths. |

## How to maintain this log

For each meaningful enhancement, add a new dated entry at the top with:

- **Enhancement:** the user-visible change.
- **Reason:** the feedback, problem, or hypothesis behind it.
- **User impact:** what becomes easier, clearer, or more valuable for users.
- **Product impact:** what the change helps Try the Work learn or demonstrate.
- **Scope:** what was and was not changed.
- **Validation:** how the change was verified.

Small copy corrections, dependency maintenance, and invisible refactors only need entries when they materially affect users or product decisions.
