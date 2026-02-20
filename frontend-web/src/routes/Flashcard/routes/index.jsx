import { lazy, Suspense } from 'react';
import PageLoader from '@components/PageLoader';

const FlashcardListPage = lazy(() => import('../pages/List'));
const FlashcardDetailPage = lazy(() => import('../pages/Detail'));

const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader text="Loading..." />}>
        {Component}
    </Suspense>
);

export class FlashcardRoute {
    static moduleRoute = "/flashcards"
    static initialRoute = FlashcardRoute.moduleRoute
    static detailRoute = FlashcardRoute.moduleRoute + "/:id"
}

export const flashcardRoutes = [
    { path: FlashcardRoute.initialRoute, element: withSuspense(<FlashcardListPage />) },
    { path: FlashcardRoute.detailRoute, element: withSuspense(<FlashcardDetailPage />) },
];
