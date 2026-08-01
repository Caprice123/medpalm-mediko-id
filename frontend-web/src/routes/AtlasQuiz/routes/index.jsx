import AtlasQuizHome from '../pages/Home'
import TopicDetailPage from '../pages/TopicDetail'
import AtlasModelDetailPage from '../pages/AtlasModelDetail'
import AnatomyQuizDetailPage from '../pages/AnatomyQuizDetail'

export class AtlasQuizRoute {
  static moduleRoute = '/atlas-quiz'
  static homeRoute = AtlasQuizRoute.moduleRoute + '/'
  static detailRoute = AtlasQuizRoute.moduleRoute + '/:slug'
  static atlasModelRoute = AtlasQuizRoute.moduleRoute + '/:slug/atlas/:uniqueId'
  static anatomyQuizRoute = AtlasQuizRoute.moduleRoute + '/:slug/quiz/:uniqueId'
}

export const atlasQuizRoutes = [
  { path: AtlasQuizRoute.homeRoute, element: <AtlasQuizHome /> },
  { path: AtlasQuizRoute.detailRoute, element: <TopicDetailPage /> },
  { path: AtlasQuizRoute.atlasModelRoute, element: <AtlasModelDetailPage /> },
  { path: AtlasQuizRoute.anatomyQuizRoute, element: <AnatomyQuizDetailPage /> },
]
