import styled from 'styled-components'

export const AtlasSection = styled.section`
  margin-bottom: 2rem;
`

export const AtlasSectionSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin: 0.25rem 0 1rem;
`

export const AtlasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`

export const AtlasCard = styled.button`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  background: #fff;
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  padding: 0.875rem 1rem;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;
  opacity: ${({ $locked }) => $locked ? 0.6 : 1};

  &:hover {
    border-color: ${({ $locked }) => $locked ? 'var(--color-gray-200)' : 'var(--color-brand-blue)'};
    box-shadow: ${({ $locked }) => $locked ? 'none' : '0 0 0 3px rgba(30, 115, 170, 0.08)'};
  }
`

export const AtlasCardIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 8px;
  background: var(--color-brand-blue-tint);
  color: var(--color-brand-blue-deep);
  font-size: 1rem;
  flex-shrink: 0;
`

export const AtlasCardTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-900);
  flex: 1;
  min-width: 0;
  line-height: 1.4;
  text-align: left;
`

export const AtlasCardArrow = styled.span`
  font-size: 0.875rem;
  color: var(--color-gray-400);
  flex-shrink: 0;
`
