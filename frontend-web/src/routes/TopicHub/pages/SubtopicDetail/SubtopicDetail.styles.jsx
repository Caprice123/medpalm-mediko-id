import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const Container = styled.div`
  padding: 1.75rem 2rem 4rem;
  animation: ${fadeUp} 0.3s ease both;
`

/* ── Breadcrumb ── */
export const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`

export const BreadcrumbLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: inherit;
  color: #10b981;
  cursor: pointer;
  font-weight: 500;
  &:hover { text-decoration: underline; }
`

export const BreadcrumbSep = styled.span`
  color: #d1d5db;
`

export const BreadcrumbCurrent = styled.span`
  color: #374151;
  font-weight: 500;
`

/* ── Header ── */
export const PageHeader = styled.div`
  margin-bottom: 0.5rem;
`

export const SubtopicName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.375rem;
  line-height: 1.3;
`

export const ProgressLabel = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.5rem;
`

/* ── Video section ── */
export const VideoSection = styled.section`
  margin-bottom: 1.5rem;
`

export const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
`

export const VideoFrame = styled.iframe`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  display: block;
`

/* ── Video explanation ── */
export const ExplanationSection = styled.section`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 2rem;
`

export const SectionLabel = styled.h3`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #10b981;
  margin: 0 0 0.625rem;
`

export const ExplanationText = styled.p`
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #374151;
  margin: 0;
  white-space: pre-wrap;
`

/* ── Pembelajaran terkait ── */
export const RelatedSection = styled.section`
  margin-bottom: 2rem;
`

export const RelatedSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 1rem;
`

export const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export const RelatedCard = styled.button`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem 1.125rem;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;
  opacity: ${({ $locked }) => $locked ? 0.6 : 1};

  &:hover {
    border-color: ${({ $locked }) => $locked ? '#e5e7eb' : '#10b981'};
    box-shadow: ${({ $locked }) => $locked ? 'none' : '0 0 0 3px rgba(16, 185, 129, 0.08)'};
  }
`

export const RelatedIconBox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background: #d1fae5;
  font-size: 1.125rem;
  flex-shrink: 0;
`

export const RelatedInfo = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
`

export const RelatedLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
`

export const RelatedCount = styled.span`
  font-size: 0.8125rem;
  color: #6b7280;
`

export const RelatedAction = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
  flex-shrink: 0;
`

/* ── Atlas 3D section ── */
export const AtlasSection = styled.section`
  margin-bottom: 2rem;
`

export const AtlasSectionSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
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
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.875rem 1rem;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;
  opacity: ${({ $locked }) => $locked ? 0.6 : 1};

  &:hover {
    border-color: ${({ $locked }) => $locked ? '#e5e7eb' : '#10b981'};
    box-shadow: ${({ $locked }) => $locked ? 'none' : '0 0 0 3px rgba(16, 185, 129, 0.08)'};
  }
`

export const AtlasCardIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 8px;
  background: #d1fae5;
  color: #047857;
  font-size: 1rem;
  flex-shrink: 0;
`

export const AtlasCardTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  flex: 1;
  min-width: 0;
  line-height: 1.4;
  text-align: left;
`

export const AtlasCardArrow = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
  flex-shrink: 0;
`

/* ── Prev / Next navigation ── */
export const NavRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`

export const NavButton = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.875rem 1.25rem;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  text-align: ${({ $align }) => $align ?? 'left'};
  flex: 1;
  max-width: 280px;
  ${({ $align }) => $align === 'right' && 'margin-left: auto;'}

  &:hover {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.08);
  }

  &:disabled {
    opacity: 0;
    pointer-events: none;
  }
`

export const NavDirection = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const NavTitle = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
  display: block;
`

/* ── Skeleton ── */
const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 1200px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  border-radius: 8px;
`

export const SkeletonTitle = styled(SkeletonBase)`
  height: 2rem;
  width: 55%;
  margin-bottom: 0.5rem;
`

export const SkeletonSubtitle = styled(SkeletonBase)`
  height: 1rem;
  width: 20%;
  margin-bottom: 1.5rem;
`

export const SkeletonVideo = styled(SkeletonBase)`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  margin-bottom: 1.5rem;
`

export const SkeletonBlock = styled(SkeletonBase)`
  height: 5rem;
  border-radius: 10px;
`
