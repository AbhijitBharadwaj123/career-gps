import React from 'react'

export default function ChoiceChips({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.id
        const label = typeof option === 'string' ? option : option.label
        const isSelected = selected.includes(value)

        return (
          <button
            key={value}
            type="button"
            onClick={() => onToggle(value)}
            aria-pressed={isSelected}
            className={`min-h-10 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${isSelected ? 'border-accent/35 bg-sage text-accent' : 'border-line bg-white/75 text-muted hover:border-accent/30 hover:text-ink'}`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
