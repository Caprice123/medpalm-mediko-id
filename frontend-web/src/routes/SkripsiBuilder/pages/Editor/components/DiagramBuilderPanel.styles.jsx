import styled from 'styled-components';

export const DiagramBuilderContainer = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    height: ${props => props.$activeSubTab === 'preview' ? '600px' : '100vh'};
    flex-shrink: 0;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
`;

export const SubTabsNav = styled.div`
  display: flex;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const SubTab = styled.button`
  flex: 1;
  padding: 12px 16px;
  background: ${props => props.$active ? 'white' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.$active ? '#06b6d4' : 'transparent'};
  color: ${props => props.$active ? '#06b6d4' : '#6b7280'};
  font-size: 14px;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? 'white' : '#f3f4f6'};
    color: ${props => props.$active ? '#06b6d4' : '#1f2937'};
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 0.8125rem;
  }
`;

// Form Subtab Styles
export const FormContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const FormContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

export const ConfigSection = styled.div`
  overflow: hidden;
`;

export const ConfigHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: #ecfeff;
  border-bottom: 1px solid #06b6d4;
`;

export const ConfigIcon = styled.span`
  font-size: 18px;
`;

export const ConfigTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
`;

export const ConfigBody = styled.div`
  background: white;
`;

export const FormRowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormField = styled.div`
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.8125rem;
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 768px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.8125rem;
    min-height: 100px;
  }
`;

export const TipsBox = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 6px;
  margin-top: 12px;
`;

export const TipsIcon = styled.div`
  font-size: 20px;
  flex-shrink: 0;
`;

export const TipsContent = styled.div`
  flex: 1;

  strong {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    color: #92400e;
  }

  p {
    margin: 4px 0 0 0;
    font-size: 13px;
    color: #78350f;
    line-height: 1.5;
  }
`;

export const GenerateButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(6, 182, 212, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
`;

export const GenerateButtonWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

// History Subtab Styles
export const HistoryContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f9fafb;
`;

export const HistoryHeader = styled.div`
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
`;

export const HistoryTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const HistorySubtitle = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const HistoryList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  align-content: start;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    padding: 12px;
    gap: 10px;
  }
`;

export const HistoryCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: white;
  border: 2px solid ${props => props.$active ? '#06b6d4' : '#e5e7eb'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${props => props.$active ? '0 4px 6px rgba(6, 182, 212, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)'};

  &:hover {
    border-color: #06b6d4;
    box-shadow: 0 4px 6px rgba(6, 182, 212, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 12px;
    gap: 10px;
  }
`;

export const HistoryCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const HistoryIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
`;

export const HistoryCardInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const HistoryCardTitle = styled.h4`
  font-weight: 600;
  font-size: 15px;
  color: #1f2937;
  margin: 0 0 4px 0;
  text-transform: capitalize;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const HistoryCardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
  flex-wrap: wrap;
`;

export const HistoryCardMetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;

  &:not(:last-child)::after {
    content: '•';
    margin-left: 8px;
    color: #d1d5db;
  }
`;

export const HistoryCardDescription = styled.p`
  font-size: 13px;
  color: #4b5563;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const HistoryCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
`;

export const HistoryCardDate = styled.span`
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

export const HistoryCardActions = styled.div`
  display: flex;
  gap: 4px;
`;

export const HistoryCardButton = styled.button`
  padding: 6px 10px;
  background: ${props => props.$primary ? '#06b6d4' : '#f3f4f6'};
  color: ${props => props.$primary ? 'white' : '#6b7280'};
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$primary ? '#0891b2' : '#e5e7eb'};
    transform: translateY(-1px);
  }
`;

export const EmptyHistory = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;

  svg, span {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.3;
  }

  h4 {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    padding: 32px 16px;

    svg, span {
      font-size: 48px;
      margin-bottom: 12px;
    }

    h4 {
      font-size: 16px;
    }

    p {
      font-size: 13px;
    }
  }
`;

// Preview Subtab Styles
export const PreviewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @media (max-width: 768px) {
    max-height: 600px;
  }
`;

export const PreviewToolbar = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    padding: 0.625rem 0.75rem;
    gap: 0.5rem;
  }
`;

export const ToolbarBtn = styled.button`
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${props =>
    props.$variant === 'save' ? '#06b6d4' :
    props.$variant === 'export' ? '#10b981' :
    props.$variant === 'zoom' ? '#8b5cf6' :
    '#6b7280'
  };
  color: white;

  &:hover {
    background: ${props =>
      props.$variant === 'save' ? '#0891b2' :
      props.$variant === 'export' ? '#059669' :
      props.$variant === 'zoom' ? '#7c3aed' :
      '#4b5563'
    };
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
`;

export const ExcalidrawWrapper = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 500px; /* Ensure enough space for zoom controls */

  .excalidraw {
    height: 100% !important;
    width: 100% !important;
  }

  /* Force zoom controls to always be visible */
  .excalidraw .App-toolbar__divider,
  .excalidraw .zoom-container {
    display: flex !important;
  }

  /* Force footer with zoom controls to always show, even on small screens */
  .excalidraw .layer-ui__wrapper__footer-left {
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  /* Override media query that hides footer on small screens */
  @media (max-width: 761px) {
    .excalidraw .layer-ui__wrapper__footer-left {
      display: flex !important;
    }
  }
`;

// Full width canvas for preview (used in Editor panel)
export const DiagramPreviewPanel = styled.div`
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-shrink: 0;
  }
`;
