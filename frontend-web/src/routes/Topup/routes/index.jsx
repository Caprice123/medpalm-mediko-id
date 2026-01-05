import { lazy, Suspense } from 'react'
import PageLoader from '@components/PageLoader'

const TopupPage = lazy(() => import('../index'))

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader fullScreen={false} text="Loading Top Up..." />}>
    {Component}
  </Suspense>
)

export class TopupRoute {
  static moduleRoute = '/topup'
  static initialRoute = TopupRoute.moduleRoute
}

export const topupRoutes = [
  { path: TopupRoute.initialRoute, element: withSuspense(<TopupPage />) }
]
