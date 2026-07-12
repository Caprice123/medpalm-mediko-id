import { Suspense } from 'react'
import lazyWithRetry from '@utils/lazyWithRetry'
import PageLoader from '@components/PageLoader'
import { getUserData } from '@utils/authToken'

const lazy = lazyWithRetry

const FlashcardV1ListPage   = lazy(() => import('../v1/pages/List'))
const FlashcardV1DetailPage = lazy(() => import('../v1/pages/Detail'))
const FlashcardV2ListPage   = lazy(() => import('../v2/pages/List'))
const FlashcardV2DetailPage = lazy(() => import('../v2/pages/Detail'))
const FlashcardV2ReviewPage = lazy(() => import('../v2/pages/Review'))

const wrap = (Component) => (
  <Suspense fallback={<PageLoader text="Loading..." />}>
    {Component}
  </Suspense>
)

export function FlashcardListRouter() {
  const user = getUserData()
  return user?.role === 'user'
    ? wrap(<FlashcardV1ListPage />)
    : wrap(<FlashcardV2ListPage />)
}

export function FlashcardDetailRouter() {
  const user = getUserData()
  return user?.role === 'user'
    ? wrap(<FlashcardV1DetailPage />)
    : wrap(<FlashcardV2DetailPage />)
}

export function FlashcardReviewRouter() {
  return wrap(<FlashcardV2ReviewPage />)
}
