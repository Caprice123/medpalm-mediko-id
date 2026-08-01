import BankSoalPage from '../v2/pages/TopicList';

export class MultipleChoiceRoute {
    static moduleRoute = "/multiple-choice"
    static initialRoute = MultipleChoiceRoute.moduleRoute
}

export const multipleChoiceRoutes = [
    { path: MultipleChoiceRoute.initialRoute, element: <BankSoalPage /> },
];
