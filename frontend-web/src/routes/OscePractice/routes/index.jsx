import SessionHistory from '../pages/SessionHistory'
import TopicSelection from '../pages/TopicSelection'
import SessionPreparation from '../pages/SessionPreparation'
import SessionPractice from '../pages/SessionPractice'
import SessionResult from '../pages/SessionResult'

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
  { path: OscePracticeRoute.initialRoute, element: <SessionHistory /> },
  { path: OscePracticeRoute.topicsRoute, element: <TopicSelection /> },
  { path: OscePracticeRoute.sessionPreparationRoute, element: <SessionPreparation /> },
  { path: OscePracticeRoute.sessionPracticeRoute, element: <SessionPractice /> },
  { path: OscePracticeRoute.sessionResultRoute, element: <SessionResult /> },
]
