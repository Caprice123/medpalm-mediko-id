import { PiMinus, PiPlus, PiTextAa } from 'react-icons/pi'
import { useReadingControls } from './hooks/useReadingControls'
import { ControlsAnchor, IconButton } from '../../ReaderToolbar.styles'
import {
  Popover, ControlGroup, ControlLabel, SegmentedRow, SegmentButton, FontSizePreview,
} from './ReadingControls.styles'

export default function ReadingControls({
  fontScale, canDecreaseFont, canIncreaseFont, onDecreaseFont, onIncreaseFont,
}) {
  const { isOpen, anchorRef, toggle } = useReadingControls()

  return (
    <ControlsAnchor ref={anchorRef}>
      <IconButton
        $active={isOpen}
        onClick={toggle}
        title="Pengaturan baca"
        aria-label="Pengaturan baca"
        aria-expanded={isOpen}
      >
        <PiTextAa />
      </IconButton>

      {isOpen && (
        <Popover>
          <ControlGroup>
            <ControlLabel>Ukuran teks</ControlLabel>
            <SegmentedRow>
              <SegmentButton
                onClick={onDecreaseFont}
                disabled={!canDecreaseFont}
                title="Perkecil teks"
                aria-label="Perkecil teks"
              >
                <PiMinus />
              </SegmentButton>
              <FontSizePreview>{Math.round(fontScale * 100)}%</FontSizePreview>
              <SegmentButton
                onClick={onIncreaseFont}
                disabled={!canIncreaseFont}
                title="Perbesar teks"
                aria-label="Perbesar teks"
              >
                <PiPlus />
              </SegmentButton>
            </SegmentedRow>
          </ControlGroup>
        </Popover>
      )}
    </ControlsAnchor>
  )
}
