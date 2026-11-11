import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { bootstrapSkripsi, loadMoreSets, deleteSet, reloadSets } from '@store/skripsi/v2'

// State owned by the list page itself: the one bootstrap read, and which set is
// pending deletion.
export const useSetList = () => {
  const dispatch = useDispatch()
  const [pendingDeletion, setPendingDeletion] = useState(null)

  // Config and the first page of sets in one request.
  useEffect(() => {
    dispatch(bootstrapSkripsi())
  }, [dispatch])

  const confirmDeletion = async () => {
    if (!pendingDeletion) return

    await dispatch(deleteSet(pendingDeletion.uniqueId))
    setPendingDeletion(null)

    // Deleting shifts every later set up a place, so an accumulated list
    // cannot just drop the card and keep its page counter.
    dispatch(reloadSets())
  }

  return {
    handleLoadMore: () => dispatch(loadMoreSets()),
    pendingDeletion,
    requestDeletion: setPendingDeletion,
    cancelDeletion: () => setPendingDeletion(null),
    confirmDeletion,
  }
}
