import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { simulations } from '../data/simulations'

const PROGRESS_STORAGE_KEYS = {
  'ba-to-pm': 'career-gps:maya-ba-to-pm:v1',
  'engineer-to-pm': 'career-gps:engineer-to-pm:v1',
  'ba-to-pm-stakeholder-conflict': 'career-gps:simulation:ba-to-pm:stakeholder-conflict:v1',
  'ba-to-pm-product-strategy': 'career-gps:simulation:ba-to-pm:product-strategy:v1',
  'ba-to-pm-customer-discovery': 'career-gps:simulation:ba-to-pm:customer-discovery:v1',
  'ba-to-pm-living-with-decision': 'career-gps:simulation:ba-to-pm:living-with-decision:v1',
  'engineer-to-pm-build-buy-partner': 'career-gps:simulation:engineer-to-pm:build-buy-partner:v1',
  'engineer-to-pm-growth-economics': 'career-gps:simulation:engineer-to-pm:growth-economics:v1',
  'engineer-to-pm-engineering-owns-how': 'career-gps:simulation:engineer-to-pm:engineering-owns-how:v1',
  'engineer-to-pm-launch-technically-ready': 'career-gps:simulation:engineer-to-pm:launch-technically-ready:v1',
  // Legacy keys remain here so clearing Try the Work also removes older prototype data.
  'engineer-to-pm-roadmap-influence': 'career-gps:simulation:engineer-to-pm:roadmap-influence:v1',
  'engineer-to-pm-problem-before-solution': 'career-gps:simulation:engineer-to-pm:problem-before-solution:v1',
}
const FUTURES_STORAGE_KEY = 'career-gps:saved-futures:v1'

const initialState = {
  version: 1,
  hasStarted: false,
  currentStage: 'context',
  completedAt: '',
  updatedAt: '',
  exploredIds: [],
  savedQuestions: [],
  decisionId: '',
  customDecision: '',
  customDecisionCaptured: false,
  decisionReasons: [],
  customReason: '',
  responseId: '',
  customResponse: '',
  energizing: [],
  customEnergizing: '',
  uncomfortable: [],
  customUncomfortable: '',
  futureFeeling: '',
  nextExperiment: '',
  nextPreferences: [],
  leastAppealing: [],
  customLeastAppealing: '',
  reflectionSaved: false,
}

const freshState = () => ({
  ...initialState,
  exploredIds: [],
  savedQuestions: [],
  decisionReasons: [],
  energizing: [],
  uncomfortable: [],
  nextPreferences: [],
  leastAppealing: [],
})

const SimulationStateContext = createContext(null)

function loadSimulationState(transitionId) {
  if (typeof window === 'undefined') return freshState()

  try {
    const saved = window.localStorage.getItem(PROGRESS_STORAGE_KEYS[transitionId])
    return saved ? { ...freshState(), ...JSON.parse(saved) } : freshState()
  } catch {
    return freshState()
  }
}

function loadActiveSimulations() {
  return Object.keys(simulations).reduce((result, transitionId) => ({
    ...result,
    [transitionId]: loadSimulationState(transitionId),
  }), {})
}

function loadSavedFutures() {
  if (typeof window === 'undefined') return []

  try {
    const saved = window.localStorage.getItem(FUTURES_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function SimulationStateProvider({ children }) {
  const [activeSimulations, setActiveSimulations] = useState(loadActiveSimulations)
  const [savedFutures, setSavedFutures] = useState(loadSavedFutures)

  useEffect(() => {
    Object.entries(activeSimulations).forEach(([transitionId, state]) => {
      const storageKey = PROGRESS_STORAGE_KEYS[transitionId]
      if (!storageKey) return
      if (state.hasStarted || state.completedAt) window.localStorage.setItem(storageKey, JSON.stringify(state))
      else window.localStorage.removeItem(storageKey)
    })
  }, [activeSimulations])

  useEffect(() => {
    if (savedFutures.length) window.localStorage.setItem(FUTURES_STORAGE_KEY, JSON.stringify(savedFutures))
    else window.localStorage.removeItem(FUTURES_STORAGE_KEY)
  }, [savedFutures])

  const actions = useMemo(() => ({
    setTransitionField(transitionId, field, value) {
      setActiveSimulations((current) => ({
        ...current,
        [transitionId]: { ...(current[transitionId] || freshState()), [field]: value, updatedAt: new Date().toISOString() },
      }))
    },
    addTransitionUnique(transitionId, field, value) {
      setActiveSimulations((current) => {
        const state = current[transitionId] || freshState()
        if (state[field].includes(value)) return current
        return { ...current, [transitionId]: { ...state, [field]: [...state[field], value], updatedAt: new Date().toISOString() } }
      })
    },
    toggleTransitionValue(transitionId, field, value) {
      setActiveSimulations((current) => {
        const state = current[transitionId] || freshState()
        return {
          ...current,
          [transitionId]: {
            ...state,
            [field]: state[field].includes(value) ? state[field].filter((item) => item !== value) : [...state[field], value],
            updatedAt: new Date().toISOString(),
          },
        }
      })
    },
    resetTransition(transitionId) {
      setActiveSimulations((current) => ({ ...current, [transitionId]: freshState() }))
    },
    saveSnapshot(snapshot) {
      setSavedFutures((current) => {
        const existingIndex = current.findIndex((item) => item.id === snapshot.id)
        if (existingIndex === -1) return [...current, snapshot]
        return current.map((item, index) => index === existingIndex ? snapshot : item)
      })
    },
    removeSnapshot(snapshotId) {
      setSavedFutures((current) => current.filter((snapshot) => snapshot.id !== snapshotId))
    },
    clearAllCareerGpsData() {
      Object.values(PROGRESS_STORAGE_KEYS).forEach((storageKey) => window.localStorage.removeItem(storageKey))
      window.localStorage.removeItem(FUTURES_STORAGE_KEY)
      setActiveSimulations(Object.keys(simulations).reduce((result, transitionId) => ({ ...result, [transitionId]: freshState() }), {}))
      setSavedFutures([])
    },
  }), [])

  return (
    <SimulationStateContext.Provider value={{ activeSimulations, savedFutures, ...actions }}>
      {children}
    </SimulationStateContext.Provider>
  )
}

export function useSimulationState() {
  const context = useContext(SimulationStateContext)
  if (!context) throw new Error('useSimulationState must be used within SimulationStateProvider')
  return context
}

export function useTransitionSimulation(transitionId) {
  const context = useSimulationState()
  const state = context.activeSimulations[transitionId] || initialState
  const setField = useCallback((field, value) => context.setTransitionField(transitionId, field, value), [context.setTransitionField, transitionId])
  const addUnique = useCallback((field, value) => context.addTransitionUnique(transitionId, field, value), [context.addTransitionUnique, transitionId])
  const toggleValue = useCallback((field, value) => context.toggleTransitionValue(transitionId, field, value), [context.toggleTransitionValue, transitionId])
  const resetSimulation = useCallback(() => context.resetTransition(transitionId), [context.resetTransition, transitionId])

  return {
    state,
    activeSimulations: context.activeSimulations,
    savedFutures: context.savedFutures,
    saveSnapshot: context.saveSnapshot,
    removeSnapshot: context.removeSnapshot,
    setField,
    addUnique,
    toggleValue,
    resetSimulation,
  }
}

export function useTrackSimulationStage(transitionId, stage, enabled = true) {
  const { state, setField } = useTransitionSimulation(transitionId)

  useEffect(() => {
    if (enabled && state.currentStage !== stage) setField('currentStage', stage)
  }, [enabled, setField, stage, state.currentStage])
}
