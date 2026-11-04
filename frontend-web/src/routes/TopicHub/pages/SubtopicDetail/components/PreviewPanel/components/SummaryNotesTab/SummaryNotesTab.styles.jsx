import styled from 'styled-components'

export const NoteItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  padding: 0.75rem 0.875rem;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: var(--color-brand-blue);
    background: var(--color-brand-blue-tint);
  }
`

export const NoteIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  background: var(--color-brand-blue-tint);
  font-size: 0.875rem;
  flex-shrink: 0;
`

export const NoteInfo = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
`

export const NoteTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-gray-900);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const NoteReadTime = styled.span`
  font-size: 0.75rem;
  color: var(--color-gray-500);
`

export const NoteExtLink = styled.span`
  font-size: 0.875rem;
  color: var(--color-gray-400);
  flex-shrink: 0;
`

export const NoteDetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-gray-200);
`

export const OpenFullBtn = styled.a`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-brand-blue);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  &:hover { background: var(--color-brand-blue-tint); }
`

export const NoteDetailTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0.75rem 0 0;
  line-height: 1.4;
`

export const NoteEditorWrap = styled.div`
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--color-gray-700);
  margin-top: 0.75rem;

  /* keep BlockNote content from overflowing the narrow panel */
  .bn-editor {
    padding: 0 !important;
  }
  img {
    max-width: 100%;
    height: auto;
  }
`
