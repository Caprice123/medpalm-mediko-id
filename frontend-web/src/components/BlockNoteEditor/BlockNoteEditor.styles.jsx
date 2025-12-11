import styled from 'styled-components'

export const EditorWrapper = styled.div`
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
