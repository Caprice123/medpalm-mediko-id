import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAtlasQuizAtlasModelDetail, fetchUserContentRelations } from '@store/atlasQuiz/userAction'
import { actions } from '@store/atlasQuiz/reducer'
import { canUseFeature } from '../utils/labels'

const { setAtlasModelDetail } = actions

export function useAtlasModelDetail(slug, uniqueId) {
  const dispatch = useDispatch()
  const { atlasModelDetail: detail, loading } = useSelector(s => s.atlasQuiz)
  const features = useSelector(s => s.feature.features)
  const userStatus = useSelector(s => s.pricing.userStatus)
  const isLoading = loading.isFetchingAtlasModelDetail
  const anatomyQuizAccessible = canUseFeature('anatomy', features, userStatus)

  const [linkedQuizzes, setLinkedQuizzes] = useState([])
  const [prevModel, setPrevModel] = useState(null)
  const [nextModel, setNextModel] = useState(null)

  useEffect(() => {
    dispatch(setAtlasModelDetail(null))
    setLinkedQuizzes([])
    setPrevModel(null)
    setNextModel(null)
    dispatch(fetchAtlasQuizAtlasModelDetail(slug, uniqueId))
  }, [dispatch, slug, uniqueId])

  useEffect(() => {
    if (!detail) return
    const id = detail.model.uniqueId

    if (anatomyQuizAccessible) {
      dispatch(fetchUserContentRelations({ sourceType: 'atlas_model', sourceUniqueId: id, targetType: 'anatomy_quiz', relationType: 'feature_relation' }))
        .then(links => setLinkedQuizzes(links))
    }

    dispatch(fetchUserContentRelations({ sourceType: 'atlas_model', sourceUniqueId: id, targetType: 'atlas_model' }))
      .then(links => {
        setPrevModel(links.find(l => l.relationType === 'prev') ?? null)
        setNextModel(links.find(l => l.relationType === 'next') ?? null)
      })
  }, [dispatch, detail?.model?.uniqueId, anatomyQuizAccessible])

  const allQuizzes = linkedQuizzes.map(item => ({
    uniqueId: item.linkedUniqueId,
    title: item.linkedTitle,
    difficulty: item.difficulty,
    questionCount: item.questionCount,
    estimatedMinutes: item.estimatedMinutes,
  }))

  return { detail, isLoading, allQuizzes, prevModel, nextModel }
}
