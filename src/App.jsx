import React from 'react'
import { Route, Routes } from 'react-router-dom'
import FutureFeeling from './pages/FutureFeeling'
import CareerSnapshotPage from './pages/CareerSnapshotPage'
import Home from './pages/Home'
import MyFutures from './pages/MyFutures'
import NextExperiment from './pages/NextExperiment'
import SimulationDecide from './pages/SimulationDecide'
import SimulationEntry from './pages/SimulationEntry'
import SimulationExplore from './pages/SimulationExplore'
import SimulationOutcome from './pages/SimulationOutcome'
import SimulationReflect from './pages/SimulationReflect'
import SimulationRespond from './pages/SimulationRespond'
import { SimulationStateProvider } from './state/SimulationState'

export default function App() {
  return (
    <SimulationStateProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-futures" element={<MyFutures />} />
        <Route path="/my-futures/:snapshotId" element={<CareerSnapshotPage />} />
        <Route path="/simulate/:transitionId" element={<SimulationEntry />} />
        <Route path="/simulate/:transitionId/explore" element={<SimulationExplore />} />
        <Route path="/simulate/:transitionId/decide" element={<SimulationDecide />} />
        <Route path="/simulate/:transitionId/respond" element={<SimulationRespond />} />
        <Route path="/simulate/:transitionId/reflect" element={<SimulationReflect />} />
        <Route path="/simulate/:transitionId/future-feeling" element={<FutureFeeling />} />
        <Route path="/simulate/:transitionId/next-experiment/:outcomeId" element={<NextExperiment />} />
        <Route path="/simulate/:transitionId/outcome/:outcomeId" element={<SimulationOutcome />} />
      </Routes>
    </SimulationStateProvider>
  )
}
