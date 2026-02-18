import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAdminCalculatorTopics,
  fetchAdminCalculatorTopic,
  deleteCalculatorTopic
} from '@store/calculator/adminAction'

export const useCalculator = () => {
  const dispatch = useDispatch()

  // Redux state
  const {
    topics,
    loading
  } = useSelector(state => state.calculator)

  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [calculatorToEdit, setCalculatorToEdit] = useState(null)

  // Fetch calculators on mount
  useEffect(() => {
    dispatch(fetchAdminCalculatorTopics())
  }, [dispatch])

  const handleOpenCreateModal = () => {
    setCalculatorToEdit(null)
    setIsModalOpen(true)
  }

  const handleCalculatorClick = async (calculator) => {
    const fullCalculator = await dispatch(fetchAdminCalculatorTopic(calculator.id))
    setCalculatorToEdit(fullCalculator)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCalculatorToEdit(null)
  }

  const handleModalSuccess = async () => {
    handleCloseModal()
    await dispatch(fetchAdminCalculatorTopics())
  }

  const handleDelete = async (e, calculatorId) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this calculator?')) {
        await dispatch(deleteCalculatorTopic(calculatorId))
        await dispatch(fetchAdminCalculatorTopics())
    }
  }

  return {
    topics,
    loading,
    isModalOpen,
    calculatorToEdit,
    handleOpenCreateModal,
    handleCalculatorClick,
    handleCloseModal,
    handleModalSuccess,
    handleDelete
  }
}
