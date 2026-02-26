import styled from 'styled-components';

export const EmbedContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px 0;
`;

export const EmbedCard = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: white;
  border: 2px solid #6BB9E8;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const TabHeader = styled.div`
  display: flex;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const TabButton = styled.div`
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background-color: #e5e7eb;
  border-top-left-radius: 6px;
`;

export const ContentArea = styled.div`
  padding: 12px 16px;
  position: relative;
`;

export const PlaceholderOverlay = styled.div`
  position: absolute;
  top: 12px;
  left: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px 16px;
  pointer-events: none;
`;

export const PlaceholderIcon = styled.span`
  font-size: 18px;
  opacity: 0.4;
`;

export const PlaceholderText = styled.span`
  font-size: 14px;
  color: #9ca3af;
`;

export const URLInput = styled.input`
  width: 100%;
  padding: 20px 16px;
  margin-bottom: 8px;
  border: none;
  background-color: transparent;
  color: #374151;
  font-size: 14px;
  text-align: center;
  outline: none;
  word-break: break-all;
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
`;

export const CancelButton = styled.button`
  padding: 6px 14px;
  border-radius: 4px;
  border: none;
  background-color: transparent;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: #374151;
  }
`;

export const EmbedButton = styled.button`
  padding: 6px 16px;
  border-radius: 4px;
  border: none;
  background-color: ${props => props.disabled ? '#e5e7eb' : '#111827'};
  color: ${props => props.disabled ? '#9ca3af' : '#ffffff'};
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background-color: #374151;
  }
`;

/* Wrapper that controls the percentage width of the embed */
export const EmbedWrapper = styled.div`
  position: relative;
  width: ${props => props.width || 100}%;
`;

export const IframeContainer = styled.div`
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #000;
  position: relative;
`;

export const IframeElement = styled.iframe`
  width: 100%;
  height: ${props => props.height || 480}px;
  border: none;
  display: block;
`;

export const EditButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    opacity: 1 !important;
  }

  .bn-block-content:hover & {
    opacity: 1;
  }
`;

/* Blocks iframe mouse events during resize */
export const ResizeOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
  cursor: ${props => props.cursor || 'ns-resize'};
`;

/* Left / right width drag handles — absolutely positioned on the edges */
export const WidthHandle = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  ${props => props.side === 'left' ? 'left: -10px;' : 'right: -10px;'}
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ew-resize;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 5;

  .bn-block-content:hover & {
    opacity: 1;
  }

  &::after {
    content: '';
    width: 4px;
    height: 32px;
    border-radius: 2px;
    background-color: rgba(107, 185, 232, 0.7);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    transition: background-color 0.15s;
  }

  &:hover::after {
    background-color: #6BB9E8;
  }
`;

/* Bottom height drag handle */
export const HeightResizeHandle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ns-resize;
  opacity: 0;
  transition: opacity 0.2s;

  .bn-block-content:hover & {
    opacity: 1;
  }

  span {
    width: 32px;
    height: 4px;
    border-radius: 2px;
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: background-color 0.15s;
  }

  &:hover span {
    background-color: #6BB9E8;
  }
`;

/* Size label shown during any resize */
export const SizeLabel = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
`;
