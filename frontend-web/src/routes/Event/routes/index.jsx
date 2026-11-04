import EventListPage from '../v2/pages/List'

export class EventRoute {
  static moduleRoute = '/events'
  static listRoute = EventRoute.moduleRoute + '/'
}

// `/events` is served by the V2 page. The V1 implementation stays on disk under
// `../v1/pages` as the archived original and is no longer mounted anywhere.
export const eventRoutes = [
  { path: EventRoute.listRoute, element: <EventListPage /> },
]
