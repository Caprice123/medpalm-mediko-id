import React, { useRef, useState } from 'react'
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

const FileUpload = ({
  file,
  onFileSelect,
  onRemove,
  actions,
  acceptedTypes = [],
  acceptedTypesLabel = 'All files',
  maxSizeMB = 50,
  isUploading = false,
  uploadText = 'Click to upload file',
  multiple = false
}) => {
  const ref = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = async (e) => {
    let selectedFile = multiple ? e.target.files : e.target.files[0]
    if (selectedFile && onFileSelect) await onFileSelect(selectedFile)
    e.target.value = ''
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = multiple ? e.dataTransfer.files : e.dataTransfer.files[0]
    if (dropped && onFileSelect) await onFileSelect(dropped)
  }

  const acceptString = acceptedTypes.length > 0 ? acceptedTypes.join(',') : '*'

  return (
    <UploadSection className="file-upload-section">
      {!file ? (
        <UploadArea
          className="file-input"
          $isDragging={isDragging}
          onClick={() => !isUploading && ref.current.click()}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={ref}
            id="file-upload-input"
            type="file"
            accept={acceptString}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            multiple={multiple}
          />
          <UploadIcon>📤</UploadIcon>
          <UploadText>
            {isUploading ? 'Uploading...' : isDragging ? 'Lepaskan file di sini' : uploadText}
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
