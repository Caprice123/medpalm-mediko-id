import styled from 'styled-components'

export const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  background: #f0fdfa;
`

export const Card = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 2.5rem 2.5rem;
  width: 100%;
  max-width: 460px;
`

export const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background: #ccfbf1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  font-size: 2rem;
`

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem;
  text-align: center;
`

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 2rem;
  line-height: 1.6;
  text-align: center;
`

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.75rem;
`

export const FieldLabel = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
`
