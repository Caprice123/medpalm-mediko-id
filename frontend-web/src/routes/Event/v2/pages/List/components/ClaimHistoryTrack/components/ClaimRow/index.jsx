import {
  PiCheckCircle, PiHourglass, PiXCircle, PiLockKeyOpen,
  PiCoins, PiClock, PiPaperclip,
} from 'react-icons/pi'
import Button from '@components/common/Button'
import { formatJakartaDateLong } from '@utils/dateUtils'
import {
  CLAIM_STATUS_LABEL, describeGranted, isGrantExpired, getClaimWindow,
} from '../../../../utils/claimState'
import {
  RowFrame, StatusDisc, RowBody, RowTitle, RowMeta,
  GrantedList, GrantedTag, WaitingNote, AdminNote,
  EvidenceList, EvidenceLink, RowSide, StatusBadge,
} from './ClaimRow.styles'

const STATUS_ICON = {
  approved: PiCheckCircle,
  pending: PiHourglass,
  rejected: PiXCircle,
}

function ClaimRow({ claim, featureLabels, onReclaim }) {
  const StatusIcon = STATUS_ICON[claim.status] ?? PiHourglass
  const granted = describeGranted(claim, featureLabels)

  // Offering "Klaim ulang" on an event whose window has since closed would send
  // the student into a request the server rejects, so the action only appears
  // while the window is genuinely still open.
  const canReclaim = claim.status === 'rejected'
    && !!claim.event?.code
    && getClaimWindow(claim.event) === 'open'

  return (
    <RowFrame>
      <StatusDisc $status={claim.status}>
        <StatusIcon size={21} aria-hidden="true" />
      </StatusDisc>

      <RowBody>
        <RowTitle>{claim.event?.title || 'Event tidak ditemukan'}</RowTitle>
        <RowMeta>
          Diajukan {formatJakartaDateLong(claim.createdAt)}
          {claim.reviewedAt && ` · ditinjau ${formatJakartaDateLong(claim.reviewedAt)}`}
        </RowMeta>

        {claim.status === 'approved' && !granted.isEmpty && (
          <GrantedList>
            {granted.credits && (
              <GrantedTag>
                <PiCoins size={15} aria-hidden="true" />
                <b>{granted.credits}</b> kredit diterima
              </GrantedTag>
            )}
            {granted.features.map(feature => {
              const expired = isGrantExpired(claim.reviewedAt, feature.durationDays)
              return (
                <GrantedTag key={feature.key} $expired={expired === true}>
                  <PiLockKeyOpen size={15} aria-hidden="true" />
                  {feature.name}
                  {feature.durationDays ? ` · ${feature.durationDays} hari` : ''}
                  {expired === true && ' — masa akses sudah berakhir'}
                </GrantedTag>
              )
            })}
          </GrantedList>
        )}

        {claim.status === 'pending' && (
          <WaitingNote>
            <PiClock size={15} aria-hidden="true" />
            Menunggu review admin
          </WaitingNote>
        )}

        {claim.adminNotes && (
          <AdminNote><b>Catatan admin:</b> {claim.adminNotes}</AdminNote>
        )}

        {claim.evidences?.length > 0 && (
          <EvidenceList>
            {claim.evidences.map((evidence, i) => (
              <EvidenceLink key={i} href={evidence.url} target="_blank" rel="noreferrer">
                <PiPaperclip size={13} aria-hidden="true" />
                <span>{evidence.filename || `Bukti ${i + 1}`}</span>
              </EvidenceLink>
            ))}
          </EvidenceList>
        )}
      </RowBody>

      <RowSide>
        <StatusBadge $status={claim.status}>
          {CLAIM_STATUS_LABEL[claim.status] || claim.status}
        </StatusBadge>

        {canReclaim && (
          <Button
            variant="primary"
            size="small"
            onClick={() => onReclaim({
              code: claim.event.code,
              title: claim.event.title,
              myRegistrationStatus: 'rejected',
              registrationStartAt: claim.event.registrationStartAt,
              registrationEndAt: claim.event.registrationEndAt,
            })}
          >
            Klaim ulang
          </Button>
        )}
      </RowSide>
    </RowFrame>
  )
}

export default ClaimRow
