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
  animation: ${fadeIn} 0.3s ease;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
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
    color: #10b981;
  }
`

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #059669;
  margin: 0;
`

export const HeaderButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`

export const ActionButton = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  color: white;

  ${props => props.variant === 'settings' ? `
    background: linear-gradient(135deg, #64748b, #475569);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(100, 116, 139, 0.4);
    }
  ` : props.variant === 'tag' ? `
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
    }
  ` : `
    background: linear-gradient(135deg, #10b981, #059669);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
    }
  `}
`

export const AddButton = styled.button`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }
`

export const FilterSection = styled.div`
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
`

export const FilterTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`

export const FilterGroup = styled.div``

export const FilterLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
`

export const FilterInput = styled.input`
  width: 100%;
  padding: 0.625rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
  }
`

export const FilterSelect = styled.select`
  width: 100%;
  padding: 0.625rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
  }
`

export const ClearButton = styled.button`
  padding: 0.625rem 1rem;
  background: transparent;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-end;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
`

export const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

export const NoteCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(5, 150, 105, 0.15);
    border-color: #10b981;
  }
`

export const NoteTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #059669;
  margin: 0 0 0.5rem 0;
`

export const NoteDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const NoteStatus = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  margin-bottom: 0.75rem;

  ${props => props.status === 'published' ? `
    background: #d1fae5;
    color: #059669;
  ` : `
    background: #fef3c7;
    color: #92400e;
  `}
`

export const NoteMeta = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.5rem;
`

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`

export const Tag = styled.span`
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background: ${props => props.type === 'university' ? '#dbeafe' : props.type === 'semester' ? '#fef3c7' : '#f3f4f6'};
  color: ${props => props.type === 'university' ? '#1e40af' : props.type === 'semester' ? '#92400e' : '#6b7280'};
`

export const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`

export const CardActionButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.variant === 'danger' ? `
    background: white;
    border: 1px solid #fca5a5;
    color: #dc2626;

    &:hover {
      background: #fef2f2;
    }
  ` : `
    background: white;
    border: 1px solid #e5e7eb;
    color: #6b7280;

    &:hover {
      background: #f3f4f6;
    }
  `}
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;

  h3 {
    color: #374151;
    margin-bottom: 0.5rem;
  }
`

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #d1fae5;
  border-top: 4px solid #10b981;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 4rem auto;
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

export const DeleteConfirmModal = styled.div`
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
  color: #dc2626;
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

  ${props => props.variant === 'danger' ? `
    background: #dc2626;
    color: white;
    border: none;

    &:hover:not(:disabled) {
      background: #b91c1c;
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
