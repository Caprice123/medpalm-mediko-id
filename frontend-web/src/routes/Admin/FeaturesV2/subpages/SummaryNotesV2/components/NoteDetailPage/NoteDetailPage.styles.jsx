import styled from 'styled-components'

export const TabBar = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e5e7eb;
  flex-shrink: 0;
`

export const Tab = styled.button`
  padding: 0.625rem 1.125rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${p => p.$active ? '#0d9488' : '#6b7280'};
  border: none;
  border-bottom: 2px solid ${p => p.$active ? '#0d9488' : 'transparent'};
  background: none;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -2px;

  &:hover {
    color: #0d9488;
  }
`

export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 0;
`

export const FormSection = styled.div`
  margin-bottom: 1.5rem;
`

export const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.375rem;
`

export const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.8125rem;
  margin-top: 0.375rem;
`

export const StatusToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  background: #f1f5f9;
  border-radius: 8px;
`

export const StatusOption = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s;
  color: ${p => p.$checked ? '#0ea5e9' : '#64748b'};
  background: ${p => p.$checked ? 'white' : 'transparent'};
  box-shadow: ${p => p.$checked ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};

  &:hover {
    color: ${p => p.$checked ? '#0ea5e9' : '#475569'};
  }

  input[type='radio'] {
    display: none;
  }
`

export const EditorContainer = styled.div`
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  min-height: 400px;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: #6BB9E8;
  }

  .bn-container {
    min-height: 400px;
  }
`

export const EditorHint = styled.p`
  color: #64748b;
  font-size: 0.8125rem;
  margin-bottom: 0.5rem;
  line-height: 1.5;

  strong {
    color: #334155;
    font-weight: 600;
  }
`

export const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.5rem;
`

/* Inline folder picker */

export const FolderPickerWrap = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  background: #f9fafb;
`

export const FolderPickerEmpty = styled.p`
  color: #9ca3af;
  font-size: 0.875rem;
  text-align: center;
  padding: 3rem 1.5rem;
  margin: 0;
`

export const FolderStatusRow = styled.div`
  padding: 0.75rem 1rem;
  background: white;
  border-top: 1px solid #e5e7eb;
  font-size: 0.8125rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const PickerNode = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem 0.5rem ${p => 1 + p.$depth * 1.25}rem;
  cursor: pointer;
  background: ${p => p.$linked ? '#f0fdf4' : 'transparent'};
  border-left: 3px solid ${p => p.$linked ? '#16a34a' : 'transparent'};
  transition: background 0.1s;
  &:hover { background: ${p => p.$linked ? '#dcfce7' : '#f1f5f9'}; }
`

export const PickerChevron = styled.span`
  font-size: 0.6rem;
  color: #9ca3af;
  width: 0.875rem;
  flex-shrink: 0;
  transform: ${p => p.$open ? 'rotate(90deg)' : 'none'};
  transition: transform 0.15s;
  display: inline-block;
`

export const PickerIcon = styled.span`
  font-size: 0.875rem;
  flex-shrink: 0;
`

export const PickerName = styled.span`
  font-size: 0.875rem;
  color: #374151;
  flex: 1;
`

export const PickerCheck = styled.span`
  font-size: 0.875rem;
  color: #16a34a;
  font-weight: 700;
  flex-shrink: 0;
`

/* ── Konten Terkait ── */

export const RelationSection = styled.div`
  margin-bottom: 2rem;
`

export const RelationSectionTitle = styled.h4`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const RelationSectionCount = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 99px;
  background: #ccfbf1;
  color: #0f766e;
`

export const ContentCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
`

export const ContentCard = styled.button`
  background: ${p => p.$linked ? '#f0fdfa' : 'white'};
  border: 2px solid ${p => p.$linked ? '#0d9488' : '#e5e7eb'};
  border-radius: 8px;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
  position: relative;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;

  &:hover:not(:disabled) {
    border-color: #0d9488;
    box-shadow: 0 2px 8px rgba(13,148,136,0.12);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const ContentCardLinkedBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #0d9488;
  color: white;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 99px;
`

export const ContentCardTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  padding-right: 3.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const ContentCardDescription = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const ContentCardMeta = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 0.625rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.25rem;
`

export const ContentCardStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`

export const ContentCardStatLabel = styled.span`
  font-size: 0.6875rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.04em;
`

export const ContentCardStatValue = styled.span`
  font-size: 0.875rem;
  color: #374151;
  font-weight: 700;
`

export const EmptyHint = styled.p`
  font-size: 0.8125rem;
  color: #9ca3af;
  margin: 0;
`
