import ChallengeHomePage from '../pages/Home'
import ChallengePage from '../pages/List'
import ChallengeDetailPage from '../pages/Detail'
import ChallengeSessionPage from '../pages/Session'
import ChallengeResultPage from '../pages/Result'

export class ChallengeRoute {
  static moduleRoute = '/challenge'
  static homeRoute = ChallengeRoute.moduleRoute + '/'
  static listRoute = ChallengeRoute.moduleRoute + '/list'
  static detailRoute = (uniqueId) => `${ChallengeRoute.moduleRoute}/${uniqueId}`
  static sessionRoute = (uniqueId) => `${ChallengeRoute.moduleRoute}/${uniqueId}/session`
  static resultRoute = (uniqueId) => `${ChallengeRoute.moduleRoute}/${uniqueId}/result`
}

export const challengeRoutes = [
  { path: ChallengeRoute.homeRoute, element: <ChallengeHomePage /> },
  { path: ChallengeRoute.listRoute, element: <ChallengePage /> },
  { path: `${ChallengeRoute.moduleRoute}/:uniqueId`, element: <ChallengeDetailPage /> },
  { path: `${ChallengeRoute.moduleRoute}/:uniqueId/session`, element: <ChallengeSessionPage /> },
  { path: `${ChallengeRoute.moduleRoute}/:uniqueId/result`, element: <ChallengeResultPage /> },
]
