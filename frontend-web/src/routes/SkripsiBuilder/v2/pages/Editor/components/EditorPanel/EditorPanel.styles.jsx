import styled from 'styled-components'

export const EditorPanel = styled.div`
  flex: 1;
  background: var(--color-surface);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;

  @media (max-width: 768px) {
    min-height: 100vh;
    height: 100vh;
    flex-shrink: 0;
  }
`

export const EditorActions = styled.div`
  display: none;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);

  @media (max-width: 768px) {
    display: flex;
    padding: 0.625rem 0.75rem;
    gap: 0.5rem;
  }
`

export const EditorContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
    height: 100%;
  }

  /* Ensure BlockNote takes full height */
  > div {
    height: 100%;
    flex: 1;
  }

  /* Custom BlockNote theme overrides */
  .bn-editor {
    background: transparent;
  }

  /* Ensure BlockNote content has good spacing */
  .ProseMirror {
    outline: none;
    padding: 0;

    /* Add spacing between blocks */
    > * + * {
      margin-top: 0.5em;
    }
  }

  /* Image styling for BlockNote */
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
`
