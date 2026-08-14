import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  min-height: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.75rem;
`

export const ImageBox = styled.div`
  position: relative;
  width: 100%;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  line-height: 0;
`

export const RegionOverlay = styled.div`
  position: absolute;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8125rem;
  line-height: normal;
  text-align: center;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.15s;

  ${p => p.$revealed
    ? `
      background: rgba(0, 0, 0, 0.15);
      border: 2px solid #22c55e;
      color: #15803d;
      cursor: default;
    `
    : `
      background: #6BB9E8;
      border: 2px solid #3a8fc9;
      color: white;

      &:hover { background: #5aa8d9; }
    `}
`

export const AnswerLabel = styled.div`
  position: absolute;
  box-sizing: border-box;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
  background: linear-gradient(135deg, #0d9488 0%, #059669 100%);
  color: #fff;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  text-align: center;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  pointer-events: none;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`

export const RevealButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #0d9488;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover { opacity: 0.9; }
`
