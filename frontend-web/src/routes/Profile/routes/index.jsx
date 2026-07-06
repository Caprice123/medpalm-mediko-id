import { Suspense } from 'react'
import lazyWithRetry from '@utils/lazyWithRetry'
import PageLoader from '@components/PageLoader'

const lazy = lazyWithRetry

const ProfileSetup = lazy(() => import('../pages/Setup'))

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader text="Loading..." />}>
    {Component}
  </Suspense>
)

export class ProfileRoute {
  static setupRoute = '/profile/setup'
}

export const profileRoutes = [
  { path: ProfileRoute.setupRoute, element: withSuspense(<ProfileSetup />) },
]
