import styled from 'styled-components'

export const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-700);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 0;
`

export const HintText = styled.p`
  font-size: 0.8125rem;
  color: var(--color-gray-500);
  margin: 0.25rem 0 0.75rem 0;
  line-height: 1.5;
`

export const FilterToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--color-gray-50);
  border-radius: 8px;
  margin-bottom: 1.25rem;

  strong {
    font-size: 0.9375rem;
    color: var(--color-gray-900);
  }
`

export const SelectAllRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;

  span {
    font-size: 0.8125rem;
    color: var(--color-gray-500);
  }
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--color-gray-900);
  background: #fff;
  outline: none;
  margin-bottom: 0.75rem;
  box-sizing: border-box;

  &::placeholder { color: var(--color-gray-400); }

  &:focus {
    border-color: var(--color-brand-blue);
    box-shadow: 0 0 0 2px rgba(30, 115, 170, 0.1);
  }
`

export const ResultCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.5rem;
`

export const ResultCard = styled.button`
  display: flex;
  align-items: flex-start;
  align-self: start;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  background: ${({ $checked, $disabled }) => $checked ? 'var(--color-brand-blue-tint)' : $disabled ? 'var(--color-gray-100)' : 'var(--color-gray-50)'};
  border: 1.5px solid ${({ $checked, $disabled }) => $checked ? 'var(--color-brand-blue)' : $disabled ? 'var(--color-gray-200)' : 'var(--color-gray-200)'};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.15s;

  &:hover {
    ${({ $disabled }) => !$disabled && `
      border-color: var(--color-brand-blue);
      background: var(--color-brand-blue-tint);
    `}
  }
`

export const ResultCardCheck = styled.span`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid ${({ $checked }) => $checked ? 'var(--color-brand-blue)' : 'var(--color-gray-300)'};
  background: ${({ $checked }) => $checked ? 'var(--color-brand-blue)' : '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
  font-size: 10px;
  color: #fff;
  transition: all 0.15s;
`

export const ResultCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
`

export const ResultCardName = styled.span`
  font-weight: 500;
  font-size: 0.8125rem;
  color: ${({ $checked }) => $checked ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-700)'};
`

export const ResultCardMeta = styled.span`
  font-size: 0.6875rem;
  color: var(--color-gray-400);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  gap: 0.5rem;
`

export const PageInfo = styled.span`
  font-size: 0.8125rem;
  color: var(--color-gray-500);
`

export const PageButtons = styled.div`
  display: flex;
  gap: 0.25rem;
`

export const PageBtn = styled.button`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid var(--color-gray-200);
  background: #fff;
  color: var(--color-gray-700);
  cursor: pointer;
  transition: all 0.15s;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--color-gray-100);
  }
`

export const SelectedSummarySection = styled.div`
  margin-bottom: 0.75rem;
`

export const SelectedSummaryLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.375rem;
`

export const SelectedChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`

export const SelectedJournalChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  background: var(--color-brand-blue-tint);
  border: 1px solid var(--color-brand-blue-tint-strong);
  border-radius: 99px;
  font-size: 0.75rem;
  color: var(--color-brand-blue-deep);

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-brand-blue);
    padding: 0;
    line-height: 1;
    font-size: 0.75rem;
    &:hover { color: var(--color-brand-blue-deep); }
  }
`

export const EmptyResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--color-gray-400);
  font-size: 0.875rem;
  background: var(--color-gray-50);
  border-radius: 8px;
  margin-top: 0.75rem;
`

export const YearFilterSection = styled.div`
  margin-bottom: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-200);
`

export const YearPresetRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`

export const YearPresetBtn = styled.button`
  padding: 0.375rem 0.875rem;
  border-radius: 99px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  border: 1.5px solid ${({ $active }) => $active ? 'var(--color-brand-blue)' : 'var(--color-gray-200)'};
  background: ${({ $active }) => $active ? 'var(--color-brand-blue-tint)' : '#fff'};
  color: ${({ $active }) => $active ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-700)'};
  transition: all 0.15s;

  &:hover {
    border-color: var(--color-brand-blue);
    background: var(--color-brand-blue-tint);
    color: var(--color-brand-blue-deep);
  }
`

export const YearRangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.625rem;

  span {
    font-size: 0.8125rem;
    color: var(--color-gray-500);
    flex-shrink: 0;
  }
`

export const YearInput = styled.input`
  width: 90px;
  padding: 0.375rem 0.625rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--color-gray-900);
  outline: none;
  text-align: center;

  &::placeholder { color: var(--color-gray-400); }
  &:focus { border-color: var(--color-brand-blue); box-shadow: 0 0 0 2px rgba(30, 115, 170,0.1); }
`
