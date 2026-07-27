import styled from 'styled-components'

export const PageRoot = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const VideoEl = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`

/* Tiled diagonal watermark grid covering the full video */
export const WatermarkGrid = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  user-select: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(6, 1fr);
  z-index: 10;
`

export const WatermarkText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9375rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.13);
  transform: rotate(-30deg);
  letter-spacing: 0.05em;
  font-family: Arial, sans-serif;
`
