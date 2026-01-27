import { lazy, Suspense } from 'react';
import PageLoader from '@components/PageLoader';

const SkripsiList = lazy(() => import('../pages/List'));
const SkripsiEditor = lazy(() => import('../pages/Editor'));

const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader fullScreen={false} text="Loading Skripsi Builder..." />}>
        {Component}
    </Suspense>
);

export class SkripsiRoute {
    static moduleRoute = "/sets"
    static initialRoute = SkripsiRoute.moduleRoute
    static editorRoute = SkripsiRoute.moduleRoute + "/:setId"
}

export const skripsiRoutes = [
    { path: SkripsiRoute.initialRoute, element: withSuspense(<SkripsiList />) },
    { path: SkripsiRoute.editorRoute, element: withSuspense(<SkripsiEditor />) },
]
