import { lazy, Suspense } from 'react'
import PageLoader from '@components/PageLoader'

const WebinarPage = lazy(() => import('../pages/List'))

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader text="Loading..." />}>
    {Component}
  </Suspense>
)

export class WebinarRoute {
  static moduleRoute = '/webinar'
  static listRoute = WebinarRoute.moduleRoute + '/'
}

export const webinarRoutes = [
  { path: WebinarRoute.listRoute, element: withSuspense(<WebinarPage />) },
]
