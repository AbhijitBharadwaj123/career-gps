import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Brand from '../components/Brand'
import CareerSnapshot from '../components/CareerSnapshot'
import ConfirmationDialog from '../components/ConfirmationDialog'
import { useSimulationState } from '../state/SimulationState'
import { createSnapshotEmailHref } from '../utils/careerSnapshot'

export default function CareerSnapshotPage() {
  const { snapshotId } = useParams()
  const navigate = useNavigate()
  const { savedFutures, removeSnapshot } = useSimulationState()
  const [removeOpen, setRemoveOpen] = useState(false)
  const snapshot = savedFutures.find((item) => item.id === snapshotId)
  const publicUrl = new URL(`/simulate/${snapshot?.transitionId || 'ba-to-pm'}`, window.location.origin).href

  return (
    <div className="min-h-screen bg-canvas px-6 text-ink sm:px-8">
      <header className="mx-auto flex max-w-5xl items-center justify-between py-6"><Brand /><Link to="/my-futures" className="text-sm font-semibold text-muted hover:text-accent">Back to My Futures</Link></header>
      <main className="mx-auto max-w-4xl pb-20 pt-12">
        {snapshot ? <><CareerSnapshot snapshot={snapshot} /><div className="mt-6 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between"><a href={createSnapshotEmailHref(snapshot, publicUrl)} className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink hover:border-accent/35">Email a copy to myself</a><button type="button" onClick={() => setRemoveOpen(true)} className="min-h-11 px-3 text-sm font-semibold text-[#7A3F38] hover:underline">Remove this exploration</button></div></> : (
          <div className="rounded-[1.75rem] border border-line bg-white/75 p-8 text-center"><h1 className="font-display text-4xl">This Career Snapshot isn&apos;t saved on this device.</h1><Link to="/my-futures" className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Go to My Futures</Link></div>
        )}
      </main>
      <ConfirmationDialog
        open={removeOpen}
        title="Remove this Career Snapshot?"
        description="This will remove the saved exploration from this device."
        confirmLabel="Remove"
        cancelLabel="Keep it"
        onConfirm={() => {
          removeSnapshot(snapshotId)
          setRemoveOpen(false)
          navigate('/my-futures')
        }}
        onCancel={() => setRemoveOpen(false)}
        destructive
      />
    </div>
  )
}
