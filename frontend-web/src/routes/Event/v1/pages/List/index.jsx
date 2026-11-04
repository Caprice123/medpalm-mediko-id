import Pagination from '@components/Pagination'
import { PageWrapper, Container, PageTitle, PageSubtitle, TabBar, TabBtn } from './List.styles'
import { useEventList } from './hooks/useEventList'
import EventListTab from './components/EventListTab'
import MyRegistrationsTab from './components/MyRegistrationsTab'
import EventDetailModal from './components/EventDetailModal'
import RegisterModal from './components/RegisterModal'

function EventListPage() {
  const {
    events, myRegistrations, filter, pagination, loading,
    tab, setTab,
    detailTarget, setDetailTarget,
    registerTarget, setRegisterTarget,
    handleSearch, handleSearchChange,
    handleRegistrationFilterChange,
    handlePageChange, handleRegisterSuccess,
  } = useEventList()

  return (
    <PageWrapper>
      <Container>
        <PageTitle>🗓️ Events</PageTitle>
        <PageSubtitle>Daftar & ikuti event eksklusif yang tersedia untukmu</PageSubtitle>

        <TabBar>
          <TabBtn $active={tab === 'list'} onClick={() => setTab('list')}>Events Tersedia</TabBtn>
          <TabBtn $active={tab === 'registrations'} onClick={() => setTab('registrations')}>
            Pendaftaran Saya
          </TabBtn>
        </TabBar>

        {tab === 'list' && (
          <EventListTab
            events={events}
            filter={filter}
            loading={loading}
            onSearchChange={handleSearchChange}
            onSearch={handleSearch}
            onRegistrationFilterChange={handleRegistrationFilterChange}
            onDetail={setDetailTarget}
            onRegister={setRegisterTarget}
          />
        )}

        {tab === 'registrations' && (
          <MyRegistrationsTab
            myRegistrations={myRegistrations}
            loading={loading}
            onSwitchToList={() => setTab('list')}
          />
        )}

        {!loading.isGetListLoading && !loading.isGetMyRegistrationsLoading &&
          (pagination.page > 1 || !pagination.isLastPage) && (
          <Pagination
            variant="admin"
            currentPage={pagination.page}
            isLastPage={pagination.isLastPage}
            onPageChange={handlePageChange}
            isLoading={tab === 'list' ? loading.isGetListLoading : loading.isGetMyRegistrationsLoading}
            language="id"
          />
        )}

        {detailTarget && (
          <EventDetailModal
            event={detailTarget}
            onClose={() => setDetailTarget(null)}
            onRegister={setRegisterTarget}
          />
        )}

        {registerTarget && (
          <RegisterModal
            event={registerTarget}
            onClose={() => setRegisterTarget(null)}
            onSuccess={handleRegisterSuccess}
          />
        )}
      </Container>
    </PageWrapper>
  )
}

export default EventListPage
