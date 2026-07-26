import { Suspense } from 'react';
import lazyWithRetry from '@utils/lazyWithRetry';
const lazy = lazyWithRetry;
import PageLoader from '@components/PageLoader';

const CategoryListPage = lazy(() => import('../v2/pages/CategoryList'));
const DiagnosticQuizDetail = lazy(() => import('../v1/pages/Detail'));

const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader text="Loading..." />}>
        {Component}
    </Suspense>
);

export class DiagnosticQuizRoute {
    static moduleRoute = "/diagnostic-quiz"
    static initialRoute = DiagnosticQuizRoute.moduleRoute + "/"
    static detailRoute = DiagnosticQuizRoute.moduleRoute + "/:id"
}

export const diagnosticQuizRoutes = [
    { path: DiagnosticQuizRoute.initialRoute, element: withSuspense(<CategoryListPage />) },
    { path: DiagnosticQuizRoute.detailRoute, element: withSuspense(<DiagnosticQuizDetail />) },
];
