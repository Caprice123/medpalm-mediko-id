import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAtlasQuizAnatomyQuizDetail } from '@store/atlasQuiz/userAction'
import { actions } from '@store/atlasQuiz/reducer'

const { setAnatomyQuizDetail } = actions

export function useAnatomyQuizDetail(slug, uniqueId) {
  const dispatch = useDispatch()
  const { anatomyQuizDetail: detail, loading } = useSelector(s => s.atlasQuiz)

  useEffect(() => {
    dispatch(setAnatomyQuizDetail(null))
    dispatch(fetchAtlasQuizAnatomyQuizDetail(slug, uniqueId))
  }, [dispatch, slug, uniqueId])

  return {
    detail,
    isLoading: loading.isFetchingAnatomyQuizDetail,
  }
}
