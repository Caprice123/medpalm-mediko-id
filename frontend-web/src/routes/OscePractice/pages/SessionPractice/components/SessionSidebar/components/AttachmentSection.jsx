import { memo } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { FaChevronLeft, FaChevronRight, FaEye, FaSpinner } from 'react-icons/fa'
import { useAttachmentSection } from '../hooks/useAttachmentSection'
import {
  AttachmentContainer,
  SliderContainer,
  MainImageContainer,
  MainImageWrapper,
  MainImage,
  ImageLoadingOverlay,
  LoadingSpinnerIcon,
  MainImageOverlay,
  SliderControls,
  SliderButton,
  SliderInfo,
  SliderCounter,
  SliderDots,
  Dot,
} from './AttachmentSection.styles'
import { useSelector } from 'react-redux'

export const AttachmentSection = memo(function AttachmentSection() {
  const { sessionDetail } = useSelector(state => state.oscePractice)
  const attachments = sessionDetail?.topic?.attachments || []

  const {
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
  } = useAttachmentSection()

  if (!attachments || attachments.length === 0) {
    return null
  }

  const currentAttachment = attachments[currentSliderIndex]

  return (
    <PhotoProvider
      visible={isShowAttachment}
      onVisibleChange={setIsShowAttachment}
      index={currentSliderIndex}
      onIndexChange={handleSliderGoTo}
    >
      {/* Hidden PhotoViews so the fullscreen gallery has all images */}
      {attachments.map((img, i) => (
        <PhotoView key={i} src={img.url}>
          <span style={{ display: 'none' }} />
        </PhotoView>
      ))}

      <AttachmentContainer>
        <SliderContainer>
          {/* Main Image */}
          <MainImageContainer>
            <MainImageWrapper onClick={() => handleThumbnailClick(currentSliderIndex)}>
              <MainImage
                src={currentAttachment.url}
                alt={`Attachment ${currentSliderIndex + 1}`}
                onLoadStart={handleImageLoadStart}
                onLoad={handleImageLoad}
                onError={handleImageLoad}
              />

              {isImageLoading && (
                <ImageLoadingOverlay>
                  <LoadingSpinnerIcon>
                    <FaSpinner size={26} />
                  </LoadingSpinnerIcon>
                  <span>Memuat gambar...</span>
                </ImageLoadingOverlay>
              )}

              {!isImageLoading && (
                <MainImageOverlay>
                  <FaEye size={20} />
                  <span>Klik untuk perbesar</span>
                </MainImageOverlay>
              )}
            </MainImageWrapper>
          </MainImageContainer>

          {/* Navigation Controls */}
          <SliderControls>
            <SliderButton
              onClick={handleSliderPrevious}
              disabled={currentSliderIndex === 0}
            >
              <FaChevronLeft size={13} />
            </SliderButton>

            <SliderInfo>
              <SliderCounter>
                {currentSliderIndex + 1} / {attachments.length}
              </SliderCounter>
            </SliderInfo>

            <SliderButton
              onClick={() => handleSliderNext(attachments.length)}
              disabled={currentSliderIndex === attachments.length - 1}
            >
              <FaChevronRight size={13} />
            </SliderButton>
          </SliderControls>

          {/* Dot Indicators (only if more than 1 image) */}
          {attachments.length > 1 && (
            <SliderDots>
              {attachments.map((_, index) => (
                <Dot
                  key={index}
                  active={index === currentSliderIndex}
                  onClick={() => handleSliderGoTo(index)}
                  title={`Gambar ${index + 1}`}
                />
              ))}
            </SliderDots>
          )}
        </SliderContainer>
      </AttachmentContainer>
    </PhotoProvider>
  )
})
