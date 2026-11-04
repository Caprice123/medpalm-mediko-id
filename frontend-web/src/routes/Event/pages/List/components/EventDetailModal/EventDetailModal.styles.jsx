import styled from 'styled-components'

export const DetailModalThumb = styled.img`
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  cursor: zoom-in;
`

export const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-gray-100);

  &:last-child { border-bottom: none; padding-bottom: 0; }
`

export const DetailLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gray-400);
`

export const DetailText = styled.p`
  font-size: 0.9rem;
  color: var(--color-gray-700);
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
`

export const FeatureList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;
`

export const FeatureTag = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  background: var(--color-brand-blue-tint);
  color: var(--color-brand-blue-deep);
  border: 1px solid var(--color-brand-blue-tint-strong);
`

export const RewardBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  background: var(--color-brand-green-tint);
  color: var(--color-brand-green-dark);
  margin-right: 0.375rem;
  margin-bottom: 0.375rem;
`
