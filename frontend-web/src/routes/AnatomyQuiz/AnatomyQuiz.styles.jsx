import styled from 'styled-components'

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-surface-page) 0%, var(--color-brand-blue-tint) 100%);
  padding: 2rem;
`

export const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
`

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-brand-blue), var(--color-brand-blue-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`

export const Subtitle = styled.p`
  color: var(--color-gray-500);
  font-size: 1.1rem;
`

export const FilterSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

export const QuizGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`

export const QuizCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(30, 115, 170, 0.2);
  }
`

export const QuizImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
`

export const QuizCardBody = styled.div`
  padding: 1.5rem;
`

export const QuizTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-gray-800);
  margin-bottom: 0.5rem;
`

export const QuizDescription = styled.p`
  color: var(--color-gray-500);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.5;
`

export const QuizMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: var(--color-gray-400);
  font-size: 0.875rem;
`

export const QuizMetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

export const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, rgba(30, 115, 170, 0.1), rgba(124, 179, 66, 0.1));
  color: var(--color-brand-blue);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`

export const SubscriptionBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--color-brand-blue), var(--color-brand-blue-light));
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`

export const EmptyState = styled.div`
  max-width: 600px;
  margin: 4rem auto;
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`

export const EmptyStateIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.3;
`

export const EmptyStateText = styled.p`
  font-size: 1.25rem;
  color: var(--color-gray-500);
  margin-bottom: 0.5rem;
`

export const LoadingOverlay = styled.div`
  max-width: 600px;
  margin: 4rem auto;
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  color: var(--color-brand-blue);
  font-size: 1.1rem;
`
