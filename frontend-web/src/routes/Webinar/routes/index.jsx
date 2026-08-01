import WebinarPage from '../pages/List'

export class WebinarRoute {
  static moduleRoute = '/webinar'
  static listRoute = WebinarRoute.moduleRoute + '/'
}

export const webinarRoutes = [
  { path: WebinarRoute.listRoute, element: <WebinarPage /> },
]
