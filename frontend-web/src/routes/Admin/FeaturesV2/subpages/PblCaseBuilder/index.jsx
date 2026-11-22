import { useState } from 'react'
import { FaCog } from 'react-icons/fa'
import Button from '@components/common/Button'
import TemplatesPage from './pages/TemplatesPage'
import SettingsModal from './components/SettingsModal'
import { Container, Header, HeaderLeft, Title } from './PblCaseBuilder.styles'

// The admin side of the PBL Case Builder: the templates a report can be started
// from, plus the feature's own settings.
function PblCaseBuilder({ onBack }) {
  // Modal visibility is the one piece of state that stays local by convention.
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Button variant="secondary" onClick={onBack}>← Kembali</Button>
          <Title>PBL Case Builder</Title>
        </HeaderLeft>

        <Button variant="secondary" onClick={() => setIsSettingsOpen(true)}>
          <FaCog /> Pengaturan Fitur
        </Button>
      </Header>

      <TemplatesPage />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </Container>
  )
}

export default PblCaseBuilder
