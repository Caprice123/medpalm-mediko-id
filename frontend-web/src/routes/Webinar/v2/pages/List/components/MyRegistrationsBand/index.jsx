import {
  PiCheckCircle, PiHourglass, PiXCircle, PiLinkSimple,
  PiPaperclip, PiCalendarBlank,
} from 'react-icons/pi'
import Button from '@components/common/Button'
import { formatJakartaDateTimeFull, formatJakartaDateLong } from '@utils/dateUtils'
import { REGISTRATION_STATUS_LABEL } from '../../utils/registrationState'
import { useMyRegistrationsBand } from './hooks/useMyRegistrationsBand'
import {
  BandStrip, BandHeader, BandLabel, StatusChip, JoinAction, EmptyLine,
  Drawer, RegistrationRow, RowBody, RowMeta, AdminNote, LinkRow,
  EvidenceLink, JoinLink, RowAction,
} from './MyRegistrationsBand.styles'

const CHIPS = [
  { status: 'approved', Icon: PiCheckCircle },
  { status: 'pending', Icon: PiHourglass },
  { status: 'rejected', Icon: PiXCircle },
]

function MyRegistrationsBand({ onReapply }) {
  const {
    isLoading, hasRegistrations, counts, nextJoinable,
    openStatus, visibleRegistrations, toggleStatus,
  } = useMyRegistrationsBand()

  if (isLoading && !hasRegistrations) {
    return (
      <BandStrip>
        <BandHeader>
          <BandLabel>Pendaftaran Saya</BandLabel>
          <EmptyLine>Memuat pendaftaran…</EmptyLine>
        </BandHeader>
      </BandStrip>
    )
  }

  if (!hasRegistrations) {
    return (
      <BandStrip>
        <BandHeader>
          <BandLabel>Pendaftaran Saya</BandLabel>
          <EmptyLine>
            Belum ada pendaftaran. Status dan link bergabung akan muncul di sini setelah kamu mendaftar.
          </EmptyLine>
        </BandHeader>
      </BandStrip>
    )
  }

  return (
    <BandStrip>
      <BandHeader>
        <BandLabel>Pendaftaran Saya</BandLabel>

        {CHIPS.filter(({ status }) => counts[status] > 0).map((chip) => {
          const ChipIcon = chip.Icon
          return (
            <StatusChip
              key={chip.status}
              type="button"
              $status={chip.status}
              $active={openStatus === chip.status}
              aria-expanded={openStatus === chip.status}
              onClick={() => toggleStatus(chip.status)}
            >
              <ChipIcon size={16} aria-hidden="true" />
              <b>{counts[chip.status]}</b>
              {REGISTRATION_STATUS_LABEL[chip.status]}
            </StatusChip>
          )
        })}

        {nextJoinable && (
          <JoinAction
            href={nextJoinable.webinar.joinUrl[0].url}
            target="_blank"
            rel="noreferrer"
          >
            <PiLinkSimple size={16} aria-hidden="true" />
            <span>Link bergabung: {nextJoinable.webinar.title}</span>
          </JoinAction>
        )}
      </BandHeader>

      {openStatus && (
        <Drawer>
          {visibleRegistrations.map(reg => (
            <RegistrationRow key={reg.uniqueId}>
              <RowBody>
                <h3>{reg.webinar?.title || 'Webinar tidak ditemukan'}</h3>
                {reg.webinar?.startAt && (
                  <RowMeta>
                    <PiCalendarBlank size={15} aria-hidden="true" />
                    {formatJakartaDateTimeFull(reg.webinar.startAt)}
                  </RowMeta>
                )}
                <RowMeta>Didaftarkan {formatJakartaDateLong(reg.createdAt)}</RowMeta>

                {reg.adminNotes && (
                  <AdminNote>
                    <strong>Catatan admin:</strong> {reg.adminNotes}
                  </AdminNote>
                )}

                {(reg.evidences?.length > 0 || reg.webinar?.joinUrl?.length > 0) && (
                  <LinkRow>
                    {reg.status === 'approved' && reg.webinar?.joinUrl?.map((link, i) => (
                      <JoinLink key={`join-${i}`} href={link.url} target="_blank" rel="noreferrer">
                        <PiLinkSimple size={13} aria-hidden="true" />
                        <span>
                          {reg.webinar.joinUrl.length > 1 ? `Link bergabung ${i + 1}` : 'Link bergabung'}
                        </span>
                      </JoinLink>
                    ))}
                    {reg.evidences?.map((ev, i) => (
                      <EvidenceLink key={`ev-${i}`} href={ev.url} target="_blank" rel="noreferrer">
                        <PiPaperclip size={13} aria-hidden="true" />
                        <span>{ev.filename || `Bukti ${i + 1}`}</span>
                      </EvidenceLink>
                    ))}
                  </LinkRow>
                )}
              </RowBody>

              {reg.status === 'rejected' && reg.webinar?.uniqueId && (
                <RowAction>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => onReapply({
                      uniqueId: reg.webinar.uniqueId,
                      title: reg.webinar.title,
                      myRegistrationStatus: 'rejected',
                    })}
                  >
                    Daftar ulang
                  </Button>
                </RowAction>
              )}
            </RegistrationRow>
          ))}
        </Drawer>
      )}
    </BandStrip>
  )
}

export default MyRegistrationsBand
