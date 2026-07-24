import { Suspense } from 'react'
import lazyWithRetry from '@utils/lazyWithRetry'
import PageLoader from '@components/PageLoader'

const TopicListPage = lazyWithRetry(() => import('../v2-1/pages/TopicList'))

export function FlashcardListRouter() {
  return (
    <Suspense fallback={<PageLoader text="Loading..." />}>
      <TopicListPage />
    </Suspense>
  )
}
