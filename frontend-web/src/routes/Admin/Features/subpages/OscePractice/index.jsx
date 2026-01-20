import { useState } from 'react'
import OscePracticeSettingsModal from './components/OscePracticeSettingsModal'
import TopicsTab from './subtabs/Topic'
import ObservationsTab from './subtabs/Observation'
import RubricsTab from './subtabs/Rubric'
import {
  Container,
  Header,
  BackButton,
  HeaderContent,
  TitleSection,
  Title,
  Actions,
  ActionButton,
  TabsContainer,
  Tab
} from './OscePractice.styles'

function OscePracticeAdminPage({ onBack }) {
  const [activeTab, setActiveTab] = useState('topics') // 'topics' or 'observations'
  const [isFeatureSettingOpen, setIsFeatureSettingOpen] = useState(false)

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>← Back</BackButton>
        <HeaderContent>
          <TitleSection>
            <Title>Kelola OSCE Practice</Title>
          </TitleSection>
          <Actions>
            <ActionButton secondary onClick={() => setIsFeatureSettingOpen(true)}>
              Pengaturan
            </ActionButton>
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
