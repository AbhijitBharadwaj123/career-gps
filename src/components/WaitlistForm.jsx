import React, { useState } from 'react'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const submitWaitlist = async (event) => {
    event.preventDefault()
    setMessage('')

    if (import.meta.env.DEV) {
      setStatus('error')
      setMessage('Waitlist signup is available in the deployed Netlify version. Your email remains here for now.')
      return
    }

    setStatus('submitting')
    try {
      const body = new URLSearchParams({
        'form-name': 'career-gps-waitlist',
        email,
        timestamp: new Date().toISOString(),
        source: 'custom-transition',
      })
      const response = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
      if (!response.ok) throw new Error('Submission failed')
      setStatus('success')
    } catch {
      setStatus('error')
      setMessage("We couldn't add you just now. Please try again.")
    }
  }

  if (status === 'success') return <div className="mt-7 rounded-2xl border border-accent/15 bg-white/60 p-5"><p className="font-semibold text-ink">You&apos;re on the list.</p><p className="mt-2 text-sm text-muted">We&apos;ll let you know when custom transitions are ready.</p></div>

  return (
    <form name="career-gps-waitlist" data-netlify="true" onSubmit={submitWaitlist} className="mt-7 border-t border-line pt-6">
      <input type="hidden" name="form-name" value="career-gps-waitlist" />
      <input type="hidden" name="source" value="custom-transition" />
      <p className="text-sm font-semibold text-ink">Want to know when custom transitions are ready?</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="custom-transition-email" className="sr-only">Email address</label>
        <input id="custom-transition-email" required type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="min-h-11 min-w-0 flex-1 rounded-full border border-line bg-white/80 px-5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" />
        <button type="submit" disabled={status === 'submitting'} className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-50">Keep me informed</button>
      </div>
      {message && <p className="mt-3 text-sm leading-6 text-muted" role="alert">{message}</p>}
    </form>
  )
}
