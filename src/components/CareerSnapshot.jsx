import React from 'react'
import { formatSnapshotDate } from '../utils/careerSnapshot'

function SnapshotList({ items = [], emptyCopy = 'Nothing specific stood out yet.' }) {
  if (!items.length) return <p className="mt-3 text-sm italic text-muted">{emptyCopy}</p>
  return <ul className="mt-3 min-w-0 space-y-2 break-words pl-5 text-[15px] leading-7 text-muted marker:text-accent/55">{items.map((item) => <li key={item}>{item}</li>)}</ul>
}

export default function CareerSnapshot({ snapshot, compact = false }) {
  return (
    <article className={`min-w-0 max-w-full overflow-hidden rounded-[1.75rem] border border-line bg-white/80 shadow-card ${compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8 lg:p-10'}`}>
      <div className="flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.17em] text-accent">Your Career Snapshot</p>
          <h2 className="mt-3 font-display text-3xl tracking-[-0.035em] text-ink">{snapshot.toRole}</h2>
          <p className="mt-2 text-sm text-muted">{snapshot.fromRole} → {snapshot.toRole}</p>
        </div>
        <div className="text-xs leading-5 text-muted sm:text-right">
          <p>First explored {formatSnapshotDate(snapshot.firstExploredAt || snapshot.completedAt)}</p>
          <p>Last explored {formatSnapshotDate(snapshot.lastExploredAt || snapshot.completedAt)}</p>
        </div>
      </div>

      <div className={`mt-6 grid min-w-0 gap-6 [&>section]:min-w-0 ${compact ? '' : 'md:grid-cols-2'}`}>
        {snapshot.experiencesTried?.length > 0 && (
          <section className={compact ? '' : 'md:col-span-2'}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Experiences tried</h3>
            <SnapshotList items={snapshot.experiencesTried} />
          </section>
        )}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">How this future feels now</h3>
          <p className="mt-3 font-display text-xl leading-8 text-ink">{snapshot.outcomeLabel}</p>
        </section>
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">What I want to explore next</h3>
          <p className="mt-3 text-[15px] leading-7 text-muted">{snapshot.nextExperiment}</p>
        </section>
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">What keeps pulling me in</h3>
          <SnapshotList items={snapshot.energizingSelections} />
        </section>
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">What keeps giving me pause</h3>
          <SnapshotList items={snapshot.uncomfortableSelections} />
        </section>
        {snapshot.questionsStillToInvestigate?.length > 0 && (
          <section className={compact ? '' : 'md:col-span-2'}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Questions I&apos;d still want answered</h3>
            <SnapshotList items={snapshot.questionsStillToInvestigate} />
          </section>
        )}
      </div>
    </article>
  )
}
