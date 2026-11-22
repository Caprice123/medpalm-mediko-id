import {
    SkripsiListRouter,
    SkripsiEditorRouter,
    PblListRouter,
    PblCreateRouter,
    PblEditorRouter,
} from './SkripsiRouter';
import { isSkripsiV2Host } from '../utils/skripsiHost';

// V1's paths. Untouched: medpal.id still serves the V1 pages from here.
export class SkripsiRoute {
    static moduleRoute = "/sets"
    static initialRoute = SkripsiRoute.moduleRoute
    static editorRoute = SkripsiRoute.moduleRoute + "/:setId"
}

// V2 is the PBL Case Builder and lives under its own path, so renaming it
// never moves V1 out from under the hosts still serving it.
export class PblBuilderRoute {
    static moduleRoute = "/pbl"
    static initialRoute = PblBuilderRoute.moduleRoute
    // A static segment, so it outranks the :setId pattern below and "baru" is
    // never read as a set id.
    static createRoute = PblBuilderRoute.moduleRoute + "/baru"
    static editorRoute = PblBuilderRoute.moduleRoute + "/:setId"
}

// Where "Skripsi Builder" points from outside the feature (the sidebar, the
// dashboard): the V1 list on a V1 host, the PBL builder everywhere else.
export const skripsiBuilderHomeRoute = () => (
    isSkripsiV2Host() ? PblBuilderRoute.moduleRoute : SkripsiRoute.moduleRoute
)

// Which version renders depends on the host — see SkripsiRouter. Each version's
// paths redirect to the other version's when opened on the wrong host, so an
// old link keeps working either way.
export const skripsiRoutes = [
    { path: SkripsiRoute.initialRoute, element: <SkripsiListRouter /> },
    { path: SkripsiRoute.editorRoute, element: <SkripsiEditorRouter /> },

    { path: PblBuilderRoute.initialRoute, element: <PblListRouter /> },
    { path: PblBuilderRoute.createRoute, element: <PblCreateRouter /> },
    { path: PblBuilderRoute.editorRoute, element: <PblEditorRouter /> },
]
