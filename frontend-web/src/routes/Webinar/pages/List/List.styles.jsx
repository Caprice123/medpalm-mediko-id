import styled from 'styled-components'

// ─── Page layout ───────────────────────────────────────────────────────────

export const PageWrapper = styled.div`
  min-height: calc(100vh - 90px);
  background: #f0fdfa;
`

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) { padding: 1.5rem; }
  @media (max-width: 640px) { padding: 1.25rem; }
`

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #06b6d4;
  margin-bottom: 0.5rem;
`

export const PageSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.05rem;
  margin-bottom: 2rem;
`

// ─── Tabs ──────────────────────────────────────────────────────────────────

export const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 1.75rem;
`

export const TabBtn = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  background: none;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ $active }) => $active ? '#06b6d4' : '#6b7280'};
  border-bottom: 2px solid ${({ $active }) => $active ? '#06b6d4' : 'transparent'};
  margin-bottom: -2px;
  cursor: pointer;
  transition: color 0.15s;

  &:hover { color: #06b6d4; }
`

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
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #f3f4f6;
`

// ─── Detail modal content ──────────────────────────────────────────────────

export const DetailModalThumb = styled.img`
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  cursor: zoom-in;
`

export const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;

  &:last-child { border-bottom: none; padding-bottom: 0; }
`

export const DetailLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
`

export const DetailText = styled.p`
  font-size: 0.9rem;
  color: #374151;
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
`

export const SpeakerEntry = styled.div`
  margin-top: 0.375rem;
`

export const SpeakerName = styled.p`
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.125rem;
`

export const SuitableList = styled.ul`
  margin: 0.25rem 0 0;
  padding-left: 1.25rem;
`

export const SuitableItem = styled.li`
  font-size: 0.9rem;
  color: #374151;
  line-height: 1.6;
`

// ─── Registration list ──────────────────────────────────────────────────────

export const RegCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  margin-bottom: 0.75rem;

  @media (max-width: 480px) { flex-direction: column; }
`

export const RegInfo = styled.div`
  flex: 1;
`

export const RegTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.2rem;
`

export const RegMeta = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
`

export const StatusBadge = styled.span`
  flex-shrink: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  background: ${({ $s }) =>
    $s === 'approved' ? '#dcfce7' :
    $s === 'rejected' ? '#fee2e2' : '#fef9c3'};
  color: ${({ $s }) =>
    $s === 'approved' ? '#16a34a' :
    $s === 'rejected' ? '#dc2626' : '#854d0e'};
`

export const EvidenceLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;
`

export const EvidenceLink = styled.a`
  font-size: 0.75rem;
  color: #2563eb;
  text-decoration: none;
  padding: 0.2rem 0.5rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 4px;

  &:hover { background: #dbeafe; }
`

export const JoinLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`

export const JoinLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: white;
  text-decoration: none;
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  transition: opacity 0.15s;

  &:hover { opacity: 0.88; }
`

export const AdminNote = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0.375rem 0 0;
  font-style: italic;
`

// ─── Evidence upload list ───────────────────────────────────────────────────

export const UploadedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
`

export const UploadedItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.8125rem;
  color: #374151;
`

export const UploadError = styled.p`
  color: #dc2626;
  font-size: 0.8125rem;
  margin: 0.5rem 0 0;
`
