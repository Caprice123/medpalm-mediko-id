import { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchOscePerformance } from '@store/oscePractice/userAction'
import { OscePracticeRoute } from '@routes/OscePractice/routes'

// The rows are a filter, not a statistic. Clicking a topic opens the catalogue already narrowed
// to it, which is how a student gets from "aku lemah di Psikiatri" to a station worth opening
// without reading forty case titles.
//
// The topic travels in the URL rather than in the slice. It used to be a dispatch, because the
// list it filtered was the panel beside these rows; now that the catalogue is its own page, a
// narrowed list is somewhere you navigate to — which also means the filtered view survives a
// refresh and can be linked.
//
// Performance itself still comes from the engine slice's action: the endpoint and its two
// sources (counters or derived) are unchanged. It arrives sorted strongest first.
export const usePerformanceRows = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isChartOpen, setIsChartOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchOscePerformance())
  }, [dispatch])

  const selectTopic = useCallback((tagId) => {
    navigate(OscePracticeRoute.stationsByTopicRoute(tagId))
  }, [navigate])

  const openChart = useCallback(() => setIsChartOpen(true), [])
  const closeChart = useCallback(() => setIsChartOpen(false), [])

  return { selectTopic, isChartOpen, openChart, closeChart }
}
