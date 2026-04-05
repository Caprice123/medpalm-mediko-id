import { useState, useEffect } from 'react'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
} from '../TransactionDetail/TransactionDetail.styles'
import styled from 'styled-components'
import colors from '@config/colors'

const PlanInfo = styled.div`
  background: ${colors.background.default || '#f9fafb'};
  border: 1px solid ${colors.neutral?.gray200 || '#e5e7eb'};
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`

const PlanName = styled.div`
  font-weight: 700;
  font-size: 1rem;
  color: ${colors.text?.primary || '#111827'};
`

const PlanPrice = styled.div`
  font-size: 0.875rem;
  color: ${colors.text?.secondary || '#6b7280'};
  margin-top: 0.25rem;
`

const FormGroup = styled.div`
  margin-bottom: 1rem;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`

const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)

export default function PlanContactModal({ isOpen, onClose, onConfirm, plan, defaultPhone, defaultUniversity, isLoading }) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [university, setUniversity] = useState('')

  useEffect(() => {
    if (isOpen) {
      setPhoneNumber(defaultPhone || '')
      setUniversity(defaultUniversity || '')
    }
  }, [isOpen, defaultPhone, defaultUniversity])

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm({ phoneNumber: phoneNumber.trim(), university: university.trim() })
  }

  return (
    <Modal $isOpen={isOpen} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <ModalContent style={{ maxWidth: '480px' }}>
        <ModalHeader>
          <ModalTitle>📋 Konfirmasi Pembelian</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody style={{ padding: '1.5rem' }}>
          {plan && (
            <PlanInfo>
              <PlanName>{plan.name}</PlanName>
              <PlanPrice>{formatCurrency(plan.price)}</PlanPrice>
            </PlanInfo>
          )}

          <FormGroup>
            <TextInput
              label="Nomor HP / WhatsApp"
              placeholder="contoh: 08123456789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
            />
          </FormGroup>

          <FormGroup>
            <TextInput
              label="Universitas"
              placeholder="contoh: Universitas Indonesia"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              disabled={isLoading}
            />
          </FormGroup>

          <ActionButtons>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
            </Button>
          </ActionButtons>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
