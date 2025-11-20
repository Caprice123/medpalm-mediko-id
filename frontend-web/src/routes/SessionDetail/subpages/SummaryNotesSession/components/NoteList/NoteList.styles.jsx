import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

export const Container = styled.div`
  min-height: 100vh;
  background: #f0fdfa;
  padding: 2rem;
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const Header = styled.div`
  max-width: 1280px;
  margin: 0 auto 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const BackButton = styled.button`
  background: white;
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #0891b2;
  }
`

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #06b6d4;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`

export const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1.05rem;
  margin: 0;
`

export const CreditInfo = styled.div`
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1.125rem;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  white-space: nowrap;

  strong {
    color: white;
    font-weight: 700;
  }
`

export const ContentContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`

export const FilterSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const FilterGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const FilterLabel = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`

export const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  color: #374151;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #06b6d4;
  }

  &:hover {
    border-color: #06b6d4;
  }
`

export const FilterInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  color: #374151;
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #06b6d4;
  }

  &::placeholder {
    color: #9ca3af;
  }
`

export const SearchButton = styled.button`
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  align-self: flex-end;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(6, 182, 212, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

export const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`

export const NoteCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(6, 182, 212, 0.15);
    border-color: #06b6d4;
  }
`

export const NoteHeader = styled.div`
  flex: 1;
`

export const NoteTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #06b6d4;
  margin: 0 0 0.5rem 0;
`

export const NoteDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const Tag = styled.span`
  background: ${props => props.type === 'university' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)'};
  color: ${props => props.type === 'university' ? '#6366f1' : '#10b981'};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`

export const NoteFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`

export const SelectButton = styled.button`
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(6, 182, 212, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: #6b7280;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  p {
    font-size: 1rem;
  }
`

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`

export const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #06b6d4;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem;
`

export const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: ${props => props.active ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #06b6d4;
    color: ${props => props.active ? 'white' : '#06b6d4'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const PaginationInfo = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
  padding: 0 1rem;
`

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

export const ConfirmModal = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  animation: ${fadeIn} 0.2s ease;
`

export const ModalContent = styled.div`
  padding: 2rem;
`

export const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0e7490;
  margin: 0 0 1rem 0;
`

export const ModalText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;

  strong {
    color: #374151;
  }
`

export const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
`

export const ModalButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #06b6d4, #0891b2);
    color: white;
    border: none;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
    }
  ` : `
    background: white;
    color: #6b7280;
    border: 1px solid #e5e7eb;

    &:hover:not(:disabled) {
      background: #f3f4f6;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
