import SkripsiList from '../v2/pages/List';
import SkripsiEditor from '../v2/pages/Editor';

export class SkripsiRoute {
    static moduleRoute = "/sets"
    static initialRoute = SkripsiRoute.moduleRoute
    static editorRoute = SkripsiRoute.moduleRoute + "/:setId"
}

// Both pages are served by V2. The V1 implementations stay on disk under
// `../v1/pages` as the archived originals and are no longer mounted;
// `/api/v1/skripsi` still serves them if either is ever remounted.
export const skripsiRoutes = [
    { path: SkripsiRoute.initialRoute, element: <SkripsiList /> },
    { path: SkripsiRoute.editorRoute, element: <SkripsiEditor /> },
]
