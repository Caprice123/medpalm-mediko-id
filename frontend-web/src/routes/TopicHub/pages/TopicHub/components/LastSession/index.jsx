import {
  LastSessionSection, SectionLabel, LastSessionCard, LastSessionIcon,
  LastSessionText, LastSessionName, LastSessionMeta, LastSessionArrow,
} from './LastSession.styles'

export default function LastSession({ topic, onClick }) {
  if (!topic) return null

  return (
    <LastSessionSection>
      <SectionLabel>Sesi Terakhir</SectionLabel>
      <LastSessionCard onClick={onClick}>
        <LastSessionIcon>{topic.icon || '🕐'}</LastSessionIcon>
        <LastSessionText>
          <LastSessionName>{topic.name}</LastSessionName>
          <LastSessionMeta>Overview topik</LastSessionMeta>
        </LastSessionText>
        <LastSessionArrow>→</LastSessionArrow>
      </LastSessionCard>
    </LastSessionSection>
  )
}
