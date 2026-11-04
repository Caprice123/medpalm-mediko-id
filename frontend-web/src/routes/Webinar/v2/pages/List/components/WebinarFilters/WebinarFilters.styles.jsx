import styled from 'styled-components'
import { Strip } from '../../List.styles'

export const FilterStrip = styled(Strip)`
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const FilterTab = styled.button`
  padding: 0.4375rem 0.875rem;
  border-radius: 999px;
  border: 1.5px solid
    ${({ $active }) => ($active ? 'var(--color-brand-blue)' : 'var(--color-gray-200)')};
  background: ${({ $active }) => ($active ? 'var(--color-brand-blue)' : 'var(--color-surface)')};
  color: ${({ $active }) => ($active ? 'var(--color-surface)' : 'var(--color-gray-600)')};
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: var(--color-brand-blue);
    color: ${({ $active }) => ($active ? 'var(--color-surface)' : 'var(--color-brand-blue)')};
  }
`

export const SearchForm = styled.form`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`

export const SearchField = styled.div`
  position: relative;
  width: 15rem;

  svg {
    position: absolute;
    left: 0.6875rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-gray-500);
    pointer-events: none;
  }

  input {
    width: 100%;
    height: 2.375rem;
    padding: 0 0.75rem 0 2.125rem;
    border-radius: 999px;
    border: 1px solid var(--color-gray-200);
    background: var(--color-surface);
    font-family: inherit;
    font-size: 0.8125rem;
    color: var(--color-gray-900);

    &::placeholder { color: var(--color-gray-500); }

    &:hover { border-color: var(--color-border-strong); }

    &:focus {
      outline: none;
      border-color: var(--color-brand-blue);
      box-shadow: 0 0 0 3px var(--color-brand-blue-tint);
    }
  }

  @media (max-width: 768px) {
    flex: 1;
    width: auto;
  }
`
