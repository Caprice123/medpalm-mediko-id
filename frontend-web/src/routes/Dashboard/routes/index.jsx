import { DashboardPageRouter } from './DashboardRouter'

export class DashboardRoute {
  static moduleRoute = '/dashboard'
  static initialRoute = DashboardRoute.moduleRoute
}

export const dashboardRoutes = [
  { path: DashboardRoute.moduleRoute, element: <DashboardPageRouter /> },
]
