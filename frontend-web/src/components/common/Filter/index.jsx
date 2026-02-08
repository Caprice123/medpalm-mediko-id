import {
  FilterContainer,
  FilterHeader,
  FilterTitle,
  ClearButton,
  FilterGrid,
  FilterGroup,
  FilterLabel
} from './Filter.styles'

/**
 * Reusable Filter component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Filter inputs/controls
 * @param {Function} props.onClear - Clear all filters callback
 * @param {string} props.title - Filter section title
 * @param {boolean} props.showClear - Show clear button
 * @param {string} props.className - Additional CSS class
 */
function Filter({
  children,
  className = ''
}) {
  return (
    <FilterContainer className={className}>
      <FilterGrid>
        {children}
      </FilterGrid>
    </FilterContainer>
  )
}

// Export FilterGroup and FilterLabel for use in parent components
Filter.Group = FilterGroup
Filter.Label = FilterLabel

export default Filter
