import React from 'react'
import { simulationStages } from '../data/simulations'

export default function SimulationProgress({ currentStage }) {
  return (
    <nav aria-label="Simulation stages" className="border-y border-line/80 py-4">
      <ol className="flex items-center gap-2 overflow-x-auto text-xs font-semibold tracking-wide text-muted sm:justify-center sm:gap-3">
        {simulationStages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <li
              className={stage.id === currentStage ? 'whitespace-nowrap text-accent' : 'whitespace-nowrap'}
              aria-current={stage.id === currentStage ? 'step' : undefined}
            >
              {stage.label}
            </li>
            {index < simulationStages.length - 1 && <li className="text-line" aria-hidden="true">→</li>}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}
