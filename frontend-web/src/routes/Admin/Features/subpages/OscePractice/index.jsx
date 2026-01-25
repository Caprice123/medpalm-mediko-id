import { useState } from 'react'
import OscePracticeSettingsModal from './components/OscePracticeSettingsModal'
import TopicsTab from './subtabs/Topic'
import ObservationsTab from './subtabs/Observation'
import RubricsTab from './subtabs/Rubric'
import {
  Container,
  Header,
  HeaderContent,
  TitleSection,
  Title,
  Actions,
  TabsContainer,
  Tab
} from './OscePractice.styles'
import Button from '@components/common/Button'

function OscePracticeAdminPage({ onBack }) {
  const [activeTab, setActiveTab] = useState('topics') // 'topics' or 'observations'
  const [isFeatureSettingOpen, setIsFeatureSettingOpen] = useState(false)

  return (
    <Container>
      <Header>
        <Button onClick={onBack}>← Kembali</Button>
        <HeaderContent>
          <TitleSection>
            <Title>Kelola OSCE Practice</Title>
          </TitleSection>
          <Actions>
            <Button secondary onClick={() => setIsFeatureSettingOpen(true)}>
              Pengaturan
            </Button>
          </Actions>
        </HeaderContent>
      </Header>

      <TabsContainer>
        <Tab
          active={activeTab === 'topics'}
          onClick={() => setActiveTab('topics')}
        >
          Topics
        </Tab>
        <Tab
          active={activeTab === 'rubrics'}
          onClick={() => setActiveTab('rubrics')}
        >
          Rubrik
        </Tab>
        <Tab
          active={activeTab === 'observations'}
          onClick={() => setActiveTab('observations')}
        >
          Supporting Observation
        </Tab>
      </TabsContainer>

      {activeTab === 'topics' && <TopicsTab />}
      {activeTab === 'rubrics' && <RubricsTab />}
      {activeTab === 'observations' && <ObservationsTab />}

      {isFeatureSettingOpen && (
        <OscePracticeSettingsModal
          onClose={() => setIsFeatureSettingOpen(false)}
        />
      )}
    </Container>
  )
}

export default OscePracticeAdminPage
