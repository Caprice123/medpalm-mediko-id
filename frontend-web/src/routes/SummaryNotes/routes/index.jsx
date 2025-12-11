import SummaryNotesList from '../pages/List';
import SummaryNotesDetail from '../pages/Detail';

export class SummaryNotesRoute {
    static moduleRoute = "/summary-notes"
    static initialRoute = SummaryNotesRoute.moduleRoute + "/"
    static detailRoute = SummaryNotesRoute.moduleRoute + "/:id"
}

export const summaryNotesRoutes = [
    { path: SummaryNotesRoute.initialRoute, element: <SummaryNotesList /> },
    { path: SummaryNotesRoute.detailRoute, element: <SummaryNotesDetail /> },
];
