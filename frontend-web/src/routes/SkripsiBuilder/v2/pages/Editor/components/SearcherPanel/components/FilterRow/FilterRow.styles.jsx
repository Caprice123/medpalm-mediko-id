import styled from 'styled-components'

export const Row = styled.div`
  border-top: 1px solid var(--color-gray-200);
  padding-top: 0.75rem;
`

export const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`

export const Icon = styled.span`
  display: inline-flex;
  color: var(--color-brand-blue);
  font-size: 0.9rem;
`

export const Label = styled.span`
  flex: 1;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-gray-800);
`

// A plain checkbox styled as the pill switch the design asks for. It stays a
// real <input> so it keeps its keyboard behaviour and label association.
export const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 2.4rem;
  height: 1.3rem;
  flex-shrink: 0;

  input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    cursor: pointer;
  }

  span {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: var(--color-gray-300);
    transition: background 0.15s ease;
    pointer-events: none;
  }

  span::after {
    content: '';
    position: absolute;
    top: 0.15rem;
    left: 0.15rem;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: var(--color-surface);
    transition: transform 0.15s ease;
  }

  input:checked + span {
    background: var(--color-brand-blue);
  }

  input:checked + span::after {
    transform: translateX(1.1rem);
  }

  input:focus-visible + span {
    outline: 2px solid var(--color-brand-blue-deep);
    outline-offset: 2px;
  }
`

export const Body = styled.div`
  margin-top: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
