import { lazy, Suspense } from 'react'
import PageLoader from '@components/PageLoader'

const SessionHistory = lazy(() => import('../pages/SessionHistory'))
const TopicSelection = lazy(() => import('../pages/TopicSelection'))
const SessionPreparation = lazy(() => import('../pages/SessionPreparation'))
const SessionPractice = lazy(() => import('../pages/SessionPractice'))
const SessionResult = lazy(() => import('../pages/SessionResult'))

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader text="Loading..." />}>
    {Component}
  </Suspense>
)

export class OscePracticeRoute {
  static moduleRoute = '/osce-practice'
  static initialRoute = OscePracticeRoute.moduleRoute
  static topicsRoute = OscePracticeRoute.moduleRoute + '/topics'
  static sessionPreparationRoute = OscePracticeRoute.moduleRoute + '/session/:sessionId/preparation'
  static sessionPracticeRoute = OscePracticeRoute.moduleRoute + '/session/:sessionId/practice'
  static sessionResultRoute = OscePracticeRoute.moduleRoute + '/session/:sessionId/result'

  static preparationRoute = (sessionId) => `${OscePracticeRoute.moduleRoute}/session/${sessionId}/preparation`
  static practiceRoute = (sessionId) => `${OscePracticeRoute.moduleRoute}/session/${sessionId}/practice`
  static resultRoute = (sessionId) => `${OscePracticeRoute.moduleRoute}/session/${sessionId}/result`
}

export const oscePracticeRoutes = [
  { path: OscePracticeRoute.initialRoute, element: withSuspense(<SessionHistory />) },
  { path: OscePracticeRoute.topicsRoute, element: withSuspense(<TopicSelection />) },
  { path: OscePracticeRoute.sessionPreparationRoute, element: withSuspense(<SessionPreparation />) },
  { path: OscePracticeRoute.sessionPracticeRoute, element: withSuspense(<SessionPractice />) },
  { path: OscePracticeRoute.sessionResultRoute, element: withSuspense(<SessionResult />) },
]
