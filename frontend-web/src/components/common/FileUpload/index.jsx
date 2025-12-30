import React, { useRef } from 'react'
import { formatFileSize, getFileIcon } from '@utils/fileUtils'
import {
  UploadSection,
  UploadArea,
  UploadIcon,
  UploadText,
  ExistingFileInfo,
  FileIcon,
  FileName,
  RemoveButton,
  ActionsContainer
} from './FileUpload.styles'

/**
 * Reusable File Upload Component
 * @param {Object} props
 * @param {File|Object} props.file - Uploaded file object {name, type, size, url}
 * @param {Function} props.onFileSelect - Callback when file is selected
 * @param {Function} props.onRemove - Callback to remove file
 * @param {React.ReactNode} props.actions - Action buttons as JSX components
 * @param {Array} props.acceptedTypes - Array of accepted MIME types
 * @param {string} props.acceptedTypesLabel - Label for accepted types (e.g., "PDF, PPTX, DOCX")
 * @param {number} props.maxSizeMB - Maximum file size in MB
 * @param {boolean} props.isUploading - Upload loading state
 * @param {string} props.uploadText - Custom upload area text
 */
const FileUpload = ({
  file,
  onFileSelect,
  onRemove,
  actions,
  acceptedTypes = [],
  acceptedTypesLabel = 'All files',
  maxSizeMB = 50,
  isUploading = false,
  uploadText = 'Click to upload file'
}) => {
    const ref = useRef(null)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && onFileSelect) {
      onFileSelect(selectedFile)
    }
    // Reset input to allow re-selecting the same file
    e.target.value = ''
  }

  const acceptString = acceptedTypes.length > 0 ? acceptedTypes.join(',') : '*'

  return (
    <UploadSection>
      {!file ? (
        <UploadArea onClick={() => ref.current.click()}>
          <input
            ref={ref}
            id="file-upload-input"
            type="file"
            accept={acceptString}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <UploadIcon>📤</UploadIcon>
          <UploadText>
            {isUploading ? 'Uploading...' : uploadText}
          </UploadText>
          <UploadText style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
            {acceptedTypesLabel} (max {maxSizeMB}MB)
          </UploadText>
        </UploadArea>
      ) : (
        <ExistingFileInfo>
          <FileIcon>{getFileIcon(file.type)}</FileIcon>
          <div style={{ flex: 1 }}>
            <FileName>{file.name}</FileName>
            {file.size && (
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                {formatFileSize(file.size)}
              </div>
            )}
          </div>
          <ActionsContainer>
            {actions}
            {onRemove && (
              <RemoveButton onClick={onRemove}>Hapus</RemoveButton>
            )}
          </ActionsContainer>
        </ExistingFileInfo>
      )}
    </UploadSection>
  )
}

export default FileUpload
