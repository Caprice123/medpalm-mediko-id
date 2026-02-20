import { lazy, Suspense } from 'react';
import PageLoader from '@components/PageLoader';

const AnatomyQuizList = lazy(() => import('../pages/List'));
const AnatomyQuizDetail = lazy(() => import('../pages/Detail'));

const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader text="Loading..." />}>
        {Component}
    </Suspense>
);

export class AnatomyQuizRoute {
    static moduleRoute = "/anatomy-quiz"
    static initialRoute = AnatomyQuizRoute.moduleRoute + "/"
    static detailRoute = AnatomyQuizRoute.moduleRoute + "/:id"
}

export const anatomyQuizRoutes = [
    { path: AnatomyQuizRoute.initialRoute, element: withSuspense(<AnatomyQuizList />) },
    { path: AnatomyQuizRoute.detailRoute, element: withSuspense(<AnatomyQuizDetail />) },
];
