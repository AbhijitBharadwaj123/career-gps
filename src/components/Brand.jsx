import React from 'react'
import { Link } from 'react-router-dom'

export default function Brand() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
      aria-label="Career GPS home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white shadow-sm">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="m9 15 2-5 4-2-2 5-4 2Z" fill="currentColor" />
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">Career GPS</span>
    </Link>
  )
}
