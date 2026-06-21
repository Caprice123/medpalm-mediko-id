import { lazy, Suspense } from 'react'
import PageLoader from '@components/PageLoader'

const ChallengePage = lazy(() => import('../pages/List'))
const ChallengeDetailPage = lazy(() => import('../pages/Detail'))
const ChallengeSessionPage = lazy(() => import('../pages/Session'))
const ChallengeResultPage = lazy(() => import('../pages/Result'))

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader text="Loading..." />}>
    {Component}
  </Suspense>
)

export class ChallengeRoute {
  static moduleRoute = '/challenge'
  static listRoute = ChallengeRoute.moduleRoute + '/'
  static detailRoute = (uniqueId) => `${ChallengeRoute.moduleRoute}/${uniqueId}`
  static sessionRoute = (uniqueId) => `${ChallengeRoute.moduleRoute}/${uniqueId}/session`
  static resultRoute = (uniqueId) => `${ChallengeRoute.moduleRoute}/${uniqueId}/result`
}

export const challengeRoutes = [
  { path: ChallengeRoute.listRoute, element: withSuspense(<ChallengePage />) },
  { path: `${ChallengeRoute.moduleRoute}/:uniqueId`, element: withSuspense(<ChallengeDetailPage />) },
  { path: `${ChallengeRoute.moduleRoute}/:uniqueId/session`, element: withSuspense(<ChallengeSessionPage />) },
  { path: `${ChallengeRoute.moduleRoute}/:uniqueId/result`, element: withSuspense(<ChallengeResultPage />) },
]
