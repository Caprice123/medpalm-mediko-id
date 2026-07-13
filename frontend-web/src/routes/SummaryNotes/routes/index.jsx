import { SummaryNotesListRouter, SummaryNotesDetailRouter } from './SummaryNotesRouter'

export class SummaryNotesRoute {
    static moduleRoute = "/summary-notes"
    static initialRoute = SummaryNotesRoute.moduleRoute + "/"
    static detailRoute = SummaryNotesRoute.moduleRoute + "/:id"
}

export const summaryNotesRoutes = [
    { path: SummaryNotesRoute.initialRoute, element: <SummaryNotesListRouter /> },
    { path: SummaryNotesRoute.detailRoute, element: <SummaryNotesDetailRouter /> },
];
