import styled from 'styled-components'
import Card from '@components/common/Card'

export const Container = styled.div`
  padding: 1.5rem 0;
`

export const HeaderSection = styled.div`
  margin-bottom: 2rem;
`

export const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0891b2;
  margin-bottom: 0.5rem;
`

export const SectionSubtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

export const StatCard = styled(Card)`
  padding: 1.5rem;
  background: ${props => props.bg || 'white'};
  border: none;
`

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.color || '#0891b2'};
`

export const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;

  ${props => {
    switch (props.status) {
      case 'completed':
        return 'background: #dcfce7; color: #166534;';
      case 'pending':
        return 'background: #fef3c7; color: #92400e;';
      case 'failed':
        return 'background: #fee2e2; color: #991b1b;';
      default:
        return 'background: #f3f4f6; color: #4b5563;';
    }
  }}
`

export const TypeBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;

  ${props => {
    switch (props.type) {
      case 'purchase':
      case 'credits':
        return 'background: #dbeafe; color: #1e40af;';
      case 'deduction':
        return 'background: #fee2e2; color: #991b1b;';
      case 'bonus':
      case 'subscription_bonus':
        return 'background: #fae8ff; color: #86198f;';
      case 'subscription':
        return 'background: #e0e7ff; color: #3730a3;';
      case 'hybrid':
        return 'background: #fef3c7; color: #92400e;';
      case 'refund':
        return 'background: #dcfce7; color: #166534;';
      default:
        return 'background: #f3f4f6; color: #4b5563;';
    }
  }}
`

export const AmountText = styled.span`
  font-weight: 600;
  color: ${props => props.positive ? '#059669' : '#dc2626'};
`

export const ActionGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
  font-size: 0.875rem;
`
