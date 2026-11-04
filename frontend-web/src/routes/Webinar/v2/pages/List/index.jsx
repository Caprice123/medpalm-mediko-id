import { PageWrapper, PageContainer } from './List.styles'
import { useWebinarList } from './hooks/useWebinarList'
import PageHeading from './components/PageHeading'
import Billboard from './components/Billboard'
import MyRegistrationsBand from './components/MyRegistrationsBand'
import WebinarFilters from './components/WebinarFilters'
import WebinarGrid from './components/WebinarGrid'
import WebinarDetailModal from './components/WebinarDetailModal'
import RegisterModal from './components/RegisterModal'

function WebinarListPage() {
  const {
    detailTarget, registerTarget,
    openDetail, closeDetail, openRegister, closeRegister,
    handleRegistrationStatusChange, handleSearchSubmit,
    handleLoadMore, handleRegisterSuccess,
  } = useWebinarList()

  return (
    <PageWrapper>
      <PageContainer fluid>
        <PageHeading />

        <Billboard onDetail={openDetail} onRegister={openRegister} />

        <MyRegistrationsBand onReapply={openRegister} />

        <WebinarFilters
          onStatusChange={handleRegistrationStatusChange}
          onSearchSubmit={handleSearchSubmit}
        />

        <WebinarGrid
          onDetail={openDetail}
          onRegister={openRegister}
          onLoadMore={handleLoadMore}
        />
      </PageContainer>

      {detailTarget && (
        <WebinarDetailModal
          webinar={detailTarget}
          onClose={closeDetail}
          onRegister={openRegister}
        />
      )}

      {registerTarget && (
        <RegisterModal
          webinar={registerTarget}
          onClose={closeRegister}
          onSuccess={handleRegisterSuccess}
        />
      )}
    </PageWrapper>
  )
}

export default WebinarListPage
