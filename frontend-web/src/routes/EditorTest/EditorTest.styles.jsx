import styled from 'styled-components'

export const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem;
`

export const Header = styled.div`
  max-width: 900px;
  margin: 0 auto 2rem;
`

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`

export const EditorWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto 2rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #334155;
    font-size: 1.125rem;
  }

  /* BlockNote editor styling */
  .bn-container {
    min-height: 300px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    transition: border-color 0.2s;

    &:focus-within {
      border-color: #6BB9E8;
    }
  }
`

export const OutputSection = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

export const OutputTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  color: #334155;
  font-size: 1.125rem;
`

export const OutputContent = styled.div`
  background: #1e293b;
  border-radius: 8px;
  padding: 1.5rem;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;

  pre {
    margin: 0;
    color: #94a3b8;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #0f172a;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #475569;
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const ExportButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: linear-gradient(90deg, #6BB9E8, #3b82f6);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(107, 185, 232, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(107, 185, 232, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
