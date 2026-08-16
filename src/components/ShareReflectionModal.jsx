import React, { useEffect, useState } from 'react'

export default function ShareReflectionModal({ open, onClose, defaultText, publicPath, nextExperiment }) {
  const [shareText, setShareText] = useState(defaultText)
  const [includeNextExperiment, setIncludeNextExperiment] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')

  useEffect(() => {
    if (open) {
      setShareText(defaultText)
      setIncludeNextExperiment(false)
      setCopyStatus('')
    }
  }, [defaultText, open])

  if (!open) return null

  const copyValue = async (value, status) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopyStatus(status)
    } catch {
      setCopyStatus('Copy unavailable in this browser')
    }
  }

  const publicUrl = new URL(publicPath, window.location.origin).href
  const nextExperimentSentence = `Next I want to explore: ${nextExperiment}.`
  const toggleNextExperiment = () => {
    setIncludeNextExperiment((current) => {
      setShareText((value) => current
        ? value.replace(`\n\n${nextExperimentSentence}`, '').replace(nextExperimentSentence, '').trim()
        : `${value.trim()}\n\n${nextExperimentSentence}`)
      return !current
    })
  }
  const canUseWebShare = typeof navigator.share === 'function'
  const shareDiscovery = async () => {
    try {
      await navigator.share({ text: shareText, url: publicUrl })
    } catch {
      // Closing the native share sheet is a user choice, not an error state.
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/35 p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="w-full max-w-xl rounded-[1.75rem] border border-line bg-canvas p-6 shadow-lift sm:p-8" role="dialog" aria-modal="true" aria-labelledby="share-heading">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Optional</p>
            <h2 id="share-heading" className="mt-2 font-display text-3xl tracking-[-0.035em] text-ink">Share your discovery</h2>
            <p className="mt-3 text-sm leading-6 text-muted">Choose what you want someone else to see. Your private reflection stays private unless you include it.</p>
          </div>
          <button type="button" autoFocus onClick={onClose} className="rounded-full border border-line px-3 py-1.5 text-sm text-muted hover:text-ink" aria-label="Close share reflection">Close</button>
        </div>

        <label htmlFor="share-text" className="mt-6 block text-sm font-semibold text-ink">Your reflection</label>
        <textarea
          id="share-text"
          value={shareText}
          onChange={(event) => setShareText(event.target.value)}
          rows={5}
          className="mt-2 w-full resize-y rounded-2xl border border-line bg-white/80 p-4 text-sm leading-6 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
        />
        {nextExperiment && (
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white/55 p-4 text-sm leading-6 text-muted">
            <input type="checkbox" checked={includeNextExperiment} onChange={toggleNextExperiment} className="mt-1 h-4 w-4 rounded border-line text-accent focus:ring-accent/20" />
            <span>Include what I want to explore next</span>
          </label>
        )}
        <p className="mt-4 text-sm font-medium text-accent">Try your own career simulation</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => copyValue(shareText, 'Text copied')} className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-accent-dark">Copy text</button>
          <button type="button" onClick={() => copyValue(publicUrl, 'Simulation link copied')} className="min-h-11 rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink transition hover:border-accent/35">Copy simulation link</button>
          {canUseWebShare && <button type="button" onClick={shareDiscovery} className="min-h-11 rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink transition hover:border-accent/35">Share</button>}
        </div>
        {copyStatus && <p className="mt-3 text-sm text-muted" aria-live="polite">{copyStatus}</p>}
      </section>
    </div>
  )
}
