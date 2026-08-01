import CalculatorTopicList from "../pages/List";
import CalculatorTopicDetail from "../pages/Detail";

export class CalculatorRoute {
    static moduleRoute = "/calculators"
    static initialRoute = CalculatorRoute.moduleRoute + "/"
    static detailRoute = CalculatorRoute.moduleRoute + "/:id"
}

export const calculatorRoutes = [
    { path: CalculatorRoute.initialRoute, element: <CalculatorTopicList /> },
    { path: CalculatorRoute.detailRoute, element: <CalculatorTopicDetail /> },
];
