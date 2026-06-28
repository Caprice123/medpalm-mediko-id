import { Suspense } from 'react';
import lazyWithRetry from '@utils/lazyWithRetry';
const lazy = lazyWithRetry;
import PageLoader from '@components/PageLoader';

const SkripsiList = lazy(() => import('../pages/List'));
const SkripsiEditor = lazy(() => import('../pages/Editor'));

const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader text="Loading..." />}>
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
