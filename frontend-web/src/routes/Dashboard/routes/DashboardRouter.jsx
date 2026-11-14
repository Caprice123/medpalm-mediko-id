import { Navigate } from 'react-router-dom'
import { TopicHubRoute } from '../../TopicHub/routes'
// import DashboardV2Page from '../v2'

// The dashboard is parked: /dashboard now lands on the Topic Hub instead, so
// every existing link to it keeps working. Swap the two lines below to bring
// the dashboard page back.
export function DashboardPageRouter() {
  return <Navigate to={TopicHubRoute.initialRoute} replace />
  // return <DashboardV2Page />
}
