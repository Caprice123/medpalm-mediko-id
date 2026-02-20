import { lazy, Suspense } from 'react';
import PageLoader from '@components/PageLoader';

const ExerciseListPage = lazy(() => import('../pages/List'));
const ExerciseDetailPage = lazy(() => import('../pages/Detail'));

const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader text="Loading..." />}>
        {Component}
    </Suspense>
);

export class ExerciseRoute {
    static moduleRoute = "/fill-in-the-blank"
    static initialRoute = ExerciseRoute.moduleRoute
    static detailRoute = ExerciseRoute.moduleRoute + "/:id"
}

export const exerciseRoutes = [
    { path: ExerciseRoute.initialRoute, element: withSuspense(<ExerciseListPage />) },
    { path: ExerciseRoute.detailRoute, element: withSuspense(<ExerciseDetailPage />) },
];
