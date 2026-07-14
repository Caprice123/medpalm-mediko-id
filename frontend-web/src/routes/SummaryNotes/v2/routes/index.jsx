import { Suspense } from 'react'
import lazyWithRetry from '@utils/lazyWithRetry'
import PageLoader from '@components/PageLoader'

const lazy = lazyWithRetry
const SummaryNotesV2Page = lazy(() => import('../pages'))

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader text="Loading..." />}>
    {Component}
  </Suspense>
)

export const summaryNotesV2Routes = [
  { path: '/', element: withSuspense(<SummaryNotesV2Page />) },
  { path: '/:id', element: withSuspense(<SummaryNotesV2Page />) },
]
