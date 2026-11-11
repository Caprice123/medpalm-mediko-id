import SkripsiList from '../v2/pages/List';
import SkripsiEditor from '../pages/Editor';

export class SkripsiRoute {
    static moduleRoute = "/sets"
    static initialRoute = SkripsiRoute.moduleRoute
    static editorRoute = SkripsiRoute.moduleRoute + "/:setId"
}

// The list is served by the V2 page; its V1 implementation stays on disk under
// `../v1/pages/List` as the archived original and is no longer mounted. The
// editor is still V1 and reads `/api/v1/skripsi`, so a set opened from the V2
// list keeps working while the V2 editor is built.
export const skripsiRoutes = [
    { path: SkripsiRoute.initialRoute, element: <SkripsiList /> },
    { path: SkripsiRoute.editorRoute, element: <SkripsiEditor /> },
]
