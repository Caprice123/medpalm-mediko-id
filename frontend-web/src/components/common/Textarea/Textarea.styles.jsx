import styled from 'styled-components'

export const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`

export const RequiredMark = styled.span`
  color: #ef4444;
  font-weight: 600;
  margin-left: 0.25rem;
`

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
  color: #111827;
  background: white;
  resize: vertical;
  box-sizing: border-box;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  min-height: ${props =>
    props.size === 'small' ? '60px' :
    props.size === 'large' ? '120px' :
    '80px'
  };

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#6BB9E8'};
    box-shadow: 0 0 0 3px ${props => props.hasError
      ? 'rgba(239, 68, 68, 0.1)'
      : 'rgba(107, 185, 232, 0.15)'};
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
    min-height: ${props =>
      props.size === 'small' ? '80px' :
      props.size === 'large' ? '140px' :
      '100px'
    };
  }
`

export const CharCount = styled.div`
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: ${props => props.isOverLimit ? '#ef4444' : '#6b7280'};
  text-align: right;
`

export const HintText = styled.div`
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: #6b7280;
`

export const ErrorText = styled.div`
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: #ef4444;
  font-weight: 500;
`
