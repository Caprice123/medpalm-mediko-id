import { Suspense } from 'react'
import lazyWithRetry from '@utils/lazyWithRetry'
import PageLoader from '@components/PageLoader'

const lazy = lazyWithRetry

const FlashcardV1ListPage      = lazy(() => import('../v1/pages/List'))
const FlashcardV1DetailPage    = lazy(() => import('../v1/pages/Detail'))
const FlashcardV2ListPage      = lazy(() => import('../v2/pages/List'))
const FlashcardV2DetailPage    = lazy(() => import('../v2/pages/Detail'))
const FlashcardV2ReviewPage    = lazy(() => import('../v2/pages/Review'))
const FlashcardV2ReviewAllPage = lazy(() => import('../v2/pages/ReviewAll'))
const FlashcardV2ReviewCustomPage = lazy(() => import('../v2/pages/ReviewCustom'))
const FlashcardV2SessionPage = lazy(() => import('../v2/pages/Session'))

const wrap = (Component) => (
  <Suspense fallback={<PageLoader text="Loading..." />}>
    {Component}
  </Suspense>
)

export function FlashcardListRouter() {
  return wrap(<FlashcardV1ListPage />)
}

export function FlashcardDetailRouter() {
  return wrap(<FlashcardV1DetailPage />)
}

export function FlashcardReviewRouter() {
  return wrap(<FlashcardV2ReviewPage />)
}

export function FlashcardReviewAllRouter() {
  return wrap(<FlashcardV2ReviewAllPage />)
}

export function FlashcardReviewCustomRouter() {
  return wrap(<FlashcardV2ReviewCustomPage />)
}

export function FlashcardSessionRouter() {
  return wrap(<FlashcardV2SessionPage />)
}
