import styled, { keyframes } from 'styled-components'
import Button from '@components/common/Button'

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

const popIn = keyframes`
  0%   { opacity: 0; transform: scale(0.88) translateY(16px); }
  70%  { opacity: 1; transform: scale(1.02) translateY(-2px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease;
`

const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 2rem;
  max-width: 460px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  animation: ${popIn} 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  text-align: center;
`

const BigEmoji = styled.div`
  font-size: 3.5rem;
  line-height: 1;
  margin-bottom: 0.75rem;
`

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.375rem;
`

const RankLine = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #0d9488, #0369a1);
  color: #fff;
  border-radius: 999px;
  padding: 0.375rem 1.25rem;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.25rem 0;
`

const RewardTitle = styled.div`
  font-size: 1.0625rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
`

const RewardDesc = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 0.875rem;
`

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: ${props => props.$completed ? '#d1fae5' : '#fef3c7'};
  color: ${props => props.$completed ? '#065f46' : '#92400e'};
  border-radius: 999px;
  padding: 0.25rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 1rem;
`

const ProofImage = styled.img`
  max-width: 100%;
  border-radius: 10px;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
`

const NoRewardNote = styled.div`
  color: #9ca3af;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`

export default function RewardPopup({ rank, totalParticipants, reward, onClose }) {
  const rankLine = rank
    ? `Peringkat #${rank}${totalParticipants ? ` dari ${totalParticipants} peserta` : ''}`
    : 'Challenge Selesai'

  return (
    <Overlay onClick={onClose}>
      <Card onClick={e => e.stopPropagation()}>
        <BigEmoji>🎉</BigEmoji>
        <Title>Challenge Selesai!</Title>
        <RankLine>{rankLine}</RankLine>

        <Divider />

        {reward ? (
          <>
            <RewardTitle>🎁 {reward.title}</RewardTitle>
            {reward.description && <RewardDesc>{reward.description}</RewardDesc>}
            <StatusBadge $completed={reward.status === 'completed'}>
              {reward.status === 'completed' ? '✓ Reward siap diklaim' : '🕐 Reward sedang dipersiapkan'}
            </StatusBadge>
            {reward.status === 'completed' && reward.proof?.url && (
              <ProofImage src={reward.proof.url} alt="Reward proof" />
            )}
          </>
        ) : (
          <></>
        )}

        <Button variant="primary" onClick={onClose} style={{ width: '100%', marginTop: '0.5rem' }}>
          Oke, Mengerti!
        </Button>
      </Card>
    </Overlay>
  )
}
