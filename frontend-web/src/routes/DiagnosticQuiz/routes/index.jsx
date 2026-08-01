import CategoryListPage from '../v2/pages/CategoryList';
import DiagnosticQuizDetail from '../v1/pages/Detail';

export class DiagnosticQuizRoute {
    static moduleRoute = "/diagnostic-quiz"
    static initialRoute = DiagnosticQuizRoute.moduleRoute + "/"
    static detailRoute = DiagnosticQuizRoute.moduleRoute + "/:id"
}

export const diagnosticQuizRoutes = [
    { path: DiagnosticQuizRoute.initialRoute, element: <CategoryListPage /> },
    { path: DiagnosticQuizRoute.detailRoute, element: <DiagnosticQuizDetail /> },
];
