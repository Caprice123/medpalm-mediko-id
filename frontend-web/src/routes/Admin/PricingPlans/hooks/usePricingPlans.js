import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAllPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  togglePricingPlanStatus,
} from '@store/pricing/adminAction'

export const usePricingPlans = () => {
  const dispatch = useDispatch()
  const plans = useSelector(state => state.pricing.plans)
  const loading = useSelector(state => state.pricing.loading.isPlansLoading)
  const error = useSelector(state => state.pricing.error)

  const createPlan = async (formData) => {
    await dispatch(createPricingPlan(formData))
  }

  const updatePlan = async (id, formData) => {
    await dispatch(updatePricingPlan(id, formData))
  }

  const toggleStatus = async (plan) => {
    await dispatch(togglePricingPlanStatus(plan.id))
  }

  const fetchPlans = (params) => {
    dispatch(fetchAllPricingPlans(params))
  }

  return {
    plans,
    loading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    toggleStatus,
  }
}
