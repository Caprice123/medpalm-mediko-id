import Button from '@components/common/Button'
import Loading from '@components/common/Loading'
import { LoadMoreWrapper } from './LoadMore.styles'

/**
 * Bottom-of-list control for admin tables that accumulate rows ("Muat Lebih Banyak").
 *
 * While the next page is fetched the rows already on screen stay put and the spinner
 * appears here, underneath them. The alternative — letting the Table swap itself for its
 * full-height loading state — empties the list, collapses the page, and throws the admin
 * back to the top every time they ask for more.
 *
 * Pair it with `loading={isLoading && items.length === 0}` on the Table, so only the very
 * first fetch (when there is nothing to keep on screen) gets that full state.
 *
 * @param {Object} props
 * @param {boolean} props.isLastPage - From the feature's Redux pagination; hides the button
 * @param {boolean} props.isLoading - The feature's Redux fetching flag
 * @param {number} props.itemCount - Rows currently rendered; 0 means the Table owns the state
 * @param {Function} props.onClick - Dispatches the feature's loadMore thunk
 * @param {string} props.label - Button text (defaults to "Muat Lebih Banyak")
 * @param {string} props.loadingText - Text beside the spinner (defaults to "Memuat...")
 */
function LoadMore({
  isLastPage,
  isLoading,
  itemCount = 0,
  onClick,
  label = 'Muat Lebih Banyak',
  loadingText = 'Memuat...',
}) {
  // Nothing rendered yet — the Table is showing its own loading or empty state, and a
  // second spinner here would just double it up.
  if (!itemCount) return null

  if (isLoading) {
    return (
      <LoadMoreWrapper>
        <Loading type="dots" size="small" text={loadingText} textSize="small" gap="0.25rem" />
      </LoadMoreWrapper>
    )
  }

  if (isLastPage) return null

  return (
    <LoadMoreWrapper>
      <Button variant="secondary" onClick={onClick}>{label}</Button>
    </LoadMoreWrapper>
  )
}

export default LoadMore
