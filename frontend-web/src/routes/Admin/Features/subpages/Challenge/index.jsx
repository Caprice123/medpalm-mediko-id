import { useState } from 'react'
import Button from '@components/common/Button'
import ChallengesTab from './subtabs/ChallengesTab'
import ChallengeDetailPage from './subtabs/ChallengeDetailPage'
import ChallengeSettingsModal from './components/ChallengeSettingsModal'
import { Container, Header, HeaderContent, TitleSection, Title, Actions } from './Challenge.styles'

function ChallengeAdminPage({ onBack }) {
  const [selected, setSelected] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  if (selected) {
    return (
      <ChallengeDetailPage
        challenge={selected}
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <Container>
      <Header>
        <Button onClick={onBack}>← Kembali</Button>
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Challenge</Title>
          </TitleSection>
          <Actions>
            <Button variant="secondary" onClick={() => setSettingsOpen(true)}>Pengaturan</Button>
          </Actions>
        </HeaderContent>
      </Header>

      <ChallengesTab onConfigure={setSelected} />

      {settingsOpen && (
        <ChallengeSettingsModal onClose={() => setSettingsOpen(false)} />
      )}
    </Container>
  )
}

export default ChallengeAdminPage
