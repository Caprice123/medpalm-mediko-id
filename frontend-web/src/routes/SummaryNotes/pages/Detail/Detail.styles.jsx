import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  min-height: calc(100vh - 90px);
  background: #f0fdfa;
  padding: 3rem 1.5rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(107, 185, 232, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(107, 185, 232, 0.06) 0%, transparent 50%);
    pointer-events: none;
  }
`

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`

export const NoteContainer = styled.div`
  background: ${colors.background.paper};
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const NoteHeader = styled.div`
  background: ${colors.background.paper};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  position: relative;
`

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const TopicInfo = styled.div`
  margin-bottom: 1rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${colors.primary.main};
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    color: ${colors.text.secondary};
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.6;
  }
`

export const NoteTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.primary.main};
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`

export const NoteDescription = styled.p`
  color: ${colors.text.secondary};
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.6;
`

export const BackButton = styled.button`
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;

  ${props => props.university && `
    background: #EFF6FF;
    color: ${colors.primary.dark};
    border: 1px solid ${colors.primary.main};
  `}

  ${props => props.semester && `
    background: #ECFDF5;
    color: ${colors.success.dark};
    border: 1px solid ${colors.success.main};
  `}

  ${props => props.topic && `
    background: #FEF3C7;
    color: #92400e;
    border: 1px solid #f59e0b;
  `}

  ${props => props.department && `
    background: #FCE7F3;
    color: #9f1239;
    border: 1px solid #ec4899;
  `}
`

export const ContentSection = styled.div`
  margin-top: 2rem;

  .bn-container {
    border: none;
    padding: 0;
  }
`

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(107, 185, 232, 0.2);
  border-top: 4px solid #6BB9E8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export const ReferenceSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
`

export const ReferenceTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const LinkedResourcesSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
`

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const ToggleButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`

export const ToggleButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid ${props => props.active ? colors.primary.main : '#e5e7eb'};
  background: ${props => props.active ? colors.primary.main : 'white'};
  color: ${props => props.active ? 'white' : colors.text.secondary};

  &:hover:not(:disabled) {
    border-color: ${colors.primary.main};
    background: ${props => props.active ? colors.primary.dark : colors.primary.light};
    color: ${props => props.active ? 'white' : colors.primary.main};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const ResourceDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const ResourceStats = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
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

export const ModeButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.75rem;
`
