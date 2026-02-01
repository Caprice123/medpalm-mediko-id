import { Badge } from './StatusBadge.styles'

function StatusBadge({ status, ...props }) {
  const getStatusText = () => {
    switch (status) {
      case 'published':
        return 'Published'
      case 'testing':
        return 'Testing'
      case 'draft':
      default:
        return 'Draft'
    }
  }

  return (
    <Badge status={status} {...props}>
      {getStatusText()}
    </Badge>
  )
}

export default StatusBadge
