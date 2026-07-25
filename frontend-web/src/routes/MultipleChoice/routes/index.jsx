import { Suspense } from 'react';
import lazyWithRetry from '@utils/lazyWithRetry';
const lazy = lazyWithRetry;
import PageLoader from '@components/PageLoader';

const BankSoalPage = lazy(() => import('../v2/pages/TopicList'));

const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader text="Loading..." />}>
        {Component}
    </Suspense>
);

export class MultipleChoiceRoute {
    static moduleRoute = "/multiple-choice"
    static initialRoute = MultipleChoiceRoute.moduleRoute
}

export const multipleChoiceRoutes = [
    { path: MultipleChoiceRoute.initialRoute, element: withSuspense(<BankSoalPage />) },
];
