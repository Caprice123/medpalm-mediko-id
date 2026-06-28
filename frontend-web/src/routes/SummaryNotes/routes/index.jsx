import { Suspense } from 'react';
import lazyWithRetry from '@utils/lazyWithRetry';
const lazy = lazyWithRetry;
import PageLoader from '@components/PageLoader';

const SummaryNotesList = lazy(() => import('../pages/List'));
const SummaryNotesDetail = lazy(() => import('../pages/Detail'));

const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader fullScreen={false} text="Loading Summary Notes..." />}>
        {Component}
    </Suspense>
);

export class SummaryNotesRoute {
    static moduleRoute = "/summary-notes"
    static initialRoute = SummaryNotesRoute.moduleRoute + "/"
    static detailRoute = SummaryNotesRoute.moduleRoute + "/:id"
}

export const summaryNotesRoutes = [
    { path: SummaryNotesRoute.initialRoute, element: withSuspense(<SummaryNotesList />) },
    { path: SummaryNotesRoute.detailRoute, element: withSuspense(<SummaryNotesDetail />) },
];
