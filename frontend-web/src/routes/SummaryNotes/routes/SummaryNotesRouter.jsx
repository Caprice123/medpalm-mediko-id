import { Suspense } from 'react'
import lazyWithRetry from '@utils/lazyWithRetry'
import PageLoader from '@components/PageLoader'
import { getUserData } from '@utils/authToken'

const lazy = lazyWithRetry

const SummaryNotesV1List   = lazy(() => import('../pages/List'))
const SummaryNotesV1Detail = lazy(() => import('../pages/Detail'))
const SummaryNotesV2Page   = lazy(() => import('../v2/pages'))

const wrap = (Component) => (
  <Suspense fallback={<PageLoader text="Loading..." />}>
    {Component}
  </Suspense>
)

export function SummaryNotesListRouter() {
  return wrap(<SummaryNotesV2Page />)
}

export function SummaryNotesDetailRouter() {
  return wrap(<SummaryNotesV2Page />)
}
