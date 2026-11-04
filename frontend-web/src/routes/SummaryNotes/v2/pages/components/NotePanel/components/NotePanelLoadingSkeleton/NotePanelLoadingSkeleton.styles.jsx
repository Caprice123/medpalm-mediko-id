import styled from 'styled-components'

export const SkeletonShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface-reader);

  .react-loading-skeleton {
    --base-color: var(--color-gray-200);
    --highlight-color: var(--color-gray-100);
    line-height: 1;
  }
`

export const SkeletonToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-gray-200);
`

export const SkeletonCrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const SkeletonActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

export const CrumbSeparator = styled.span`
  font-size: 0.8125rem;
  color: var(--color-gray-300);
`

// Mirrors ReaderLayout so the skeleton's text column lands in the same place the
// real article will — otherwise the whole page appears to jump sideways on load.
export const SkeletonLayout = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 13.75rem;
  gap: 2.5rem;
  padding: 2rem 2.5rem;

  @media (max-width: 1279px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }

  @media (max-width: 768px) {
    padding: 1.25rem 1rem;
  }
`

export const SkeletonArticle = styled.div`
  min-width: 0;
`

export const SkeletonMetaRow = styled.div`
  display: flex;
  gap: 0.875rem;
  margin: 0.625rem 0 1.5rem;
`

export const SkeletonLede = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.75rem;
  padding-left: 1rem;
  border-left: 3px solid var(--color-gray-200);
`

export const SkeletonParagraph = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-bottom: 1.75rem;
`

export const SkeletonHeading = styled.div`
  margin-bottom: 0.875rem;
`

export const SkeletonBulletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
  padding-left: 1.25rem;
`

export const SkeletonBullet = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`

export const SkeletonToc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding-left: 0.875rem;
  border-left: 1px solid var(--color-gray-200);

  @media (max-width: 1279px) {
    display: none;
  }
`
