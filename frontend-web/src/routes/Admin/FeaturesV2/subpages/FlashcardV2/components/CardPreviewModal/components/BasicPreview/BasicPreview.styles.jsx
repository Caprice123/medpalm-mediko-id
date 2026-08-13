import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

export const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
`

export const FrontText = styled.p`
  font-size: 1.3125rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
`

export const CardImage = styled.img`
  display: block;
  max-width: 280px;
  max-height: 160px;
  object-fit: contain;
  border-radius: 8px;
  background: #f3f4f6;
`

export const BackBox = styled.div`
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #0d9488 0%, #059669 100%);
  color: #fff;
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.5;
  white-space: pre-wrap;
`

export const RevealButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #0d9488;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover { opacity: 0.9; }
`
