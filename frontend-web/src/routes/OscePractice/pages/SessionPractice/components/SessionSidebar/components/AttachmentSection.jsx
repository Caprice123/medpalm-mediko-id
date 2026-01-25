import { memo } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { useAttachmentSection } from '../hooks/useAttachmentSection'
import {
  AttachmentContainer,
} from './AttachmentSection.styles'
import Button from '@components/common/Button'
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
          <Button variant="primary" onClick={() => setIsShowAttachment(true)}>
            👁️ Gambar Kasus
          </Button>
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
