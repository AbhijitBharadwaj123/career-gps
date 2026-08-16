import React, { useState } from 'react'

const initialForm = {
  helped: '',
  useful: '',
  improve: '',
  nextTransition: '',
  email: '',
}

export default function FeedbackModal({ open, onClose, outcomeId, transitionId = 'ba-to-pm', scenarioId = '' }) {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  if (!open) return null

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submitFeedback = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (import.meta.env.DEV) {
      setStatus('error')
      setErrorMessage('Feedback submission is available in the deployed Netlify version. Your entries remain here so you can submit them after deployment.')
      return
    }

    setStatus('submitting')
    try {
      const body = new URLSearchParams({
        'form-name': 'career-gps-feedback',
        transitionId,
        scenarioId,
        finalOutcome: outcomeId,
        timestamp: new Date().toISOString(),
        ...form,
      })
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      if (!response.ok) throw new Error('Submission failed')
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage("We couldn't send your feedback just now. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/35 p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="my-4 max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-line bg-canvas p-6 shadow-lift sm:p-8" role="dialog" aria-modal="true" aria-labelledby="feedback-heading">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Career GPS team</p>
            <h2 id="feedback-heading" className="mt-2 font-display text-3xl tracking-[-0.035em] text-ink">Give feedback on Career GPS</h2>
            <p className="mt-3 text-sm leading-6 text-muted">Tell us what helped, what felt confusing, or what you&apos;d like to explore next.</p>
          </div>
          <button type="button" autoFocus onClick={onClose} className="rounded-full border border-line px-3 py-1.5 text-sm text-muted hover:text-ink">Close</button>
        </div>

        {status === 'success' ? (
          <div className="mt-8 rounded-2xl border border-accent/15 bg-sage/55 p-6">
            <h3 className="font-display text-3xl text-ink">Thank you.</h3>
            <p className="mt-3 leading-7 text-muted">Your feedback will help shape what Career GPS explores next.</p>
          </div>
        ) : (
          <form name="career-gps-feedback" data-netlify="true" onSubmit={submitFeedback} className="mt-7 space-y-6">
            <input type="hidden" name="form-name" value="career-gps-feedback" />
            <input type="hidden" name="transitionId" value={transitionId} />
            <input type="hidden" name="scenarioId" value={scenarioId} />
            <input type="hidden" name="finalOutcome" value={outcomeId} />

            <fieldset>
              <legend className="text-sm font-semibold text-ink">Did this simulation help you understand Product Management differently?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Yes', 'Somewhat', 'Not really'].map((option) => <label key={option} className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${form.helped === option ? 'border-accent/35 bg-sage text-accent' : 'border-line bg-white/75 text-muted'}`}><input required type="radio" name="helped" value={option} checked={form.helped === option} onChange={() => updateField('helped', option)} className="sr-only" />{option}</label>)}
              </div>
            </fieldset>

            <label className="block text-sm font-semibold text-ink">What was most useful or surprising?<textarea name="useful" value={form.useful} onChange={(event) => updateField('useful', event.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-line bg-white/80 p-4 text-sm font-normal leading-6 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" /></label>
            <label className="block text-sm font-semibold text-ink">What would you change or improve?<textarea name="improve" value={form.improve} onChange={(event) => updateField('improve', event.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-line bg-white/80 p-4 text-sm font-normal leading-6 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" /></label>
            <label className="block text-sm font-semibold text-ink">What career transition would you like to simulate next?<span className="ml-2 text-xs font-normal text-muted">Optional</span><input name="nextTransition" value={form.nextTransition} onChange={(event) => updateField('nextTransition', event.target.value)} className="mt-2 min-h-11 w-full rounded-full border border-line bg-white/80 px-5 text-sm font-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" /></label>
            <label className="block text-sm font-semibold text-ink">Can we contact you about your feedback?<span className="ml-2 text-xs font-normal text-muted">Optional</span><input type="email" name="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="Email address" className="mt-2 min-h-11 w-full rounded-full border border-line bg-white/80 px-5 text-sm font-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" /></label>

            <button type="submit" disabled={status === 'submitting'} className="min-h-12 rounded-full bg-ink px-6 text-sm font-semibold text-white shadow-card hover:bg-accent-dark disabled:opacity-50">{status === 'submitting' ? 'Submitting…' : 'Submit feedback'}</button>
            {errorMessage && <p className="text-sm leading-6 text-muted" role="alert">{errorMessage}</p>}
          </form>
        )}
      </section>
    </div>
  )
}
