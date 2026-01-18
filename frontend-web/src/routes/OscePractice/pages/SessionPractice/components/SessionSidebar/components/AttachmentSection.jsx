import { memo } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { useAttachmentSection } from '../hooks/useAttachmentSection'
import {
  AttachmentContainer,
  ViewAttachmentsButton,
  SliderContainer,
  MainImageContainer,
  MainImageWrapper,
  MainImage,
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
    const attachments = sessionDetail?.topic.attachments || []
  const {
    isShowAttachment,
    isSlideshowMode,
    currentSliderIndex,
    handleSliderGoTo,
    setIsShowAttachment,
  } = useAttachmentSection()

  if (!attachments || attachments.length === 0) {
    return null
  }

  console.log(attachments)

  return (
    <PhotoProvider
      visible={isShowAttachment}
      onVisibleChange={setIsShowAttachment}
      index={currentSliderIndex}
      onIndexChange={handleSliderGoTo}
    >
      <AttachmentContainer>
        {/* Toggle Button */}
        {!isSlideshowMode && (
          <ViewAttachmentsButton onClick={() => setIsShowAttachment(true)}>
            👁️ Gambar Kasus
          </ViewAttachmentsButton>
        )}

        {attachments.map((img, i) => (
            <PhotoView key={i} src={img.url}>
                <img src={img.url} alt="" style={{ display: 'none' }} />
            </PhotoView>
        ))}
      </AttachmentContainer>
    </PhotoProvider>
  )
})
