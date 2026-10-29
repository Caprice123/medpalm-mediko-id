import { useState } from 'react'
import { useSelector } from 'react-redux'
import { extractYoutubeId } from '../../../utils/youtube'
import { resolveFeaturePoints } from '../featurePoints'

// Nothing about the tab row is written in code any more.
//
// Which features appear, what each tab is called, the panel's title and
// description and the demo video all come from the feature constants behind
// /api/v1/features, which "Kelola Fitur" owns — so a feature that is added,
// renamed or switched off there changes this section with no deploy. The bullet
// points are the one thing those constants do not carry; they come from
// `home_feature_points` under Pengaturan Global instead.
export function useFeatureTabs() {
  const features = useSelector((state) => state.feature.features)
  // Select the raw string, not the parsed object: a selector that builds a new
  // object every call compares unequal on every store change and re-renders the
  // section for updates that have nothing to do with it.
  const configuredPoints = useSelector((state) => state.constant.constants.home_feature_points)
  const pointsBySessionType = resolveFeaturePoints(configuredPoints)

  // The constants store `is_active` as a string, so the API returns "true".
  const tabs = features
    .filter((feature) => feature.isActive === true || feature.isActive === 'true')
    .map((feature) => ({
      // sessionType is admin-configurable for a couple of features and can come
      // back empty; the name keeps the React key and the lookup unique.
      key: feature.sessionType || feature.name,
      name: feature.name,
      description: feature.description,
      points: pointsBySessionType[feature.sessionType] ?? [],
      videoId: extractYoutubeId(feature.youtubeUrl),
    }))

  const [selectedKey, setSelectedKey] = useState(null)

  // Figma shows the Atlas 3D panel as the opened state. Resolving the active
  // tab by lookup rather than seeding state means the first render already has
  // a panel once the features arrive, with no effect to sync the two.
  const activeTab =
    tabs.find((tab) => tab.key === selectedKey) ??
    tabs.find((tab) => tab.key === 'atlas') ??
    tabs[0] ??
    null

  return { tabs, activeTab, setActiveKey: setSelectedKey }
}
