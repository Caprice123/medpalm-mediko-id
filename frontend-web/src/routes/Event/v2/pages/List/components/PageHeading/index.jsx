import { useSelector } from 'react-redux'
import { Heading } from './PageHeading.styles'

/**
 * Counts only what is actually loaded. The API returns `isLastPage` and never a
 * total, so an open list that has more pages says "N+" rather than claiming a
 * number it cannot know.
 */
function describeCounts({ claimableCount, isLastPage, claimCount, isLoading }) {
  if (isLoading) return 'Memuat…'

  const claimable = claimableCount === 0
    ? 'Belum ada event yang bisa diklaim'
    : `${isLastPage ? claimableCount : `${claimableCount}+`} event bisa diklaim sekarang`

  if (claimCount === 0) return claimable
  return `${claimable} · ${claimCount} klaim kamu tercatat`
}

function PageHeading() {
  const { claimable, claims, pagination, loading } = useSelector(state => state.eventV2)

  return (
    <Heading>
      <h1>Event</h1>
      <p>
        {describeCounts({
          claimableCount: claimable.length,
          isLastPage: pagination.isLastPage,
          claimCount: claims.length,
          isLoading: loading.isFetchingClaimable && claimable.length === 0,
        })}
      </p>
    </Heading>
  )
}

export default PageHeading
