import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchExerciseTopics } from '@store/exercise/action'
import { fetchTags } from '@store/tags/action'
import { actions as tagActions } from '@store/tags/reducer'

export const useExerciseList = () => {
  const dispatch = useDispatch()

  // Fetch topics and tags when component mounts
  useEffect(() => {
    dispatch(fetchExerciseTopics())
    dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["topic", "department", "university", "semester"]}))
    dispatch(fetchTags())
  }, [dispatch])
}
