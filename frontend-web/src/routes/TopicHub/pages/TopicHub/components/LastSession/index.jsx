import { PiArrowRight } from 'react-icons/pi'
import {
  LastSessionSection, SectionLabel, LastSessionCard,
  LastSessionText, LastSessionName, LastSessionMeta, LastSessionArrow,
} from './LastSession.styles'

export default function LastSession({ topic, onClick }) {
  if (!topic) return null

  return (
    <LastSessionSection>
      <SectionLabel>Sesi Terakhir</SectionLabel>
      <LastSessionCard onClick={onClick}>
        <LastSessionText>
          <LastSessionName>{topic.name}</LastSessionName>
          <LastSessionMeta>Overview topik</LastSessionMeta>
        </LastSessionText>
        <LastSessionArrow><PiArrowRight size={18} /></LastSessionArrow>
      </LastSessionCard>
    </LastSessionSection>
  )
}
