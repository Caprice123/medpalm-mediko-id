import { useState } from 'react'

export const usePlanModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    bundle_type: 'credits',
    credits_included: '',
    duration_days: '',
    price: '',
    is_active: true,
    is_popular: false,
    discount: 0,
    order: 0,
    allowed_payment_method: 'xendit'
  })

  const openModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan)
      // Parse allowed_payment_methods from string to array
      let allowedMethod = plan.allowed_payment_method || 'xendit'

      setFormData({
        name: plan.name,
        code: plan.code || '',
        description: plan.description || '',
        bundle_type: plan.bundle_type || plan.bundleType || 'credits',
        credits_included: plan.credits_included || plan.creditsIncluded || '',
        duration_days: plan.duration_days || plan.durationDays || '',
        price: plan.price,
        is_active: plan.is_active !== undefined ? plan.is_active : plan.isActive,
        is_popular: plan.is_popular !== undefined ? plan.is_popular : plan.isPopular,
        discount: plan.discount || 0,
        order: plan.order || 0,
        allowed_payment_method: allowedMethod
      })
    } else {
      setEditingPlan(null)
      setFormData({
        name: '',
        code: '',
        description: '',
        bundle_type: 'credits',
        credits_included: '',
        duration_days: '',
        price: '',
        is_active: true,
        is_popular: false,
        discount: 0,
        order: 0,
        allowed_payment_method: 'xendit'
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingPlan(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return {
    isModalOpen,
    editingPlan,
    formData,
    openModal,
    closeModal,
    handleChange
  }
}
