import styled from 'styled-components'

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`

export const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const Connector = styled.span`
  width: 2.5rem;
  height: 2px;
  border-radius: 1px;
  background: ${({ $done }) => ($done ? 'var(--color-brand-blue)' : 'var(--color-gray-200)')};
  transition: background 0.2s ease;

  @media (max-width: 768px) {
    width: 1.25rem;
  }
`

export const Marker = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.65rem;
  height: 1.65rem;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  ${({ $done, $current }) => {
    if ($done) {
      return `
        border: 1.5px solid var(--color-brand-blue);
        background: var(--color-brand-blue);
        color: var(--color-surface);
        cursor: pointer;
      `
    }

    if ($current) {
      return `
        border: 1.5px solid var(--color-brand-blue);
        background: var(--color-brand-blue-tint);
        color: var(--color-brand-blue-deep);
        cursor: default;
      `
    }

    return `
      border: 1.5px solid var(--color-gray-300);
      background: var(--color-surface);
      color: var(--color-gray-400);
      cursor: default;
    `
  }}
`

export const StepTitle = styled.span`
  font-size: 0.78rem;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${({ $active }) => ($active ? 'var(--color-gray-800)' : 'var(--color-gray-400)')};

  /* The label for the step that is not current is the one to lose first: the
     marker still carries its number. */
  @media (max-width: 560px) {
    display: ${({ $active }) => ($active ? 'inline' : 'none')};
  }
`
