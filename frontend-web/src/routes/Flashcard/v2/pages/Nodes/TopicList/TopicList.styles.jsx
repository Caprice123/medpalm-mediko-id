import styled from 'styled-components'

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`

export const PageHeader = styled.div`
  margin-bottom: 2rem;
`

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.25rem;
`

export const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
`

export const TopicCard = styled.div`
  background: #fff;
  border: 1.5px solid #f0f0f0;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &:hover {
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12);
    border-color: #a5b4fc;
    transform: translateY(-2px);
  }
`

export const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const ClassBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.65rem;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  background: #ede9fe;
  color: #6d28d9;
  text-transform: uppercase;
`

export const CardCount = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: #9ca3af;
`

export const TopicName = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.4;
`

export const CardArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #a5b4fc;
  font-size: 1.1rem;
  font-weight: 700;
`

export const EmptyWrap = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #9ca3af;
`
