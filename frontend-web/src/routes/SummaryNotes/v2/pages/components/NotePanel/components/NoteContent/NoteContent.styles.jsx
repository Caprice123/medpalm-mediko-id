import styled from 'styled-components'

export const NoteTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
`

export const NoteDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
  line-height: 1.6;
`

export const EditorWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .bn-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .bn-editor {
    flex: 1;
  }
  @media (max-width: 768px) {
    min-height: 100vh;
  }
`
