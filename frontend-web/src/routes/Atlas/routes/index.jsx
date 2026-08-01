import AtlasList from '../pages/List'
import AtlasDetail from '../pages/Detail'

export class AtlasRoute {
  static moduleRoute = '/atlas'
  static initialRoute = AtlasRoute.moduleRoute + '/'
  static detailRoute = AtlasRoute.moduleRoute + '/:uniqueId'
}

export const atlasRoutes = [
  { path: AtlasRoute.initialRoute, element: <AtlasList /> },
  { path: AtlasRoute.detailRoute, element: <AtlasDetail /> },
]
