import styled from 'styled-components'

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

const MEDAL_BG = {
  1: { bg: '#fffbeb', border: '#fde68a' },
  2: { bg: '#f8fafc', border: '#e2e8f0' },
  3: { bg: '#fff7ed', border: '#fed7aa' },
}

const Panel = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
`

const Title = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
`

const RefreshBadge = styled.span`
  font-size: 0.75rem;
  color: #0e7490;
  background: #cffafe;
  padding: 0.2rem 0.625rem;
  border-radius: 999px;
  font-weight: 600;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  margin-bottom: 0.375rem;
  background: ${p => p.$isMe ? '#ecfeff' : (MEDAL_BG[p.$rank]?.bg || 'transparent')};
  border: 1px solid ${p => p.$isMe ? '#a5f3fc' : (MEDAL_BG[p.$rank]?.border || 'transparent')};

  &:last-child { margin-bottom: 0; }
`

const Medal = styled.span`
  font-size: 1rem;
  min-width: 2.25rem;
`

const RankNum = styled.span`
  font-size: 0.875rem;
  font-weight: 800;
  color: #9ca3af;
  min-width: 2.25rem;
`

const Name = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 0.875rem;
  color: ${p => p.$isMe ? '#0e7490' : '#374151'};
  font-weight: ${p => p.$isMe ? 700 : 500};
  padding: 0 0.625rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Score = styled.span`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
`

const Empty = styled.div`
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
  padding: 1.5rem 0;
`

export default function ChallengeLeaderboard({ entries = [], loading = false, countdown = null, badgesDisbursed = false }) {
  return (
    <Panel>
      <Header>
        <Title>Leaderboard · {entries.length} peserta</Title>
        {!badgesDisbursed && countdown !== null && (
          <RefreshBadge>Refresh dalam {countdown}s</RefreshBadge>
        )}
      </Header>

      {loading ? (
        <Empty>Memuat leaderboard...</Empty>
      ) : entries.length === 0 ? (
        <Empty>Belum ada peserta yang menyelesaikan challenge ini.</Empty>
      ) : (
        entries.map(entry => (
          <Row key={entry.rank} $isMe={entry.isMe} $rank={entry.rank}>
            {MEDALS[entry.rank]
              ? <Medal>{MEDALS[entry.rank]}</Medal>
              : <RankNum>#{entry.rank}</RankNum>}
            <Name $isMe={entry.isMe}>
              {entry.userName}{entry.isMe && ' (Kamu)'}
            </Name>
            <Score>{entry.score?.toFixed(0)} pts</Score>
          </Row>
        ))
      )}
    </Panel>
  )
}
