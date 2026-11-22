import { Navigate, generatePath, useParams } from 'react-router-dom'
import SkripsiListV1 from '../v1/pages/List'
import SkripsiEditorV1 from '../v1/pages/Editor'
import SkripsiListV2 from '../v2/pages/List'
import SkripsiCreateV2 from '../v2/pages/Create'
import SkripsiEditorV2 from '../v2/pages/Editor'
import { isSkripsiV2Host } from '../utils/skripsiHost'
import { SkripsiRoute, PblBuilderRoute } from './index'

// ---- V1 paths (/sets) -------------------------------------------------
// On a V1 host these render V1, exactly as before. On a V2 host they are an
// old link: send it to the same place under /pbl.

export function SkripsiListRouter() {
  if (isSkripsiV2Host()) return <Navigate to={PblBuilderRoute.moduleRoute} replace />
  return <SkripsiListV1 />
}

export function SkripsiEditorRouter() {
  const { setId } = useParams()

  if (isSkripsiV2Host()) {
    return <Navigate to={generatePath(PblBuilderRoute.editorRoute, { setId })} replace />
  }

  return <SkripsiEditorV1 />
}

// ---- V2 paths (/pbl) --------------------------------------------------
// The PBL Case Builder. A V1 host has no V2 pages to show, so these fall back
// to the V1 list rather than rendering nothing.

export function PblListRouter() {
  if (!isSkripsiV2Host()) return <Navigate to={SkripsiRoute.moduleRoute} replace />
  return <SkripsiListV2 />
}

export function PblCreateRouter() {
  if (!isSkripsiV2Host()) return <Navigate to={SkripsiRoute.moduleRoute} replace />
  return <SkripsiCreateV2 />
}

export function PblEditorRouter() {
  const { setId } = useParams()

  if (!isSkripsiV2Host()) {
    return <Navigate to={generatePath(SkripsiRoute.editorRoute, { setId })} replace />
  }

  return <SkripsiEditorV2 />
}
