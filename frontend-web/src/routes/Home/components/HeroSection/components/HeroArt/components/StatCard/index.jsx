import { CardRoot, IconChip, Value, Label } from './StatCard.styles'
import { useCountUp } from '@hooks/useCountUp'

// One floating figure over the hero art. `count` arrives as `null` until the
// stats request lands, which is also what holds the counter at zero.
function StatCard({ icon, count, label, background, color, left, top }) {
  const value = useCountUp(count)

  return (
    <CardRoot $left={left} $top={top}>
      <IconChip $background={background} $color={color} aria-hidden="true">
        {icon}
      </IconChip>
      <div>
        <Value>{value.toLocaleString('id-ID')}</Value>
        <Label>{label}</Label>
      </div>
    </CardRoot>
  )
}

export default StatCard
