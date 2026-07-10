import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);

  &:hover {
    border-color: #c4b5fd;
    box-shadow: 0 4px 16px rgba(109, 40, 217, 0.1);
    transform: translateY(-2px);
  }
`

export const CardAccent = styled.div`
  height: 4px;
  background: linear-gradient(90deg, #7c3aed, #a78bfa);
`

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.25rem;
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 0.75rem;
`

export const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  flex: 1;
  line-height: 1.4;
`

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: ${props => props.$published ? '#dcfce7' : '#f3f4f6'};
  color: ${props => props.$published ? '#15803d' : '#6b7280'};
  border: 1px solid ${props => props.$published ? '#bbf7d0' : '#e5e7eb'};
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 0.02em;

  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.$published ? '#16a34a' : '#9ca3af'};
  }
`

export const Description = styled.p`
  color: #6b7280;
  font-size: 0.8125rem;
  line-height: 1.6;
  margin-bottom: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const Spacer = styled.div`
  flex: 1;
`

export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.875rem;
`

export const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.55rem;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 500;

  ${p => p.$type === 'department' ? `
    background: #eef2ff;
    color: #4338ca;
    border: 1px solid #c7d2fe;
  ` : `
    background: #f0fdf4;
    color: #166534;
    border: 1px solid #bbf7d0;
  `}
`

export const NodeSection = styled.div`
  margin-bottom: 0.75rem;
`

export const NodeSectionLabel = styled.p`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  margin-bottom: 0.35rem;
`

export const NodeChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  min-height: 1.5rem;
`

export const NodeChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background: #dcfce7;
  color: #15803d;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`

export const EmptyNodeHint = styled.span`
  font-size: 0.75rem;
  color: #d1d5db;
  font-style: italic;
`

export const Stats = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1rem;
`

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`

export const StatLabel = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
`

export const StatValue = styled.span`
  font-size: 0.8125rem;
  color: #374151;
  font-weight: 700;
`

export const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 0.875rem;
  border-top: 1px solid #f3f4f6;
  margin-top: auto;

  & > * {
    flex: 1;
    justify-content: center;
  }
`

export const EmptyText = styled.p`
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
`

export const TreePickerWrapper = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  max-height: 320px;
  overflow-y: auto;
  font-size: 0.875rem;
`

export const TreePickerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  padding-left: ${props => (props.$depth * 1.5) + 1}rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  background: ${props => props.$selected ? '#f0fdf4' : 'white'};
  color: ${props => props.$selected ? '#15803d' : '#374151'};

  &:hover {
    background: ${props => props.$selected ? '#dcfce7' : '#f9fafb'};
  }

  &:last-child {
    border-bottom: none;
  }
`
