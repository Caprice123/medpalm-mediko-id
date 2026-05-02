import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFeatureSubscriptions } from '@store/featureSubscriptions/action'
import { Filter } from './components/Filter'
import { FeatureSubscriptionsTable } from './components/Table'
import { AddEditModal } from './components/AddEditModal'
import Button from '@components/common/Button'
import {
  Container,
  HeaderSection,
  TitleGroup,
  SectionTitle,
  SectionSubtitle,
} from './FeatureSubscriptions.styles'

function FeatureSubscriptions() {
  const dispatch = useDispatch()
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    dispatch(fetchFeatureSubscriptions())
  }, [dispatch])

  return (
    <Container>
      <HeaderSection>
        <TitleGroup>
          <SectionTitle>Langganan Fitur</SectionTitle>
          <SectionSubtitle>Kelola akses fitur per user — tambah, ubah, atau hapus langganan</SectionSubtitle>
        </TitleGroup>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          + Tambah
        </Button>
      </HeaderSection>

      <Filter />

      <FeatureSubscriptionsTable />

      <AddEditModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        editRecord={null}
      />
    </Container>
  )
}

export default FeatureSubscriptions
