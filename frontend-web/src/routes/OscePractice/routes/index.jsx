import { Navigate } from 'react-router-dom'
import Hub from '../v2/pages/Hub'
import Station from '../v2/pages/Station'
import Debrief from '../v2/pages/Debrief'

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

// `/osce-practice` is served by the V2 board throughout. The V1 implementation stays on disk
// under `../v1/pages` as the archived original and is no longer mounted anywhere.
//
// Two of V1's five pages survive only as redirects, because V2 folded them into the board:
// picking a station is now the board's right-hand panel, and the microphone/speech-to-text
// preparation screen is now a gate the board raises in place. Existing links still resolve —
// they land on the board, where the same session is waiting in the rail.
export const oscePracticeRoutes = [
  { path: OscePracticeRoute.initialRoute, element: <Hub /> },
  { path: OscePracticeRoute.topicsRoute, element: <Navigate to={OscePracticeRoute.moduleRoute} replace /> },
  { path: OscePracticeRoute.sessionPreparationRoute, element: <Navigate to={OscePracticeRoute.moduleRoute} replace /> },
  { path: OscePracticeRoute.sessionResultRoute, element: <Debrief /> },
]

// The station runs outside the app shell, mounted beside AppLayout rather than inside it.
//
// It is the product's only timed, irreversible surface. The shell's sidebar and top bar cost
// it the room its three work areas need, and they offer a one-click exit to another feature
// while a clock the student cannot pause keeps running. Leaving a station should be a
// deliberate act, so the rail carries its own way back instead.
//
// Everything above it in the tree is unchanged: it still sits under PrivateRoute and
// ProfileGuard, so the route is exactly as protected as the rest of the feature.
export const oscePracticeStationRoutes = [
  { path: OscePracticeRoute.sessionPracticeRoute, element: <Station /> },
]
