import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  width: 100%;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`

export const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
`

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.neutral.gray800};
  margin: 0;
`

export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
`

export const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid ${colors.neutral.gray200};
  margin-bottom: 2rem;
  gap: 0.5rem;
`

export const Tab = styled.button`
  background: ${props => props.$active ? '#EEF6FF' : 'transparent'};
  color: ${props => props.$active ? colors.primary.dark : colors.neutral.gray500};
  border: none;
  border-bottom: 2px solid ${props => props.$active ? colors.primary.dark : 'transparent'};
  padding: 0.75rem 1.5rem;
  font-weight: ${props => props.$active ? 600 : 500};
  font-size: 0.875rem;
  cursor: pointer;
  position: relative;
  bottom: -2px;

  &:hover {
    background: ${props => props.$active ? '#EEF6FF' : colors.neutral.gray50};
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

export const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${colors.neutral.gray500};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid ${colors.neutral.gray200};
`

export const Td = styled.td`
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  color: ${colors.neutral.gray700};
  border-bottom: 1px solid ${colors.neutral.gray100};
  vertical-align: middle;
`

export const Tr = styled.tr`
  &:hover { background: ${colors.neutral.gray50}; }
`

export const ActionCell = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const SubHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`

export const SubTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.neutral.gray800};
  margin: 0;
`

export const EmptyRow = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${colors.neutral.gray400};
  font-size: 0.875rem;
`

export const Badge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    if (props.$status === 'active') return '#D1FAE5'
    if (props.$status === 'inactive') return '#FEE2E2'
    if (props.$status === 'completed') return '#EDE9FE'
    return '#F3F4F6'
  }};
  color: ${props => {
    if (props.$status === 'active') return '#065F46'
    if (props.$status === 'inactive') return '#991B1B'
    if (props.$status === 'completed') return '#5B21B6'
    return '#374151'
  }};
`

export const ScoringBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => props.$type === 'blitz' ? '#FEF3C7' : '#DBEAFE'};
  color: ${props => props.$type === 'blitz' ? '#92400E' : '#1E40AF'};
`

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  &.full { grid-template-columns: 1fr; }
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.neutral.gray700};
`

export const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`

export const OptionLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.$correct ? colors.secondary.dark : colors.neutral.gray500};
  min-width: 1.5rem;
`

export const CorrectBtn = styled.button`
  background: ${props => props.$active ? '#D1FAE5' : colors.neutral.gray100};
  color: ${props => props.$active ? '#065F46' : colors.neutral.gray500};
  border: 1px solid ${props => props.$active ? '#6EE7B7' : colors.neutral.gray200};
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  white-space: nowrap;
`

export const BadgeImagePreview = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid ${colors.neutral.gray200};
`

export const BadgeCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.25rem;
`

export const BadgeCard = styled.div`
  background: white;
  border: 1px solid ${colors.neutral.gray200};
  border-radius: 12px;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  transition: box-shadow 0.15s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`

export const BadgeCardImage = styled.img`
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid ${colors.neutral.gray200};
  margin-bottom: 0.25rem;
`

export const BadgeCardPlaceholder = styled.div`
  width: 72px;
  height: 72px;
  background: ${colors.neutral.gray100};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
`

export const BadgeCardName = styled.h4`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.neutral.gray800};
  line-height: 1.3;
`

export const BadgeCardRank = styled.div`
  font-size: 0.75rem;
  color: ${colors.neutral.gray500};
  background: ${colors.neutral.gray100};
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
`

export const BadgeCardDesc = styled.p`
  font-size: 0.75rem;
  color: ${colors.neutral.gray400};
  margin: 0;
  line-height: 1.4;
  word-break: break-word;
`

export const BadgeCardActions = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-top: 0.5rem;
  width: 100%;
  justify-content: center;
`
