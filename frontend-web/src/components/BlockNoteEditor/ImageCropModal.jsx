import { useState, useRef } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import styled from 'styled-components'

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  flex-direction: column;
  z-index: 10000;
  animation: fadeIn 0.2s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const Header = styled.div`
  padding: 1rem 1.5rem;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h3`
  margin: 0;
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
`

const CropContainer = styled.div`
  position: relative;
  flex: 1;
  background: #000;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 2rem;
`

const Controls = styled.div`
  padding: 1.5rem;
  background: #1a1a1a;
  border-top: 1px solid #333;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const Label = styled.label`
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 80px;
`

const SliderContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
`

const Slider = styled.input`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #374151;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #2563eb;
      transform: scale(1.1);
    }
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: none;
    transition: all 0.2s;

    &:hover {
      background: #2563eb;
      transform: scale(1.1);
    }
  }
`

const SliderValue = styled.span`
  color: #e5e7eb;
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 50px;
  text-align: right;
`

const AspectRatioButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex: 1;
`

const AspectButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.$active ? '#3b82f6' : '#374151'};
  border-radius: 6px;
  background: ${props => props.$active ? '#3b82f6' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#9ca3af'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#2563eb' : '#1f2937'};
    border-color: ${props => props.$active ? '#2563eb' : '#4b5563'};
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 0.5rem;
  border-top: 1px solid #374151;
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$primary ? '#3b82f6' : '#374151'};
  color: white;

  &:hover {
    background: ${props => props.$primary ? '#2563eb' : '#4b5563'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 2rem 3rem;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 10001;
`

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid #374151;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const ASPECT_RATIOS = [
  { label: 'Free', value: undefined },
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '1:1', value: 1 },
  { label: '3:4', value: 3 / 4 },
]

export default function ImageCropModal({ imageUrl, onSave, onCancel }) {
  const imgRef = useRef(null)
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const [isProcessing, setIsProcessing] = useState(false)

  const createCroppedImage = async () => {
    try {
      setIsProcessing(true)

      const image = imgRef.current
      const crop = completedCrop

      if (!image || !crop) {
        throw new Error('No image or crop data')
      }

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      canvas.width = crop.width * scaleX
      canvas.height = crop.height * scaleY

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      )

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error('Canvas is empty')
            return
          }
          const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' })
          resolve(file)
        }, 'image/jpeg', 0.95)
      })
    } catch (error) {
      console.error('Error creating cropped image:', error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSave = async () => {
    try {
      const croppedFile = await createCroppedImage()
      onSave(croppedFile)
    } catch (error) {
      console.error('Failed to crop image:', error)
      alert('Failed to crop image. Please try again.')
    }
  }

  return (
    <Modal onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <Header>
        <Title>Crop Image</Title>
      </Header>

      <CropContainer>
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Crop"
            crossOrigin="anonymous"
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              display: 'block',
            }}
          />
        </ReactCrop>
      </CropContainer>

      <Controls>
        <ActionButtons>
          <Button onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button $primary onClick={handleSave} type="button" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Apply Crop'}
          </Button>
        </ActionButtons>
      </Controls>

      {isProcessing && (
        <LoadingOverlay>
          <Spinner />
          Processing image...
        </LoadingOverlay>
      )}
    </Modal>
  )
}
