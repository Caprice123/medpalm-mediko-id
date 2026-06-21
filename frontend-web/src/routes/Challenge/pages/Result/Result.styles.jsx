import styled from 'styled-components'

export const PageWrapper = styled.div`
  min-height: calc(100vh - 90px);
  background: #f0fdfa;
`

export const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) { padding: 1.25rem; }
`

export const HeroCard = styled.div`
  background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
  color: #fff;
  margin-bottom: 1.5rem;
`

export const HeroTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`

export const StatsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  flex-wrap: wrap;
`

export const Stat = styled.div`
  text-align: center;
`

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
`

export const StatLabel = styled.div`
  font-size: 0.8125rem;
  opacity: 0.8;
  margin-top: 0.25rem;
`

export const BadgeBox = styled.div`
  background: #fff;
  border: 2px solid #FCD34D;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

export const BadgeImg = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 10px;
`

export const BadgeName = styled.div`
  font-size: 1.0625rem;
  font-weight: 700;
  color: #B45309;
`

export const BadgeDesc = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.2rem;
`

export const ReviewSection = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`

export const ReviewTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.25rem;
`

export const ReviewItem = styled.div`
  border-bottom: 1px solid #f3f4f6;
  padding: 1rem 0;

  &:last-child { border-bottom: none; }
`

export const QuestionText = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.75rem;
`

export const AnswerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background: ${props => {
    if (props.$correct) return '#D1FAE5'
    if (props.$wrong) return '#FEE2E2'
    return '#F9FAFB'
  }};
  color: ${props => {
    if (props.$correct) return '#065F46'
    if (props.$wrong) return '#991B1B'
    return '#374151'
  }};
  font-size: 0.875rem;
  margin-bottom: 0.375rem;
`

export const ExplanationBox = styled.div`
  background: #FFF7ED;
  border-left: 3px solid #F97316;
  padding: 0.75rem;
  border-radius: 0 6px 6px 0;
  font-size: 0.8125rem;
  color: #374151;
  margin-top: 0.5rem;
  line-height: 1.5;
`

export const EmailNotice = styled.div`
  background: #fff;
  border: 1px solid #a5f3fc;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #0e7490;
`

export const BackBtn = styled.button`
  display: block;
  margin: 0 auto 1.5rem;
  padding: 0.75rem 2.5rem;
  background: #1E40AF;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #1e3a8a; }
`
