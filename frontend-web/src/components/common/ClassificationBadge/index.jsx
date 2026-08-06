import { PillBadge, SquareBadge, EmptyText } from './ClassificationBadge.styles'

// labels: { value: displayLabel }
// colorMap: { value: { bg, color } } — per-value override, takes priority over bg/color
// bg/color: flat override applied to every value when colorMap has no entry for it
export default function ClassificationBadge({
  value, labels = {}, colorMap = {}, bg, color, variant = 'pill', emptyText = '—', ...props
}) {
  if (!value) return <EmptyText>{emptyText}</EmptyText>

  const override = colorMap[value]
  const Badge = variant === 'square' ? SquareBadge : PillBadge

  return (
    <Badge $bg={override?.bg ?? bg} $color={override?.color ?? color} {...props}>
      {labels[value] ?? value}
    </Badge>
  )
}
