import { lazy, Suspense } from 'react'
import PageLoader from '@components/PageLoader'

const AtlasList = lazy(() => import('../pages/List'))
const AtlasDetail = lazy(() => import('../pages/Detail'))

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader text="Loading..." />}>
    {Component}
  </Suspense>
)

export class AtlasRoute {
  static moduleRoute = '/atlas'
  static initialRoute = AtlasRoute.moduleRoute + '/'
  static detailRoute = AtlasRoute.moduleRoute + '/:uniqueId'
}

export const atlasRoutes = [
  { path: AtlasRoute.initialRoute, element: withSuspense(<AtlasList />) },
  { path: AtlasRoute.detailRoute, element: withSuspense(<AtlasDetail />) },
]
