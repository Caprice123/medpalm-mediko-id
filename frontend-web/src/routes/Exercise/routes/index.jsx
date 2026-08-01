import ExerciseListPage from '../pages/List';
import ExerciseDetailPage from '../pages/Detail';

export class ExerciseRoute {
    static moduleRoute = "/fill-in-the-blank"
    static initialRoute = ExerciseRoute.moduleRoute
    static detailRoute = ExerciseRoute.moduleRoute + "/:id"
}

export const exerciseRoutes = [
    { path: ExerciseRoute.initialRoute, element: <ExerciseListPage /> },
    { path: ExerciseRoute.detailRoute, element: <ExerciseDetailPage /> },
];
