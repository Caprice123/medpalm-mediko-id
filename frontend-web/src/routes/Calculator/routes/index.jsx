import { lazy, Suspense } from 'react';
import PageLoader from '@components/PageLoader';

const CalculatorTopicList = lazy(() => import("../pages/List"));
const CalculatorTopicDetail = lazy(() => import("../pages/Detail"));

const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader fullScreen={false} text="Loading Calculators..." />}>
        {Component}
    </Suspense>
);

export class CalculatorRoute {
    static moduleRoute = "/calculators"
    static initialRoute = CalculatorRoute.moduleRoute + "/"
    static detailRoute = CalculatorRoute.moduleRoute + "/:id"
}

export const calculatorRoutes = [
    { path: CalculatorRoute.initialRoute, element: withSuspense(<CalculatorTopicList />) },
    { path: CalculatorRoute.detailRoute, element: withSuspense(<CalculatorTopicDetail />) },
];
