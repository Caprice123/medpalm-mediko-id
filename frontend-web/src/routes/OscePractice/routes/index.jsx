import { Navigate } from 'react-router-dom'
import Hub from '../v2/pages/Hub'
import Stations from '../v2/pages/Stations'
import Station from '../v2/pages/Station'
import Debrief from '../v2/pages/Debrief'

export class OscePracticeRoute {
  static moduleRoute = '/osce-practice'
  static initialRoute = OscePracticeRoute.moduleRoute
  static stationsRoute = OscePracticeRoute.moduleRoute + '/stations'
  static topicsRoute = OscePracticeRoute.moduleRoute + '/topics'
  static sessionPreparationRoute = OscePracticeRoute.moduleRoute + '/session/:sessionId/preparation'
  static sessionPracticeRoute = OscePracticeRoute.moduleRoute + '/session/:sessionId/practice'
  static sessionResultRoute = OscePracticeRoute.moduleRoute + '/session/:sessionId/result'

  static preparationRoute = (sessionId) => `${OscePracticeRoute.moduleRoute}/session/${sessionId}/preparation`
  static practiceRoute = (sessionId) => `${OscePracticeRoute.moduleRoute}/session/${sessionId}/practice`
  static resultRoute = (sessionId) => `${OscePracticeRoute.moduleRoute}/session/${sessionId}/result`

  // The hub's performance rows link to the catalogue already narrowed, so the topic travels in
  // the URL rather than in the slice: a filtered list of stations is a place you can be sent to,
  // and land on, without the hub having had to prepare the store first.
  static stationsByTopicRoute = (tagId) => `${OscePracticeRoute.stationsRoute}?topic=${tagId}`
}

// `/osce-practice` is served by the V2 pages throughout. The V1 implementation stays on disk
// under `../v1/pages` as the archived original and is no longer mounted anywhere.
//
// V2 opened as a single board that held both the rail and the station catalogue, and V1's
// `/topics` was folded into it as a redirect. The catalogue has since outgrown that: two
// accumulating lists on one page meant every "Muat Lebih Banyak" in the catalogue pushed the
// history panel further down. So picking a station is a page again — and `/topics`, V1's name
// for the same task, now redirects there instead of to the hub.
//
// The microphone/speech-to-text preparation screen stays folded in: it is a gate the page
// raises in place, not a destination, so its old route still lands on the hub.
export const oscePracticeRoutes = [
  { path: OscePracticeRoute.initialRoute, element: <Hub /> },
  { path: OscePracticeRoute.stationsRoute, element: <Stations /> },
  { path: OscePracticeRoute.topicsRoute, element: <Navigate to={OscePracticeRoute.stationsRoute} replace /> },
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
