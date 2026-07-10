import { Suspense } from 'react'
import lazyWithRetry from '@utils/lazyWithRetry'
import PageLoader from '@components/PageLoader'
import { getUserData } from '@utils/authToken'

const lazy = lazyWithRetry

const FlashcardV1ListPage = lazy(() => import('../v1/pages/List'))
const FlashcardV1DetailPage = lazy(() => import('../v1/pages/Detail'))

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader text="Loading..." />}>
    {Component}
  </Suspense>
)

export function FlashcardListRouter() {
  const user = getUserData()
  if (user?.role !== 'user') return withSuspense(<FlashcardV1ListPage />)
  return withSuspense(<FlashcardV1ListPage />)
}

export function FlashcardDetailRouter() {
  const user = getUserData()
  if (user?.role !== 'user') return withSuspense(<FlashcardV1DetailPage />)
  return withSuspense(<FlashcardV1DetailPage />)
}
