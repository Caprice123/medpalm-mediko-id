import Pagination from '@components/Pagination'
import { PageWrapper, Container, PageTitle, PageSubtitle, TabBar, TabBtn } from './List.styles'
import { useWebinarList } from './hooks/useWebinarList'
import WebinarListTab from './components/WebinarListTab'
import MyRegistrationsTab from './components/MyRegistrationsTab'
import WebinarDetailModal from './components/WebinarDetailModal'
import RegisterModal from './components/RegisterModal'

function WebinarPage() {
  const {
    webinars, myRegistrations, filter, pagination, loading,
    tab, setTab,
    detailTarget, setDetailTarget,
    registerTarget, setRegisterTarget,
    handleSearch, handleSearchChange,
    handleRegistrationFilterChange,
    handlePageChange, handleRegisterSuccess,
  } = useWebinarList()

  return (
    <PageWrapper>
      <Container>
        <PageTitle>🎓 Webinar</PageTitle>
        <PageSubtitle>Daftar & ikuti webinar eksklusif dari para dokter dan spesialis</PageSubtitle>

        <TabBar>
          <TabBtn $active={tab === 'list'} onClick={() => setTab('list')}>Webinar Tersedia</TabBtn>
          <TabBtn $active={tab === 'registrations'} onClick={() => setTab('registrations')}>
            Pendaftaran Saya
          </TabBtn>
        </TabBar>

        {tab === 'list' && (
          <WebinarListTab
            webinars={webinars}
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
          <WebinarDetailModal
            webinar={detailTarget}
            onClose={() => setDetailTarget(null)}
            onRegister={setRegisterTarget}
          />
        )}

        {registerTarget && (
          <RegisterModal
            webinar={registerTarget}
            onClose={() => setRegisterTarget(null)}
            onSuccess={handleRegisterSuccess}
          />
        )}
      </Container>
    </PageWrapper>
  )
}

export default WebinarPage
