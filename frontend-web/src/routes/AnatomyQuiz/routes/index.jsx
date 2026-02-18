import { lazy, Suspense } from 'react';
import PageLoader from '@components/PageLoader';

const AnatomyQuizList = lazy(() => import('../pages/List'));
const AnatomyQuizDetail = lazy(() => import('../pages/Detail'));

export class AnatomyQuizRoute {
    static moduleRoute = "/anatomy-quiz"
    static initialRoute = AnatomyQuizRoute.moduleRoute + "/"
    static detailRoute = AnatomyQuizRoute.moduleRoute + "/:id"
}

export const anatomyQuizRoutes = [
    { path: AnatomyQuizRoute.initialRoute, element: <AnatomyQuizList /> },
    { path: AnatomyQuizRoute.detailRoute, element: <AnatomyQuizDetail /> },
];
