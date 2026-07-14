import { Suspense } from 'react'
import lazyWithRetry from '@utils/lazyWithRetry'
import PageLoader from '@components/PageLoader'

const lazy = lazyWithRetry

const DashboardV2Page = lazy(() => import('../v2'))

const wrap = (Component) => (
  <Suspense fallback={<PageLoader text="Loading..." />}>
    {Component}
  </Suspense>
)

export function DashboardPageRouter() {
  return wrap(<DashboardV2Page />)
}
