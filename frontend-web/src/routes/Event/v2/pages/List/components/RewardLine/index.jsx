import { PiLockKeyOpen, PiCoins } from 'react-icons/pi'
import {
  RewardBlock, RewardRow, RewardName, CreditAmount, Qualifier, DurationPill,
} from './RewardLine.styles'

/**
 * What an event hands out on approval. Shared by the event card and the detail
 * modal, so it lives at page level rather than inside one track.
 *
 * `reward` comes from describeReward() — credits are omitted entirely when the
 * event grants none, which in the live data is every event, so the block must
 * read as complete with the feature row alone.
 */
function RewardLine({ reward }) {
  if (reward.isEmpty) return null

  return (
    <RewardBlock>
      {reward.credits && (
        <RewardRow>
          <PiCoins size={19} aria-hidden="true" />
          <CreditAmount>
            <b>{reward.credits.amount}</b> kredit
          </CreditAmount>
          <Qualifier>{reward.credits.qualifier}</Qualifier>
        </RewardRow>
      )}

      {reward.features.map(feature => (
        <RewardRow key={feature.key}>
          <PiLockKeyOpen size={19} aria-hidden="true" />
          <RewardName>{feature.name}</RewardName>
          {feature.durationDays && <DurationPill>{feature.durationDays} hari</DurationPill>}
        </RewardRow>
      ))}
    </RewardBlock>
  )
}

export default RewardLine
