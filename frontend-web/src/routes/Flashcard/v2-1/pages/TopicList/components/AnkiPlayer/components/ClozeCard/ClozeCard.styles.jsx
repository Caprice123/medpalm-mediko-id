import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  min-height: ${p => p.$revealed ? '0' : '320px'};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.25rem;
`

export const TextBlockContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const TextBlock = styled.p`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  row-gap: 0.5rem;
  font-size: 1.3125rem;
  font-weight: 600;
  color: #111827;
  line-height: 2.4;
  margin: 0;
  text-align: center;
  white-space: pre-wrap;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const Blank = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
  margin: 0 0.1875rem;
  vertical-align: bottom;
`

export const UserAnswerTag = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  text-align: center;
  padding: 0.0625rem 0.5rem;
  border-radius: 999px;
  background: #fecaca;
  color: #b91c1c;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`

export const AnswerBox = styled.span`
  display: inline-block;
  font-size: 1.125rem;
  font-weight: 700;
  text-align: center;
  padding: 0.125rem 1rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #0d9488 0%, #059669 100%);
  color: #fff;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
    min-width: 2.75rem;
  }
`

export const BlankInput = styled.input`
  display: inline-block;
  width: 7rem;
  padding: 0.3125rem 0.5rem;
  margin: 0 0.1875rem;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  font-size: 1.0625rem;
  font-weight: 600;
  font-family: inherit;
  color: #111827;
  text-align: center;

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border-color: #0d9488;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
  }

  @media (max-width: 768px) {
    width: 5.5rem;
    font-size: 1rem;
  }
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
