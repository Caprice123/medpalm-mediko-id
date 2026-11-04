import { PageWrapper, PageContainer } from './List.styles'
import { useEventList } from './hooks/useEventList'
import PageHeading from './components/PageHeading'
import ClaimableTrack from './components/ClaimableTrack'
import ClaimHistoryTrack from './components/ClaimHistoryTrack'
import EventDetailModal from './components/EventDetailModal'
import ClaimModal from './components/ClaimModal'

function EventListPage() {
  const {
    featureLabels,
    detailTarget, claimTarget,
    openDetail, closeDetail, openClaim, closeClaim,
    handleSearchSubmit, handleLoadMore, handleClaimSuccess,
  } = useEventList()

  return (
    <PageWrapper>
      <PageContainer fluid>
        <PageHeading />

        <ClaimableTrack
          featureLabels={featureLabels}
          onDetail={openDetail}
          onClaim={openClaim}
          onSearchSubmit={handleSearchSubmit}
          onLoadMore={handleLoadMore}
        />

        <ClaimHistoryTrack
          featureLabels={featureLabels}
          onReclaim={openClaim}
        />
      </PageContainer>

      {detailTarget && (
        <EventDetailModal
          event={detailTarget}
          featureLabels={featureLabels}
          onClose={closeDetail}
          onClaim={openClaim}
        />
      )}

      {claimTarget && (
        <ClaimModal
          event={claimTarget}
          featureLabels={featureLabels}
          onClose={closeClaim}
          onSuccess={handleClaimSuccess}
        />
      )}
    </PageWrapper>
  )
}

export default EventListPage
