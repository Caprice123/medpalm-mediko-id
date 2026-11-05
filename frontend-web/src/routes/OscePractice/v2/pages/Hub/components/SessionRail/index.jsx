import { Panel } from '../../../../styles/surface.styles'
import LiveBlock from './components/LiveBlock'
import PerformanceRows from './components/PerformanceRows'

// The board's left rail. Composition only — both blocks read what they need for themselves.
function SessionRail({ onRequestStart }) {
  return (
    <Panel as="aside" aria-label="Sesi dan performa">
      <LiveBlock onRequestStart={onRequestStart} />
      <PerformanceRows />
    </Panel>
  )
}

export default SessionRail
