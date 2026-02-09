import styled from 'styled-components'
import { colors } from '@config/colors'

export const FilterSection = styled.div`
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
`

export const SelectedItemsPreview = styled.div`
  margin-bottom: 1rem;
`

export const SelectedItemsLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`

export const SelectedChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: 120px;
  overflow-y: auto;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`

export const SelectedChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: ${colors.primary.main};
  color: white;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
`

export const RemoveChipButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

export const EmptySelectedMessage = styled.div`
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
  padding: 1rem;
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 3px rgba(107, 185, 232, 0.1);
  }
`

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: #f9fafb;
`

export const DecksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const DeckCard = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border: ${props => props.selected ? `2px solid ${colors.primary.main}` : '1px solid #e5e7eb'};
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;

  ${props => props.selected && `
    background: #eff6ff;
    border-color: ${colors.primary.main};
  `}

  &:hover {
    border-color: ${props => props.selected ? colors.primary.main : '#d1d5db'};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.75rem;
`

export const CheckboxContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 24px;
  height: 24px;
  border: 2px solid ${props => props.checked ? colors.primary.main : '#d1d5db'};
  border-radius: 6px;
  background: ${props => props.checked ? colors.primary.main : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &::after {
    content: '✓';
    color: white;
    font-weight: bold;
    font-size: 1rem;
    opacity: ${props => props.checked ? 1 : 0};
  }
`

export const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
  padding-right: 2rem;
`

export const StatusBadge = styled.span`
  background: ${props => props.status === 'published' ? '#dcfce7' : props.status === 'testing' ? '#fef3c7' : '#e0e7ff'};
  color: ${props => props.status === 'published' ? '#16a34a' : props.status === 'testing' ? '#92400e' : '#4f46e5'};
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  white-space: nowrap;
`

export const CardDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background: ${props => {
    if (props.university) return '#dbeafe';
    if (props.semester) return '#d1fae5';
    return '#ede9fe';
  }};
  color: ${props => {
    if (props.university) return '#1e40af';
    if (props.semester) return '#065f46';
    return '#5b21b6';
  }};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`

export const CardStats = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const StatLabel = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
`

export const StatValue = styled.span`
  font-size: 0.875rem;
  color: #374151;
  font-weight: 700;
`

export const Footer = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

export const SelectedItems = styled.div`
  flex: 1;
  color: ${colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
`
