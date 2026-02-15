import { useState, useEffect } from 'react'
import Button from '@components/common/Button'
import {
  PermissionContainer,
  PermissionHeader,
  PermissionTitle,
  PermissionSection,
  SectionLabel,
  CheckboxGroup,
  CheckboxLabel,
  FeatureSubsection,
  FeatureLabel,
  ActionButtons,
  HintText,
  QuickActionBar,
  QuickActionButton
} from './PermissionManager.styles'

// Define available tabs and features (simplified - no CRUD, just access)
const AVAILABLE_TABS = [
  { value: 'features', label: 'Kelola Fitur' },
  { value: 'tags', label: 'Kelola Tag' },
  { value: 'pricingPlans', label: 'Paket Harga' },
  { value: 'transactions', label: 'Transaksi' },
  { value: 'users', label: 'Kelola User' }
]

const AVAILABLE_FEATURES = [
  { value: 'exercise', label: 'Exercise' },
  { value: 'flashcard', label: 'Flashcard' },
  { value: 'calculator', label: 'Calculator' },
  { value: 'anatomy', label: 'Anatomy Quiz' },
  { value: 'mcq', label: 'Multiple Choice' },
  { value: 'chatbot', label: 'Chatbot' },
  { value: 'skripsi', label: 'Skripsi Builder' },
  { value: 'oscePractice', label: 'OSCE Practice' },
  { value: 'summaryNotes', label: 'Summary Notes' }
]

function PermissionManager({ currentPermissions, onSave, onCancel, isLoading }) {
  const [selectedTabs, setSelectedTabs] = useState([])
  const [selectedFeatures, setSelectedFeatures] = useState([])

  // Initialize state from current permissions
  useEffect(() => {
    if (currentPermissions) {
      setSelectedTabs(currentPermissions.tabs || [])

      // Handle both old (object) and new (array) formats
      let features = []
      if (currentPermissions.features) {
        if (Array.isArray(currentPermissions.features)) {
          // New format: array of feature names
          features = currentPermissions.features
        } else {
          // Old format: object with feature names as keys
          // Convert to array by getting keys that have permissions
          features = Object.keys(currentPermissions.features).filter(
            key => currentPermissions.features[key] && currentPermissions.features[key].length > 0
          )
        }
      }
      setSelectedFeatures(features)
    } else {
      // Default permissions for new users
      setSelectedTabs([])
      setSelectedFeatures([])
    }
  }, [currentPermissions])

  const handleTabToggle = (tabValue) => {
    setSelectedTabs(prev => {
      if (prev.includes(tabValue)) {
        return prev.filter(t => t !== tabValue)
      } else {
        return [...prev, tabValue]
      }
    })
  }

  const handleFeatureToggle = (featureValue) => {
    setSelectedFeatures(prev => {
      if (prev.includes(featureValue)) {
        return prev.filter(f => f !== featureValue)
      } else {
        return [...prev, featureValue]
      }
    })
  }

  const handleSelectAll = () => {
    setSelectedTabs(AVAILABLE_TABS.map(t => t.value))
    setSelectedFeatures(AVAILABLE_FEATURES.map(f => f.value))
  }

  const handleClearAll = () => {
    setSelectedTabs([])
    setSelectedFeatures([])
  }

  const handleSave = () => {
    const permissions = {
      tabs: selectedTabs,
      features: selectedFeatures
    }
    onSave(permissions)
  }

  return (
    <PermissionContainer>
      <PermissionHeader>
        <PermissionTitle>Manage User Permissions</PermissionTitle>
        <QuickActionBar>
          <QuickActionButton onClick={handleSelectAll}>
            Select All
          </QuickActionButton>
          <QuickActionButton onClick={handleClearAll}>
            Clear All
          </QuickActionButton>
        </QuickActionBar>
      </PermissionHeader>

      <HintText>
        Configure which admin panel tabs and features this user can access.
        Unchecked items will be hidden from the user's admin panel.
      </HintText>

      {/* Tab Selection */}
      <PermissionSection>
        <SectionLabel>
          📋 Admin Panel Tabs
        </SectionLabel>
        <CheckboxGroup>
          {AVAILABLE_TABS.map(tab => (
            <CheckboxLabel key={tab.value}>
              <input
                type="checkbox"
                checked={selectedTabs.includes(tab.value)}
                onChange={() => handleTabToggle(tab.value)}
              />
              {tab.label}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      </PermissionSection>

      {/* Feature Selection - Only show if 'features' tab is selected */}
      {selectedTabs.includes('features') && (
        <PermissionSection>
          <SectionLabel>
            ⚙️ Feature Access
          </SectionLabel>
          <HintText style={{ marginBottom: '0.75rem' }}>
            Select which features are accessible within the Features tab
          </HintText>
          <CheckboxGroup>
            {AVAILABLE_FEATURES.map(feature => (
              <CheckboxLabel key={feature.value}>
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature.value)}
                  onChange={() => handleFeatureToggle(feature.value)}
                />
                {feature.label}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </PermissionSection>
      )}

      <ActionButtons>
        <Button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Permissions'}
        </Button>
      </ActionButtons>
    </PermissionContainer>
  )
}

export default PermissionManager
