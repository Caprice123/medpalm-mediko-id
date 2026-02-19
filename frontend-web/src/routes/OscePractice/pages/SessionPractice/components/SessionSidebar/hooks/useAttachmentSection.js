import { useState } from 'react'

export const useAttachmentSection = () => {
  const [isShowAttachment, setIsShowAttachment] = useState(false)
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(true)

  const handleThumbnailClick = (index) => {
    setCurrentSliderIndex(index)
    setIsShowAttachment(true)
  }

  const handleSliderNext = (totalImages) => {
    if (currentSliderIndex < totalImages - 1) {
      setIsImageLoading(true)
      setCurrentSliderIndex(prev => prev + 1)
    }
  }

  const handleSliderPrevious = () => {
    if (currentSliderIndex > 0) {
      setIsImageLoading(true)
      setCurrentSliderIndex(prev => prev - 1)
    }
  }

  const handleSliderGoTo = (index) => {
    setIsImageLoading(true)
    setCurrentSliderIndex(index)
  }

  const handleImageLoad = () => {
    setIsImageLoading(false)
  }

  const handleImageLoadStart = () => {
    setIsImageLoading(true)
  }

  return {
    isShowAttachment,
    currentSliderIndex,
    isImageLoading,
    handleThumbnailClick,
    handleSliderNext,
    handleSliderPrevious,
    handleSliderGoTo,
    handleImageLoad,
    handleImageLoadStart,
    setIsShowAttachment,
  }
}
