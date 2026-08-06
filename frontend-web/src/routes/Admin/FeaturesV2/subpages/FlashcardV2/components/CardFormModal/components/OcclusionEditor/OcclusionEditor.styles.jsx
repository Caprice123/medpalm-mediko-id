import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const FieldLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  display: block;
`

export const HintText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
`

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  cursor: crosshair;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
  user-select: none;
  line-height: 0;
`

export const RegionBox = styled.div`
  position: absolute;
  border: 2px solid ${p => (p.$drawing ? '#3b82f6' : '#ef4444')};
  background: ${p => (p.$drawing ? 'rgba(59, 130, 246, 0.18)' : 'rgba(239, 68, 68, 0.18)')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #b91c1c;
  pointer-events: none;
`

export const RegionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const RegionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  > span {
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #ef4444;
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
  }

  > div {
    flex: 1;
  }
`
