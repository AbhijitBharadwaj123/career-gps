import React from 'react'
import WaitlistForm from './WaitlistForm'

export default function OwnTransitionCard() {
  return (
    <aside className="mt-8 rounded-[1.75rem] border border-dashed border-line bg-[#F1F3EE]/80 p-6 sm:p-8 lg:p-10">
      <div className="max-w-2xl">
        <div className="flex flex-wrap items-center gap-3"><p className="text-xl font-semibold tracking-[-0.025em] text-ink sm:text-2xl">Explore your own transition</p><span className="rounded-full bg-sage px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-accent">Coming soon</span></div>
        <p className="mt-3 text-[15px] leading-7 text-muted sm:text-base">
          Your experience helps Career GPS personalize what you explore next.
        </p>
        <p className="mt-5 text-sm font-medium text-accent">
          Your past helps personalize the journey. It doesn&apos;t determine your future.
        </p>
      </div>
      <WaitlistForm />
    </aside>
  )
}
