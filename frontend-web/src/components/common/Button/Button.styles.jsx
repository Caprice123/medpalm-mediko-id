import styled from 'styled-components'

// The primary/secondary pair mirrors the landing page hero CTAs ("Mulai
// Sekarang" / "Lihat Fitur"): a 103deg blue gradient against a white button
// with a hairline border, both on a generous radius, both lifting 1px on
// hover. Keeping them identical is what makes the app read as the same
// product as the marketing site.
export const StyledButton = styled.button`
  padding: ${props => props.size === 'small' ? '0.5rem 0.875rem' :
                      props.size === 'large' ? '0.875rem 1.75rem' :
                      '0.625rem 1.25rem'};
  min-height: ${props => props.size === 'small' ? '36px' : '44px'};
  border-radius: ${props => props.size === 'small' ? '10px' : '12px'};
  font-weight: 600;
  font-size: ${props => props.size === 'small' ? '0.75rem' : '0.875rem'};
  cursor: pointer;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: filter 0.18s ease, transform 0.18s ease, background 0.18s ease,
    border-color 0.18s ease, box-shadow 0.18s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(103deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%);
    color: #fff;

    &:hover:not(:disabled) {
      filter: brightness(1.06);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      filter: brightness(0.98);
      transform: translateY(0);
    }
  ` : props.variant === 'danger' ? `
    background: var(--color-danger);
    color: #fff;

    &:hover:not(:disabled) {
      background: var(--color-danger-dark);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      background: var(--color-danger-dark);
      filter: brightness(0.95);
      transform: translateY(0);
    }
  ` : props.variant === 'success' ? `
    background: var(--color-brand-green);
    color: #fff;

    &:hover:not(:disabled) {
      background: var(--color-brand-green-dark);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      background: var(--color-brand-green-darker);
      transform: translateY(0);
    }
  ` : props.variant === 'outline' ? `
    background: transparent;
    color: var(--color-brand-blue);
    border-color: var(--color-brand-blue);

    &:hover:not(:disabled) {
      background: var(--color-brand-blue);
      color: #fff;
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      background: var(--color-brand-blue-deep);
      border-color: var(--color-brand-blue-deep);
      color: #fff;
      transform: translateY(0);
    }
  ` : `
    background: var(--color-surface);
    color: var(--color-gray-800);
    border-color: var(--color-gray-200);

    &:hover:not(:disabled) {
      border-color: var(--color-brand-blue-light);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      background: var(--color-gray-50);
      transform: translateY(0);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => props.fullWidth && `
    width: 100%;
    justify-content: center;
  `}

  @media (max-width: 768px) {
    font-size: ${props => props.size === 'small' ? '0.8125rem' : '0.9375rem'};

    ${props => props.fullWidth && `
      width: 100%;
    `}
  }
`
