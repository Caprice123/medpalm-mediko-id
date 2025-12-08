import AnatomyQuizList from '../pages/List';
import AnatomyQuizDetail from '../pages/Detail';

export class AnatomyQuizRoute {
    static moduleRoute = "/anatomy-quiz"
    static initialRoute = AnatomyQuizRoute.moduleRoute + "/"
    static detailRoute = AnatomyQuizRoute.moduleRoute + "/:id"
}

export const anatomyQuizRoutes = [
    { path: AnatomyQuizRoute.initialRoute, element: <AnatomyQuizList /> },
    { path: AnatomyQuizRoute.detailRoute, element: <AnatomyQuizDetail /> },
];
