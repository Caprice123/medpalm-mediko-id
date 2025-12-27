import styled from 'styled-components'

export const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const ModeToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  background: white;
  border-radius: 8px;
  padding: 0.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: fit-content;
  margin-left: auto;
`

export const ModeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: ${props => props.$active ? '#3b82f6' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#6b7280'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#2563eb' : '#f3f4f6'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

export const EditorWrapper = styled.div`
  position: relative;
  background: ${props => props.$isStructured
    ? `
      linear-gradient(to right, hsl(215.4 16.3% 46.9% / 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, hsl(215.4 16.3% 46.9% / 0.1) 1px, transparent 1px)
    `
    : '#f5f5f5'
  };
  background-size: ${props => props.$isStructured ? '24px 24px' : 'auto'};
  background-position: ${props => props.$isStructured ? '-1px -1px' : '0 0'};
  border-radius: 12px;
  padding: ${props => props.$isStructured ? '1rem 0' : '0'};
  min-height: 400px;

  /* Structured mode - ensure all BlockNote elements are transparent to show grid */
  ${props => props.$isStructured && `
    .bn-container,
    .bn-editor,
    .bn-block-group,
    .ProseMirror {
      background: transparent !important;
    }
  `}

  /* Aesthetic mode - white container with shadow */
  ${props => !props.$isStructured && `
    .bn-container,
    .bn-editor,
    .bn-block-group {
      background: white !important;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .ProseMirror {
      background: white !important;
      padding: 3rem;
    }
  `}

  /* Add subtle padding to blocks in structured mode */
  .bn-block-outer {
    padding: ${props => props.$isStructured ? '0.5rem 0' : '0.5rem 0'};
  }

  /* Aesthetic mode styling - handwritten font for headings */
  ${props => !props.$isStructured && `
    /* Headings with yellow highlight */
    .bn-block-content[data-content-type="heading"] {
      font-family: 'Pacifico', cursive;
      color: #1e293b;
      background: linear-gradient(180deg, transparent 50%, #fef08a 50%);
      display: inline;
      padding: 0 0.25rem;
      line-height: 1.8;
    }

    .bn-block-content {
      font-family: 'Patrick Hand', cursive;
      color: #334155;
      font-size: 1.05rem;
      line-height: 1.8;
    }

    /* Green circular bullets for list items */
    .bn-block-content[data-content-type="bulletListItem"] {
      position: relative;
      padding-left: 0.5rem;
    }

    .bn-block-content[data-content-type="bulletListItem"]::before {
      content: '●';
      color: #10b981;
      position: absolute;
      left: -1.25rem;
      font-size: 0.75rem;
    }
  `}
`
