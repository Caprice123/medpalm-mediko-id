import styled from 'styled-components'
import { colors } from '@config/colors'

export const FormSection = styled.div`
  margin-bottom: 1.5rem;

  .file-upload-section {
    margin-bottom: 0;
    width: 100%;
  }
  
  .file-input {
    margin-bottom: 1rem;
  }
`

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.neutral.gray800};
  margin-bottom: 0.5rem;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid ${colors.neutral.gray300};
  border-radius: 6px;
  font-size: 0.875rem;
  color: ${colors.neutral.gray800};

  &:focus {
    outline: none;
    border-color: ${colors.osce.primary};
    box-shadow: 0 0 0 3px ${colors.osce.primaryLight};
  }

  &::placeholder {
    color: ${colors.neutral.gray400};
  }
`

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid ${colors.neutral.gray300};
  border-radius: 6px;
  font-size: 0.875rem;
  color: ${colors.neutral.gray800};
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${colors.osce.primary};
    box-shadow: 0 0 0 3px ${colors.osce.primaryLight};
  }

  &::placeholder {
    color: ${colors.neutral.gray400};
  }
`

export const Select = styled.select`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid ${colors.neutral.gray300};
  border-radius: 6px;
  font-size: 0.875rem;
  color: ${colors.neutral.gray800};
  background: ${colors.neutral.white};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${colors.osce.primary};
    box-shadow: 0 0 0 3px ${colors.osce.primaryLight};
  }
`

export const StatusToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  background: ${colors.neutral.gray100};
  border-radius: 6px;
  width: fit-content;
`

export const StatusOption = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  background: ${props => props.active ? colors.neutral.white : 'transparent'};
  color: ${props => props.active ? colors.osce.primary : colors.neutral.gray500};
  box-shadow: ${props => props.active ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};

  &:hover {
    background: ${props => props.active ? colors.neutral.white : colors.neutral.gray200};
  }
`

export const Button = styled.button`
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'primary' && `
    background: ${colors.osce.primary};
    color: ${colors.neutral.white};
    border: 1px solid ${colors.osce.primary};

    &:hover {
      background: ${colors.osce.primaryHover};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: ${colors.neutral.white};
    color: ${colors.neutral.gray500};
    border: 1px solid ${colors.neutral.gray300};

    &:hover {
      background: ${colors.neutral.gray50};
    }
  `}
`

export const HelpText = styled.p`
  font-size: 0.75rem;
  color: ${colors.neutral.gray500};
  margin: 0.25rem 0 0.5rem 0;
  line-height: 1.4;
`

export const ErrorText = styled.p`
  font-size: 0.75rem;
  color: ${colors.error.main};
  margin: 0.25rem 0 0 0;
`

export const ModelBadge = styled.span`
  display: inline-block;
  margin-top: 0.5rem;
  background: ${colors.osce.primaryLight};
  color: ${colors.osce.primary};
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`

export const AttachmentsSection = styled.div`
  margin-top: 0.5rem;
`

export const AttachmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

export const DragHandle = styled.div`
  cursor: grab;
  padding: 0.5rem;
  color: ${colors.neutral.gray400};
  font-size: 1.25rem;
  font-weight: bold;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    cursor: grabbing;
  }

  &:hover {
    color: ${colors.neutral.gray600};
  }
`

export const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${colors.neutral.gray50};
  border: 1px solid ${colors.neutral.gray200};
  border-radius: 6px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`

export const AttachmentPreview = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid ${colors.neutral.gray300};
`

export const AttachmentInfo = styled.div`
  flex: 1;
  min-width: 0;

  div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export const RemoveAttachmentButton = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: ${colors.error.main};
  color: white;
  border-radius: 4px;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${colors.error.dark};
  }
`

export const UploadButton = styled.button`
  padding: 0.625rem 1.25rem;
  border: 1px dashed ${colors.osce.primary};
  background: ${colors.osce.primaryLight};
  color: ${colors.osce.primary};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${colors.osce.primary};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
