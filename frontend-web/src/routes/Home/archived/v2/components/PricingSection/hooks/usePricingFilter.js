import { useState } from 'react'

const FILTERS = [
  { key: 'all', label: 'Semua Paket' },
  { key: 'credits', label: 'Kredit' },
  { key: 'subscription', label: 'Berlangganan' },
  { key: 'hybrid', label: 'Paket Hybrid' },
]

export function usePricingFilter(pricingPlans) {
  const [filter, setFilter] = useState('all')

  const filteredPlans = filter === 'all'
    ? pricingPlans
    : pricingPlans.filter(plan => plan.bundleType === filter)

  const availableBundleTypes = new Set(pricingPlans.map(plan => plan.bundleType))
  const visibleFilters = FILTERS.filter(f => f.key === 'all' || availableBundleTypes.has(f.key))

  return { filter, setFilter, filteredPlans, visibleFilters }
}
