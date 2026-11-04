import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import EmptyState from '@components/common/EmptyState'
import Loading from '@components/common/Loading'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'
import { getRegistrationStatus } from '../../utils'
import {
  FilterCard, FilterField, FilterLabel, FilterActions,
  FilterStatusSection, FilterStatusLabel,
  RegistrationFilterRow, RegistrationFilterTab,
  Grid, EventCard, Thumbnail, CardBody, CardCode, CardTitle,
  CardDateText, CardDescText, CardFooterRow,
} from './EventListTab.styles'

const REGISTRATION_FILTERS = [
  { key: 'open',     label: 'Pendaftaran Aktif' },
  { key: 'closed',   label: 'Sudah Selesai' },
  { key: 'upcoming', label: 'Akan Dibuka' },
  { key: 'all',      label: 'Semua' },
]

function EventListTab({ events, filter, loading, onSearchChange, onSearch, onRegistrationFilterChange, onDetail, onRegister }) {
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
              <FilterLabel>Cari Event</FilterLabel>
              <TextInput
                placeholder="Cari berdasarkan judul event..."
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
        <Loading text="Memuat events..." minHeight="300px" />
      ) : events.length === 0 ? (
        <EmptyState icon="🗓️" title="Tidak ada event tersedia saat ini." />
      ) : (
        <Grid>
          {events.map(event => (
            <EventCard key={event.code}>
              <PhotoProvider>
                <Thumbnail $hasImage={!!event.thumbnail?.url}>
                  {event.thumbnail?.url ? (
                    <PhotoView src={event.thumbnail.url}>
                      <img src={event.thumbnail.url} alt={event.title} />
                    </PhotoView>
                  ) : '🗓️'}
                </Thumbnail>
              </PhotoProvider>

              <CardBody>
                <CardTitle>{event.title}</CardTitle>
                {event.registrationStartAt && (
                  <CardDateText>
                    📅 Pendaftaran: {formatJakartaDateTimeFull(event.registrationStartAt)}
                    {event.registrationEndAt && ` — ${formatJakartaDateTimeFull(event.registrationEndAt)}`}
                  </CardDateText>
                )}
                {event.description && <CardDescText>{event.description}</CardDescText>}
              </CardBody>

              <CardFooterRow>
                <Button variant="ghost" onClick={() => onDetail(event)}>Lihat Detail</Button>
                {event.myRegistrationStatus === 'pending' ? (
                  <Button variant="secondary" disabled>⏳ Menunggu Review</Button>
                ) : event.myRegistrationStatus === 'approved' ? (
                  <Button variant="secondary" disabled>✓ Terdaftar</Button>
                ) : getRegistrationStatus(event) === 'upcoming' ? (
                  <Button variant="secondary" disabled>Belum Dibuka</Button>
                ) : getRegistrationStatus(event) === 'closed' ? (
                  <Button variant="secondary" disabled>Ditutup</Button>
                ) : event.myRegistrationStatus === 'rejected' ? (
                  <Button variant="primary" onClick={() => onRegister(event)}>Daftar Ulang</Button>
                ) : (
                  <Button variant="primary" onClick={() => onRegister(event)}>Daftar</Button>
                )}
              </CardFooterRow>
            </EventCard>
          ))}
        </Grid>
      )}
    </>
  )
}

export default EventListTab
