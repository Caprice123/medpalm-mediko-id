import SkripsiList from '../pages/List'
import SkripsiEditor from '../pages/Editor'

export class SkripsiRoute {
    static moduleRoute = "/skripsi/sets"
    static initialRoute = SkripsiRoute.moduleRoute
    static editorRoute = SkripsiRoute.moduleRoute + "/:setId"
}

export const skripsiRoutes = [
    { path: SkripsiRoute.initialRoute, element: <SkripsiList /> },
    { path: SkripsiRoute.editorRoute, element: <SkripsiEditor /> },
]
