import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAtlasQuizAtlasModelDetail,
  fetchAtlasModelRelatedQuizzes,
  fetchAtlasModelAdjacent,
} from '@store/atlasQuiz/userAction'
import { actions } from '@store/atlasQuiz/reducer'
import { canUseFeature } from '../utils/labels'

const { setAtlasModelDetail, setAtlasModelRelatedQuizzes, setAtlasModelPrevNext } = actions

export function useAtlasModelDetail(slug, uniqueId) {
  const dispatch = useDispatch()
  const atlasModelDetail = useSelector(s => s.atlasQuiz.atlasModelDetail)
  const relatedQuizzes = useSelector(s => s.atlasQuiz.atlasModelRelatedQuizzes)
  const { prev: prevModel, next: nextModel } = useSelector(s => s.atlasQuiz.atlasModelPrevNext)
  const features = useSelector(s => s.feature.features)
  const userStatus = useSelector(s => s.pricing.userStatus)
  const anatomyQuizAccessible = canUseFeature('anatomy', features, userStatus)

  useEffect(() => {
    dispatch(setAtlasModelDetail(null))
    dispatch(setAtlasModelRelatedQuizzes([]))
    dispatch(setAtlasModelPrevNext({ prev: null, next: null }))
    dispatch(fetchAtlasQuizAtlasModelDetail(slug, uniqueId))
  }, [dispatch, slug, uniqueId])

  useEffect(() => {
    if (!atlasModelDetail) return
    const id = atlasModelDetail.model.uniqueId

    if (anatomyQuizAccessible) {
      dispatch(fetchAtlasModelRelatedQuizzes(id))
    }

    dispatch(fetchAtlasModelAdjacent(id))
  }, [dispatch, atlasModelDetail?.model?.uniqueId, anatomyQuizAccessible])

  return { atlasModelDetail, allQuizzes: relatedQuizzes, prevModel, nextModel }
}
