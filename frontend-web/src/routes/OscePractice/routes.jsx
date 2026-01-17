import { lazy } from 'react'

const OscePracticePage = lazy(() => import('./index'))
const SessionPreparation = lazy(() => import('./pages/SessionPreparation'))
const SessionPractice = lazy(() => import('./pages/SessionPractice'))
const SessionResult = lazy(() => import('./pages/SessionResult'))

export const oscePracticeRoutes = [
  {
    path: '/osce-practice',
    element: <OscePracticePage />
  },
  {
    path: '/osce-practice/session/:sessionId/preparation',
    element: <SessionPreparation />
  },
  {
    path: '/osce-practice/session/:sessionId/practice',
    element: <SessionPractice />
  },
  {
    path: '/osce-practice/session/:sessionId/result',
    element: <SessionResult />
  },
]
