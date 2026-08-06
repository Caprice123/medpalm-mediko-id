import { useDispatch, useSelector } from 'react-redux'
import { swapNodeOrder } from '@store/featureNodes'

export function useSwapNodeOrderModal(node, onClose, onSwapped) {
  const dispatch = useDispatch()
  const { nodes, loading } = useSelector(s => s.featureNodes)

  const options = nodes
    .filter(n => n.id !== node.id)
    .map(n => ({ value: n.id, label: n.name }))

  const handleSwap = (targetId) => {
    dispatch(swapNodeOrder(node.id, targetId, () => {
      onSwapped?.()
      onClose()
    }))
  }

  return { options, handleSwap, isSwapping: loading.isSwappingOrder }
}
