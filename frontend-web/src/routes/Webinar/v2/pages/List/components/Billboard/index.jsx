import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import {
  PiCalendarBlank, PiMicrophoneStage, PiHourglass,
  PiCalendarX, PiArrowRight, PiVideoCamera,
} from 'react-icons/pi'
import Button from '@components/common/Button'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'
import { getRegistrationCountdown, getWebinarAction } from '../../utils/registrationState'
import {
  BillboardFrame, DeadlineTrack, DeadlineFill, BillboardRow, BillboardCol,
  BillboardTitle, MetaList, MetaRow, ActionCard, DeadlineNote, DetailLink,
  QuietNotice, NoticeText,
} from './Billboard.styles'

function deadlineLabel(countdown) {
  if (!countdown) return null
  if (countdown.daysLeft <= 0) return 'Pendaftaran tutup hari ini'
  if (countdown.daysLeft === 1) return 'Pendaftaran tutup besok'
  return `Pendaftaran tutup ${countdown.daysLeft} hari lagi`
}

function Billboard({ onDetail, onRegister }) {
  const { featured, loading } = useSelector(state => state.webinarV2)

  if (loading.isFetchingFeatured && !featured) {
    return <Skeleton height={272} borderRadius={18} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
  }

  if (!featured) {
    return (
      <QuietNotice>
        <PiVideoCamera size={34} aria-hidden="true" />
        <NoticeText>
          <h2>Belum ada webinar yang membuka pendaftaran</h2>
          <p>Lihat tab &ldquo;Akan Dibuka&rdquo; di bawah untuk jadwal yang sudah terpasang.</p>
        </NoticeText>
      </QuietNotice>
    )
  }

  const countdown = getRegistrationCountdown(featured)
  const action = getWebinarAction(featured)
  const speakerNames = (featured.speakers || []).map(s => s.name).filter(Boolean)

  return (
    <BillboardFrame $thumbnail={featured.thumbnail?.url}>
      {countdown && !countdown.isClosed && (
        <DeadlineTrack
          role="progressbar"
          aria-label="Sisa waktu pendaftaran"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(countdown.remainingRatio * 100)}
          aria-valuetext={deadlineLabel(countdown)}
        >
          <DeadlineFill $ratio={countdown.remainingRatio} $urgent={countdown.isUrgent} />
        </DeadlineTrack>
      )}

      <BillboardRow>
        <BillboardCol xs={12} lg={7} xl={8}>
          <BillboardTitle>{featured.title}</BillboardTitle>
          <MetaList>
            <MetaRow>
              <PiCalendarBlank size={18} aria-hidden="true" />
              <span>
                <strong>{formatJakartaDateTimeFull(featured.startAt)}</strong>
                {featured.endAt && ` — ${formatJakartaDateTimeFull(featured.endAt)}`}
              </span>
            </MetaRow>
            {speakerNames.length > 0 && (
              <MetaRow>
                <PiMicrophoneStage size={18} aria-hidden="true" />
                <span>{speakerNames.join(' · ')}</span>
              </MetaRow>
            )}
          </MetaList>
        </BillboardCol>

        <BillboardCol xs={12} lg={5} xl={4}>
          <ActionCard>
            {countdown && !countdown.isClosed && (
              <DeadlineNote $urgent={countdown.isUrgent}>
                {countdown.isUrgent
                  ? <PiHourglass size={16} aria-hidden="true" />
                  : <PiCalendarX size={16} aria-hidden="true" />}
                <span>
                  {deadlineLabel(countdown)}
                  {featured.registrationEndAt && ` — ${formatJakartaDateTimeFull(featured.registrationEndAt)}`}
                </span>
              </DeadlineNote>
            )}

            <Button
              variant="primary"
              size="large"
              fullWidth
              disabled={action.disabled}
              onClick={() => onRegister(featured)}
            >
              {action.label}
            </Button>

            <DetailLink type="button" onClick={() => onDetail(featured)}>
              Lihat detail lengkap
              <PiArrowRight size={15} aria-hidden="true" />
            </DetailLink>
          </ActionCard>
        </BillboardCol>
      </BillboardRow>
    </BillboardFrame>
  )
}

export default Billboard
