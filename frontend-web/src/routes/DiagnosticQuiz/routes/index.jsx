import { lazy, Suspense } from 'react';
import PageLoader from '@components/PageLoader';

const DiagnosticQuizList = lazy(() => import('../pages/List'));
const DiagnosticQuizDetail = lazy(() => import('../pages/Detail'));

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
    { path: DiagnosticQuizRoute.initialRoute, element: withSuspense(<DiagnosticQuizList />) },
    { path: DiagnosticQuizRoute.detailRoute, element: withSuspense(<DiagnosticQuizDetail />) },
];
