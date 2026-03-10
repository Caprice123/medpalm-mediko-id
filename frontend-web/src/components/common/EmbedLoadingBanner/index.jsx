import { useState } from 'react'
import styled from 'styled-components'

const Banner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1rem;
  background: #fffbeb;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.8125rem;
  color: #92400e;
  line-height: 1.4;
`

const Message = styled.span`
  flex: 1;
`

const Icon = styled.span`
  font-size: 1rem;
  flex-shrink: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #92400e;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  flex-shrink: 0;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`

function EmbedLoadingBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <Banner>
      <Icon>⏳</Icon>
      <Message>
        Beberapa model mungkin loading cukup lama, mohon tunggu beberapa detik atau coba refresh halaman.
      </Message>
      <CloseButton onClick={() => setVisible(false)} aria-label="Tutup">✕</CloseButton>
    </Banner>
  )
}

export default EmbedLoadingBanner
