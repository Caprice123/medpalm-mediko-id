import { Suspense } from 'react'
import lazyWithRetry from '@utils/lazyWithRetry'
import PageLoader from '@components/PageLoader'

const lazy = lazyWithRetry

const AtlasQuizHome = lazy(() => import('../pages/Home'))
const TopicDetailPage = lazy(() => import('../pages/TopicDetail'))
const AtlasModelDetailPage = lazy(() => import('../pages/AtlasModelDetail'))
const AnatomyQuizDetailPage = lazy(() => import('../pages/AnatomyQuizDetail'))

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader text="Loading..." />}>
    {Component}
  </Suspense>
)

export class AtlasQuizRoute {
  static moduleRoute = '/atlas-quiz'
  static homeRoute = AtlasQuizRoute.moduleRoute + '/'
  static detailRoute = AtlasQuizRoute.moduleRoute + '/:slug'
  static atlasModelRoute = AtlasQuizRoute.moduleRoute + '/:slug/atlas/:uniqueId'
  static anatomyQuizRoute = AtlasQuizRoute.moduleRoute + '/:slug/quiz/:uniqueId'
}

export const atlasQuizRoutes = [
  { path: AtlasQuizRoute.homeRoute, element: withSuspense(<AtlasQuizHome />) },
  { path: AtlasQuizRoute.detailRoute, element: withSuspense(<TopicDetailPage />) },
  { path: AtlasQuizRoute.atlasModelRoute, element: withSuspense(<AtlasModelDetailPage />) },
  { path: AtlasQuizRoute.anatomyQuizRoute, element: withSuspense(<AnatomyQuizDetailPage />) },
]
