import { useState } from 'react'

export const useAttachmentSection = () => {
  const [attachmentPreviewIndex, setAttachmentPreviewIndex] = useState(0)
  const [isShowAttachment, setIsShowAttachment] = useState(false)
  const [isSlideshowMode, setIsSlideshowMode] = useState(false)
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0)

  const onOpenAttachment = (toggle) => {
    setIsSlideshowMode(toggle)
    if (!toggle) {
      setCurrentSliderIndex(0)
    }
  }

  const handleAttachmentPreviewIndex = (index) => {
    setAttachmentPreviewIndex(index)
    setCurrentSliderIndex(index)
  }

  const handleThumbnailClick = (index) => {
    setAttachmentPreviewIndex(index)
    setCurrentSliderIndex(index)
    setIsShowAttachment(true)
  }

  const handleSliderNext = (totalImages) => {
    if (currentSliderIndex < totalImages - 1) {
      const newIndex = currentSliderIndex + 1
      setCurrentSliderIndex(newIndex)
      setAttachmentPreviewIndex(newIndex)
    }
  }

  const handleSliderPrevious = () => {
    if (currentSliderIndex > 0) {
      const newIndex = currentSliderIndex - 1
      setCurrentSliderIndex(newIndex)
      setAttachmentPreviewIndex(newIndex)
    }
  }

  const handleSliderGoTo = (index) => {
    setCurrentSliderIndex(index)
    setAttachmentPreviewIndex(index)
  }

  return {
    attachmentPreviewIndex,
    isShowAttachment,
    isSlideshowMode,
    currentSliderIndex,
    onOpenAttachment,
    handleAttachmentPreviewIndex,
    handleThumbnailClick,
    handleSliderNext,
    handleSliderPrevious,
    handleSliderGoTo,
    setIsShowAttachment,
  }
}
