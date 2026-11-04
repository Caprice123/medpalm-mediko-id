import { useSelector } from 'react-redux'
import Skeleton from 'react-loading-skeleton'
import { PiClipboardText } from 'react-icons/pi'
import { TrackHeader, TrackCount, TrackRule } from '../../List.styles'
import { CLAIM_STATUS_LABEL, countClaimsByStatus } from '../../utils/claimState'
import ClaimRow from './components/ClaimRow'
import {
  RowList, SummaryChips, SummaryChip, EmptyNotice,
} from './ClaimHistoryTrack.styles'

const CHIP_ORDER = ['approved', 'pending', 'rejected']

function ClaimHistoryTrack({ featureLabels, onReclaim }) {
  const { claims, loading } = useSelector(state => state.eventV2)
  const counts = countClaimsByStatus(claims)

  return (
    <section>
      <TrackHeader>
        <h2>Riwayat klaim</h2>
        {claims.length > 0 && <TrackCount>{claims.length}</TrackCount>}
        {claims.length > 0 && (
          <SummaryChips>
            {CHIP_ORDER.filter(status => counts[status] > 0).map(status => (
              <SummaryChip key={status} $status={status}>
                {counts[status]} {CLAIM_STATUS_LABEL[status].toLowerCase()}
              </SummaryChip>
            ))}
          </SummaryChips>
        )}
        <TrackRule />
      </TrackHeader>

      {loading.isFetchingClaims && claims.length === 0 ? (
        <RowList>
          {[0, 1].map(i => (
            <Skeleton
              key={i}
              height={92}
              borderRadius={13}
              baseColor="var(--color-gray-200)"
              highlightColor="var(--color-gray-100)"
            />
          ))}
        </RowList>
      ) : claims.length === 0 ? (
        <EmptyNotice>
          <PiClipboardText size={30} aria-hidden="true" />
          <div>
            <h3>Belum ada klaim</h3>
            <p>Begitu kamu mengklaim sebuah event, statusnya dan apa yang kamu terima muncul di sini.</p>
          </div>
        </EmptyNotice>
      ) : (
        <RowList>
          {claims.map(claim => (
            <ClaimRow
              key={claim.uniqueId}
              claim={claim}
              featureLabels={featureLabels}
              onReclaim={onReclaim}
            />
          ))}
        </RowList>
      )}
    </section>
  )
}

export default ClaimHistoryTrack
