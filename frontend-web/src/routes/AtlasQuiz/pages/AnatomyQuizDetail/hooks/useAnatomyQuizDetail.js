import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAtlasQuizAnatomyQuizDetail,
  fetchAnatomyQuizRelatedModels,
  fetchAnatomyQuizAdjacent,
} from '@store/atlasQuiz/userAction'
import { actions } from '@store/atlasQuiz/reducer'
import { canUseFeature } from '../utils/labels'

const { setAnatomyQuizDetail, setAnatomyQuizRelatedModels, setAnatomyQuizPrevNext } = actions

export function useAnatomyQuizDetail(slug, uniqueId) {
  const dispatch = useDispatch()
  const anatomyQuizDetail = useSelector(s => s.atlasQuiz.anatomyQuizDetail)
  const relatedModels = useSelector(s => s.atlasQuiz.anatomyQuizRelatedModels)
  const { prev: prevQuiz, next: nextQuiz } = useSelector(s => s.atlasQuiz.anatomyQuizPrevNext)
  const features = useSelector(s => s.feature.features)
  const userStatus = useSelector(s => s.pricing.userStatus)
  const atlasAccessible = canUseFeature('atlas', features, userStatus)

  useEffect(() => {
    dispatch(setAnatomyQuizDetail(null))
    dispatch(setAnatomyQuizRelatedModels([]))
    dispatch(setAnatomyQuizPrevNext({ prev: null, next: null }))
    dispatch(fetchAtlasQuizAnatomyQuizDetail(slug, uniqueId))
  }, [dispatch, slug, uniqueId])

  useEffect(() => {
    if (!anatomyQuizDetail) return
    const id = anatomyQuizDetail.quiz.uniqueId

    if (atlasAccessible) {
      dispatch(fetchAnatomyQuizRelatedModels(id))
    }

    dispatch(fetchAnatomyQuizAdjacent(id))
  }, [dispatch, anatomyQuizDetail?.quiz?.uniqueId, atlasAccessible])

  return {
    anatomyQuizDetail,
    allAtlasModels: relatedModels,
    prevQuiz,
    nextQuiz,
  }
}
