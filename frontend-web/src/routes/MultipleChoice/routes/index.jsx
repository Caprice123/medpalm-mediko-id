import { lazy, Suspense } from 'react';
import PageLoader from '@components/PageLoader';

const MultipleChoiceTopicList = lazy(() => import('../pages/List'));
const MultipleChoiceTopicDetail = lazy(() => import('../pages/Detail'));

const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader text="Loading..." />}>
        {Component}
    </Suspense>
);

export class MultipleChoiceRoute {
    static moduleRoute = "/multiple-choice"
    static initialRoute = MultipleChoiceRoute.moduleRoute
    static detailRoute = MultipleChoiceRoute.moduleRoute + "/:id"
}

export const multipleChoiceRoutes = [
    { path: MultipleChoiceRoute.initialRoute, element: withSuspense(<MultipleChoiceTopicList />) },
    { path: MultipleChoiceRoute.detailRoute, element: withSuspense(<MultipleChoiceTopicDetail />) },
];
