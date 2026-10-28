import { useSelector } from 'react-redux'
import tickerDivider from '@/assets/landing/ticker-divider.svg'
import {
  TickerBar,
  TickerTrack,
  TickerItem,
  TickerValue,
  TickerLabel,
  TickerDivider,
} from './StatsTicker.styles'

// Must match the translate distance in StatsTicker.styles (one copy = 1/N).
const TRACK_COPIES = 4

const formatCount = (value) => `${value.toLocaleString('id-ID')}+`

function StatsTicker() {
  // Display-only data — read straight from the store, as with TrustCard. The
  // backend already drops features with no content, so whatever arrives here
  // is worth showing.
  const ticker = useSelector((state) => state.home.stats.ticker)
  const items = Array.isArray(ticker) ? ticker : []

  if (items.length === 0) return null

  const renderCopy = (copyIndex) =>
    items.map((item) => (
      <TickerItem key={`${copyIndex}-${item.key}`}>
        <TickerValue>{formatCount(item.count)}</TickerValue>
        <TickerLabel>{item.label}</TickerLabel>
        <TickerDivider src={tickerDivider} alt="" />
      </TickerItem>
    ))

  return (
    <TickerBar>
      <TickerTrack>
        {Array.from({ length: TRACK_COPIES }, (_, copyIndex) =>
          copyIndex === 0 ? (
            renderCopy(copyIndex)
          ) : (
            // Duplicates exist only to keep the loop seamless — a screen reader
            // should hear the list once.
            <span key={copyIndex} aria-hidden="true" style={{ display: 'contents' }}>
              {renderCopy(copyIndex)}
            </span>
          )
        )}
      </TickerTrack>
    </TickerBar>
  )
}

export default StatsTicker
