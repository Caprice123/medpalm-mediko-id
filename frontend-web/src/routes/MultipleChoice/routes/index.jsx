import MultipleChoiceTopicList from '../pages/List';
import MultipleChoiceTopicDetail from '../pages/Detail';

export class MultipleChoiceRoute {
    static moduleRoute = "/multiple-choice"
    static initialRoute = MultipleChoiceRoute.moduleRoute
    static detailRoute = MultipleChoiceRoute.moduleRoute + "/:id"
}

export const multipleChoiceRoutes = [
    { path: MultipleChoiceRoute.initialRoute, element: <MultipleChoiceTopicList /> },
    { path: MultipleChoiceRoute.detailRoute, element: <MultipleChoiceTopicDetail /> },
];
