import WebinarListPage from '../v2/pages/List'

export class WebinarRoute {
  static moduleRoute = '/webinar'
  static listRoute = WebinarRoute.moduleRoute + '/'
}

// `/webinar` is served by the V2 page. The V1 implementation stays on disk under
// `../v1/pages` as the archived original and is no longer mounted anywhere.
export const webinarRoutes = [
  { path: WebinarRoute.listRoute, element: <WebinarListPage /> },
]
