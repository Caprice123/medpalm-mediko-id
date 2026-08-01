import EventPage from '../pages/List'

export class EventRoute {
  static moduleRoute = '/events'
  static listRoute = EventRoute.moduleRoute + '/'
}

export const eventRoutes = [
  { path: EventRoute.listRoute, element: <EventPage /> },
]
