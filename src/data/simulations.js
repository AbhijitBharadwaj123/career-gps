import { engineerToPmSimulation } from './engineerSimulation.js'
import { followUpSimulations } from './followUpSimulations.js'
import { mayaBaToPmSimulation } from './mayaSimulation.js'

export const simulationStages = [
  { id: 'context', label: 'Context' },
  { id: 'explore', label: 'Explore' },
  { id: 'decide', label: 'Decide' },
  { id: 'respond', label: 'Respond' },
  { id: 'reflect', label: 'Reflect' },
]

export const simulations = {
  [mayaBaToPmSimulation.id]: mayaBaToPmSimulation,
  [engineerToPmSimulation.id]: engineerToPmSimulation,
  ...Object.fromEntries(followUpSimulations.map((simulation) => [simulation.id, simulation])),
}

export const getSimulation = (transitionId) => simulations[transitionId]

export const getTransitionSimulations = (transitionId) => Object.values(simulations)
  .filter((simulation) => (simulation.transitionId || simulation.id) === transitionId)
