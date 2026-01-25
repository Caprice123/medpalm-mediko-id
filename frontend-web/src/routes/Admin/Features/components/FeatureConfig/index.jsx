import { useState } from 'react'
import Button from '@components/common/Button'
import {
  Container,
  Header,
  HeaderContent,
  IconLarge,
  TitleSection,
  Title,
  Subtitle,
  StatusToggle,
  ContentSection,
  SectionTitle,
  FormGroup,
  Label,
  Input,
  Textarea,
  Switch,
  SwitchLabel,
  ButtonGroup,
  InfoBox,
  InfoText
} from './FeatureConfig.styles'

function FeatureConfig({ feature, onBack, onUpdate }) {
  const [formData, setFormData] = useState({
    name: feature.name,
    description: feature.description,
    cost: feature.cost,
    isActive: feature.isActive,
    icon: feature.icon
  })

  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    onUpdate(feature.id, formData)
    setHasChanges(false)
    alert('Konfigurasi berhasil disimpan!')
  }

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('Ada perubahan yang belum disimpan. Yakin ingin kembali?')) {
        onBack()
      }
    } else {
      onBack()
    }
  }

  return (
    <Container>
      <Header>
        <Button variant="secondary" onClick={handleCancel}>
          ←
        </Button>
        <HeaderContent>
          <IconLarge color={feature.color}>
            {formData.icon}
          </IconLarge>
          <TitleSection>
            <Title color={feature.color}>{formData.name}</Title>
            <Subtitle>Konfigurasi fitur dan pengaturan</Subtitle>
          </TitleSection>
          <StatusToggle isActive={formData.isActive}>
            <Switch color={feature.color}>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
              />
              <span></span>
            </Switch>
            <SwitchLabel isActive={formData.isActive} color={feature.color}>
              {formData.isActive ? 'Aktif' : 'Nonaktif'}
            </SwitchLabel>
          </StatusToggle>
        </HeaderContent>
      </Header>

      <ContentSection>
        <SectionTitle color={feature.color}>Informasi Dasar</SectionTitle>

        <FormGroup>
          <Label>Nama Fitur</Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            borderColor={feature.color}
            placeholder="Masukkan nama fitur"
          />
        </FormGroup>

        <FormGroup>
          <Label>Deskripsi</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            borderColor={feature.color}
            placeholder="Masukkan deskripsi fitur"
          />
        </FormGroup>

        <FormGroup>
          <Label>Icon (Emoji)</Label>
          <Input
            type="text"
            value={formData.icon}
            onChange={(e) => handleChange('icon', e.target.value)}
            borderColor={feature.color}
            placeholder="🔬"
            maxLength={2}
          />
        </FormGroup>

        <FormGroup>
          <Label>Biaya Kredit</Label>
          <Input
            type="number"
            value={formData.cost}
            onChange={(e) => handleChange('cost', parseInt(e.target.value) || 0)}
            borderColor={feature.color}
            min="0"
            placeholder="10"
          />
          <InfoBox color={feature.color}>
            <span>ℹ️</span>
            <InfoText>
              Jumlah kredit yang akan didebit dari saldo pengguna setiap kali menggunakan fitur ini.
            </InfoText>
          </InfoBox>
        </FormGroup>
      </ContentSection>

      <ContentSection>
        <SectionTitle color={feature.color}>Pengaturan Fitur</SectionTitle>

        <InfoBox color={feature.color}>
          <span>🔧</span>
          <InfoText>
            Pengaturan spesifik untuk fitur ini akan tersedia di sini. Setiap fitur dapat memiliki konfigurasi yang berbeda sesuai kebutuhan.
          </InfoText>
        </InfoBox>

        <FormGroup style={{ marginTop: '1rem' }}>
          <Label>API Endpoint (Optional)</Label>
          <Input
            type="text"
            borderColor={feature.color}
            placeholder="/api/features/diagnosis"
            disabled
          />
        </FormGroup>

        <FormGroup>
          <Label>Max Usage per Session</Label>
          <Input
            type="number"
            borderColor={feature.color}
            placeholder="10"
            defaultValue="10"
          />
        </FormGroup>
      </ContentSection>

      <ButtonGroup>
        <Button variant="secondary" onClick={handleCancel}>
          Batal
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Simpan Perubahan
        </Button>
      </ButtonGroup>
    </Container>
  )
}

export default FeatureConfig
