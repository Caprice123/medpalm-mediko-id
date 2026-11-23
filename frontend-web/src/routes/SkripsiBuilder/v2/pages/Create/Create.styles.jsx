import styled from 'styled-components'
import { Container as BootstrapContainer } from 'react-bootstrap'

export const Page = styled.div`
  background: var(--color-surface-app);
  min-height: calc(100vh - 44px);
  padding-block: 2.5rem;

  @media (max-width: 768px) {
    padding-block: 1.5rem;
  }
`

export const Content = styled(BootstrapContainer)`
  max-width: 880px;
`

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-gray-800);
  margin: 0 0 0.35rem;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`

export const Subtitle = styled.p`
  font-size: 0.95rem;
  color: var(--color-gray-500);
  margin: 0 0 2rem;
`

// A section heading inside a step, for the second step's two blocks ("Cara
// mengerjakan" above the form). Shared by WorkModePicker and
// ReportDetailsForm.
export const BlockLabel = styled.h2`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-gray-500);
  margin: 0 0 0.85rem;
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
`

// Back on the left, forward on the right, so the direction of each button
// matches where it takes you.
export const FooterSpacer = styled.div`
  flex: 1;
`

// One block within a step.
export const Block = styled.section`
  & + & {
    margin-top: 2rem;
  }
`
