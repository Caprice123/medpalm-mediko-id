import { Suspense } from 'react'
import lazyWithRetry from '@utils/lazyWithRetry'
const lazy = lazyWithRetry
import PageLoader from '@components/PageLoader'

const EventPage = lazy(() => import('../pages/List'))

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader text="Loading..." />}>
    {Component}
  </Suspense>
)

export class EventRoute {
  static moduleRoute = '/events'
  static listRoute = EventRoute.moduleRoute + '/'
}

export const eventRoutes = [
  { path: EventRoute.listRoute, element: withSuspense(<EventPage />) },
]
