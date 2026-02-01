import Button from '@components/common/Button'
import {
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions
} from './EmptyState.styles'

/**
 * Reusable EmptyState component for list pages
 *
 * @param {Object} props
 * @param {string|React.ReactNode} props.icon - Icon to display (emoji or React component)
 * @param {string} props.title - Main message to display
 * @param {string} props.description - Optional subtitle/description
 * @param {string} props.actionLabel - Label for action button
 * @param {Function} props.onAction - Click handler for action button
 * @param {string} props.actionVariant - Button variant ('primary', 'secondary', etc.)
 * @param {React.ReactNode} props.customAction - Custom action component (overrides default button)
 * @param {string} props.className - Additional CSS class
 */
function EmptyState({
  icon = '📭',
  title = 'Tidak ada data ditemukan',
  description,
  actionLabel,
  onAction,
  actionVariant = 'primary',
  customAction,
  className,
  ...rest
}) {
  return (
    <EmptyStateContainer className={className} {...rest}>
      {icon && (
        <EmptyStateIcon>
          {typeof icon === 'string' ? icon : icon}
        </EmptyStateIcon>
      )}

      <EmptyStateTitle>{title}</EmptyStateTitle>

      {description && (
        <EmptyStateDescription>{description}</EmptyStateDescription>
      )}

      {(actionLabel || customAction) && (
        <EmptyStateActions>
          {customAction || (
            <Button
              variant={actionVariant}
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </EmptyStateActions>
      )}
    </EmptyStateContainer>
  )
}

export default EmptyState
