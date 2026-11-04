import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import EmptyState from '@components/common/EmptyState'
import { WebinarSkeletonGrid } from '@components/common/SkeletonCard'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'
import { getRegistrationStatus } from '../../utils'
import {
  FilterCard, FilterField, FilterLabel, FilterActions,
  FilterStatusSection, FilterStatusLabel,
  RegistrationFilterRow, RegistrationFilterTab,
  Grid, WebinarCard, Thumbnail, CardBody, CardTitle, CardSpeakerName,
  CardDateText, CardDescText, CardFooterRow,
} from './WebinarListTab.styles'

const REGISTRATION_FILTERS = [
  { key: 'open',     label: 'Pendaftaran Aktif' },
  { key: 'closed',   label: 'Sudah Selesai' },
  { key: 'upcoming', label: 'Akan Dibuka' },
  { key: 'all',      label: 'Semua' },
]

function WebinarListTab({ webinars, filter, loading, onSearchChange, onSearch, onRegistrationFilterChange, onDetail, onRegister }) {
  return (
    <>
      <FilterCard>
        <FilterStatusLabel>Status Pendaftaran</FilterStatusLabel>
        <RegistrationFilterRow>
          {REGISTRATION_FILTERS.map(({ key, label }) => (
            <RegistrationFilterTab
              key={key}
              $active={filter.registrationStatus === key}
              onClick={() => onRegistrationFilterChange(key)}
            >
              {label}
            </RegistrationFilterTab>
          ))}
        </RegistrationFilterRow>

        <FilterStatusSection>
          <form onSubmit={onSearch}>
            <FilterField>
              <FilterLabel>Judul Webinar</FilterLabel>
              <TextInput
                placeholder="Cari webinar berdasarkan judul..."
                value={filter.search || ''}
                onChange={e => onSearchChange(e.target.value)}
              />
            </FilterField>
            <FilterActions>
              <Button variant="primary" type="submit">Cari</Button>
            </FilterActions>
          </form>
        </FilterStatusSection>
      </FilterCard>

      {loading.isGetListLoading ? (
        <WebinarSkeletonGrid count={6} />
      ) : webinars.length === 0 ? (
        <EmptyState icon="🎓" title="Tidak ada webinar tersedia saat ini." />
      ) : (
        <Grid>
          {webinars.map(w => (
            <WebinarCard key={w.uniqueId}>
              <PhotoProvider>
                <Thumbnail $hasImage={!!w.thumbnail?.url}>
                  {w.thumbnail?.url ? (
                    <PhotoView src={w.thumbnail.url}>
                      <img src={w.thumbnail.url} alt={w.title} />
                    </PhotoView>
                  ) : '🎓'}
                </Thumbnail>
              </PhotoProvider>

              <CardBody>
                <CardTitle>{w.title}</CardTitle>
                {w.speakers?.length > 0 && (
                  <CardSpeakerName>
                    🎤 {w.speakers.map(s => s.name).filter(Boolean).join(', ')}
                  </CardSpeakerName>
                )}
                <CardDateText>
                  📅 {formatJakartaDateTimeFull(w.startAt)}
                  {w.endAt && ` — ${formatJakartaDateTimeFull(w.endAt)}`}
                </CardDateText>
                {w.description && <CardDescText>{w.description}</CardDescText>}
              </CardBody>

              <CardFooterRow>
                <Button variant="ghost" onClick={() => onDetail(w)}>Lihat Detail</Button>
                {w.myRegistrationStatus === 'approved' ? (
                  <Button variant="secondary" disabled>✓ Terdaftar</Button>
                ) : getRegistrationStatus(w) === 'upcoming' ? (
                  <Button variant="secondary" disabled>Belum Dibuka</Button>
                ) : getRegistrationStatus(w) === 'closed' ? (
                  <Button variant="secondary" disabled>Pendaftaran Ditutup</Button>
                ) : w.myRegistrationStatus === 'rejected' ? (
                  <Button variant="primary" onClick={() => onRegister(w)}>Daftar Ulang</Button>
                ) : (
                  <Button variant="primary" onClick={() => onRegister(w)}>Daftar</Button>
                )}
              </CardFooterRow>
            </WebinarCard>
          ))}
        </Grid>
      )}
    </>
  )
}

export default WebinarListTab
