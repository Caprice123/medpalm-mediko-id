import { memo } from 'react'
import { useSelector } from 'react-redux'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { PiCaretLeft, PiCaretRight, PiMagnifyingGlassPlus } from 'react-icons/pi'
import { useAttachments } from './hooks/useAttachments'
import { Frame, Shot, Hint, Controls, Step, Counter } from './Attachments.styles'

// Read here rather than passed down: nothing above this component branches on the attachments.
const Attachments = memo(function Attachments() {
  const attachments = useSelector((state) => state.oscePractice.sessionDetail?.topic?.attachments) || []
  const { index, setIndex, step, isViewerOpen, setIsViewerOpen, openViewer } = useAttachments(attachments.length)

  if (attachments.length === 0) return null

  const current = attachments[index]

  return (
    <PhotoProvider
      visible={isViewerOpen}
      onVisibleChange={setIsViewerOpen}
      index={index}
      onIndexChange={setIndex}
    >
      {/* Every image is registered with the viewer so the fullscreen gallery can step through
          them all, while the rail itself only ever renders one. */}
      {attachments.map((attachment, position) => (
        <PhotoView key={attachment.url || position} src={attachment.url}>
          <span style={{ display: 'none' }} />
        </PhotoView>
      ))}

      <Frame>
        <Shot type="button" onClick={openViewer} title="Perbesar gambar">
          <img src={current.url} alt={current.name || `Lampiran ${index + 1}`} />
          <Hint>
            <PiMagnifyingGlassPlus size={14} />
            Klik untuk perbesar
          </Hint>
        </Shot>
      </Frame>

      {attachments.length > 1 && (
        <Controls>
          <Step type="button" onClick={() => step(-1)} disabled={index === 0} title="Gambar sebelumnya">
            <PiCaretLeft size={14} />
          </Step>
          <Counter>{index + 1} / {attachments.length}</Counter>
          <Step
            type="button"
            onClick={() => step(1)}
            disabled={index === attachments.length - 1}
            title="Gambar berikutnya"
          >
            <PiCaretRight size={14} />
          </Step>
        </Controls>
      )}
    </PhotoProvider>
  )
})

export default Attachments
