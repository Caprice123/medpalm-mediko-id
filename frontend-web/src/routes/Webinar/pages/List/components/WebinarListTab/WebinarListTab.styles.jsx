import styled from 'styled-components'

// ─── Filter ────────────────────────────────────────────────────────────────

export const FilterCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

export const FilterField = styled.div``

export const FilterLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
  display: block;
`

export const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`

export const FilterStatusSection = styled.div`
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f3f4f6;
`

export const FilterStatusLabel = styled.p`
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
  margin: 0 0 0.5rem;
`

export const RegistrationFilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const RegistrationFilterTab = styled.button`
  padding: 0.4rem 1rem;
  border-radius: 999px;
  border: 1.5px solid ${({ $active }) => $active ? '#06b6d4' : '#e5e7eb'};
  background: ${({ $active }) => $active ? '#06b6d4' : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#6b7280'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: #06b6d4;
    color: ${({ $active }) => $active ? 'white' : '#06b6d4'};
  }
`

// ─── Webinar grid ──────────────────────────────────────────────────────────

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`

export const WebinarCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
  overflow: hidden;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`

export const Thumbnail = styled.div`
  height: 160px;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  overflow: hidden;
  cursor: ${({ $hasImage }) => $hasImage ? 'zoom-in' : 'default'};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s;
  }

  &:hover img {
    transform: ${({ $hasImage }) => $hasImage ? 'scale(1.04)' : 'none'};
  }
`

export const CardBody = styled.div`
  padding: 1rem 1.25rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
`

export const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.4;
`

export const CardSpeakerName = styled.p`
  font-size: 0.8125rem;
  font-weight: 500;
  color: #4a9cc7;
  margin: 0;
`

export const CardDateText = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
`

export const CardDescText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const CardFooterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #f3f4f6;

  & > * { flex: 1; }
`
