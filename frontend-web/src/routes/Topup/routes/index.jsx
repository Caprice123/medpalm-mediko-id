import TopupPage from '../pages'

export class TopupRoute {
  static moduleRoute = '/topup'
  static initialRoute = TopupRoute.moduleRoute
}

export const topupRoutes = [
  { path: TopupRoute.initialRoute, element: <TopupPage /> }
]
