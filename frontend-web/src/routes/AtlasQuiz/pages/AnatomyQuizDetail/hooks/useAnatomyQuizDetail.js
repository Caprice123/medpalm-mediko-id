import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAtlasQuizAnatomyQuizDetail, fetchUserContentRelations } from '@store/atlasQuiz/userAction'
import { actions } from '@store/atlasQuiz/reducer'
import { canUseFeature } from '../utils/labels'

const { setAnatomyQuizDetail } = actions

export function useAnatomyQuizDetail(slug, uniqueId) {
  const dispatch = useDispatch()
  const { anatomyQuizDetail: detail, loading } = useSelector(s => s.atlasQuiz)
  const features = useSelector(s => s.feature.features)
  const userStatus = useSelector(s => s.pricing.userStatus)
  const isLoading = loading.isFetchingAnatomyQuizDetail
  const atlasAccessible = canUseFeature('atlas', features, userStatus)

  const [linkedAtlasModels, setLinkedAtlasModels] = useState([])
  const [prevQuiz, setPrevQuiz] = useState(null)
  const [nextQuiz, setNextQuiz] = useState(null)

  useEffect(() => {
    dispatch(setAnatomyQuizDetail(null))
    dispatch(fetchAtlasQuizAnatomyQuizDetail(slug, uniqueId))
  }, [dispatch, slug, uniqueId])

  useEffect(() => {
    if (!detail) return
    setPrevQuiz(null)
    setNextQuiz(null)
    setLinkedAtlasModels([])
  }, [detail?.quiz?.uniqueId])

  useEffect(() => {
    if (!detail) return
    const id = detail.quiz.uniqueId

    if (atlasAccessible) {
      dispatch(fetchUserContentRelations({ sourceType: 'anatomy_quiz', sourceUniqueId: id, targetType: 'atlas_model', relationType: 'feature_relation' }))
        .then(links => setLinkedAtlasModels(links))
    }

    dispatch(fetchUserContentRelations({ sourceType: 'anatomy_quiz', sourceUniqueId: id, targetType: 'anatomy_quiz' }))
      .then(links => {
        setPrevQuiz(links.find(l => l.relationType === 'prev') ?? null)
        setNextQuiz(links.find(l => l.relationType === 'next') ?? null)
      })
  }, [dispatch, detail?.quiz?.uniqueId, atlasAccessible])

  const allAtlasModels = linkedAtlasModels.map(item => ({
    uniqueId: item.linkedUniqueId,
    title: item.linkedTitle,
    description: item.description,
    moduleName: null,
  }))

  return {
    detail,
    isLoading,
    allAtlasModels,
    prevQuiz,
    nextQuiz,
  }
}
