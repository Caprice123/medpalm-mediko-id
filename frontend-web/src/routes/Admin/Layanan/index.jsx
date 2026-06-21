import { useState } from 'react'
import ChallengeAdminPage from '../Features/subpages/Challenge'
import Button from '@components/common/Button'
import styled from 'styled-components'

const Container = styled.div`
  padding: 1rem 0;
`

const HeaderSection = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0891b2;
  margin: 0;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`

const CardIcon = styled.p`
  font-size: 2rem;
  margin: 0;
`

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem;
`

const CardDesc = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1rem;
  flex: 1;
`

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const LAYANAN_LIST = [
  {
    key: 'challenge',
    name: 'Challenge',
    description: 'Kelola challenge, soal, dan badge. Pengguna dapat bersaing satu sama lain berdasarkan skor.',
    icon: '🏆',
  },
]

function Layanan() {
  const [selected, setSelected] = useState(null)

  const handleBack = () => setSelected(null)

  if (selected) {
    if (selected.key === 'challenge') return <ChallengeAdminPage onBack={handleBack} />
    return null
  }

  return (
    <Container>
      <HeaderSection>
        <SectionTitle>Layanan</SectionTitle>
      </HeaderSection>

      <Grid>
        {LAYANAN_LIST.map(item => (
          <Card key={item.key}>
            <CardHeader>
              <CardIcon>{item.icon}</CardIcon>
            </CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDesc>{item.description}</CardDesc>
            <CardActions>
              <Button variant="primary" onClick={() => setSelected(item)} style={{ flex: 1 }}>
                Konfigurasi
              </Button>
            </CardActions>
          </Card>
        ))}
      </Grid>
    </Container>
  )
}

export default Layanan
