import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchConstants, updateConstants } from '@store/constant/action'
import { actions as constantActions } from '@store/constant/reducer'
import { fetchFeatures } from '@store/feature/userAction'
import { hasTabPermission } from '@utils/permissionUtils'
import {
  CONSTANT_KEYS,
  FEATURE_POINTS_KEY,
  LIST_SECTIONS,
  TEXT_KEYS,
  decodeFeaturePoints,
  decodeList,
  encodeFeaturePoints,
} from '../utils/listSections'

const SECTION_KEYS = Object.keys(LIST_SECTIONS)

const blankText = () => TEXT_KEYS.reduce((all, key) => ({ ...all, [key]: '' }), {})
const blankLists = () =>
  SECTION_KEYS.reduce((all, key) => ({ ...all, [key]: [{ ...LIST_SECTIONS[key].template }] }), {})

// Owned by the page, not by any one section: every section edits part of the
// same constants payload and they are all saved by the single button at the
// bottom, so the form state cannot live inside the section components.
export function useGlobalSettings() {
  const dispatch = useDispatch()
  const [text, setText] = useState(blankText)
  const [lists, setLists] = useState(blankLists)
  const [featurePoints, setFeaturePoints] = useState({})

  useEffect(() => {
    if (!hasTabPermission('globalSettings')) return

    const load = async () => {
      dispatch(constantActions.updateFilter({ key: 'keys', value: CONSTANT_KEYS }))
      const constants = (await dispatch(fetchConstants())) || {}

      setText(TEXT_KEYS.reduce((all, key) => ({ ...all, [key]: constants[key] || '' }), {}))
      setLists(
        SECTION_KEYS.reduce(
          (all, key) => ({
            ...all,
            [key]: decodeList(key, constants[LIST_SECTIONS[key].constantKey]),
          }),
          {},
        ),
      )
      setFeaturePoints(decodeFeaturePoints(constants[FEATURE_POINTS_KEY]))
    }

    load().catch((err) => console.error('Failed to load global settings:', err))

    // The feature section renders one row per feature, so the form needs the
    // same feature list the landing page builds its tabs from.
    dispatch(fetchFeatures())
  }, [dispatch])

  const changeText = (key, value) => setText((prev) => ({ ...prev, [key]: value }))

  const changeFeaturePoints = (sessionType, value) =>
    setFeaturePoints((prev) => ({ ...prev, [sessionType]: value }))

  const changeItem = (sectionKey, index, field, value) =>
    setLists((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }))

  const addItem = (sectionKey) =>
    setLists((prev) => ({
      ...prev,
      [sectionKey]: [...prev[sectionKey], { ...LIST_SECTIONS[sectionKey].template }],
    }))

  const removeItem = (sectionKey, index) =>
    setLists((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].filter((_, i) => i !== index),
    }))

  const save = async () => {
    const payload = { ...text, [FEATURE_POINTS_KEY]: encodeFeaturePoints(featurePoints) }
    SECTION_KEYS.forEach((key) => {
      payload[LIST_SECTIONS[key].constantKey] = JSON.stringify(lists[key])
    })

    try {
      await dispatch(updateConstants(payload, () => {}))
      alert('Pengaturan berhasil disimpan!')
    } catch (err) {
      console.error('Failed to save global settings:', err)
      alert('Gagal menyimpan pengaturan.')
    }
  }

  // Bundles one list's state and its three handlers so the page can hand a
  // section everything it needs in a single spread.
  const listProps = (sectionKey) => ({
    items: lists[sectionKey],
    onChange: (index, field, value) => changeItem(sectionKey, index, field, value),
    onAdd: () => addItem(sectionKey),
    onRemove: (index) => removeItem(sectionKey, index),
  })

  return { text, listProps, changeText, featurePoints, changeFeaturePoints, save }
}
