import styled from 'styled-components'

export const Container = styled.div`
  min-height: calc(100vh - 63px);
  background: #f0fdfa;
  padding: 3rem 1.5rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(107, 185, 232, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(107, 185, 232, 0.06) 0%, transparent 50%);
    pointer-events: none;
  }
`

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`

export const NoteContainer = styled.div`
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(107, 185, 232, 0.08);
  border: 2px solid transparent;
  animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #6BB9E8, #3b82f6);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const NoteHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f1f5f9;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #6BB9E8, #3b82f6);
  }
`

export const NoteTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6BB9E8, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  flex: 1;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const NoteDescription = styled.p`
  color: #64748b;
  font-size: 1rem;
  line-height: 1.7;
  margin: 0 0 1.5rem 0;
`

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.875rem;
  background: ${props => {
    if (props.university) return '#dbeafe';
    if (props.semester) return '#d1fae5';
    return '#ede9fe';
  }};
  color: ${props => {
    if (props.university) return '#1e40af';
    if (props.semester) return '#065f46';
    return '#5b21b6';
  }};
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`

export const ContentSection = styled.div`
  margin-top: 2rem;

  .bn-container {
    border: none;
    padding: 0;
  }
`

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(107, 185, 232, 0.2);
  border-top: 4px solid #6BB9E8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
