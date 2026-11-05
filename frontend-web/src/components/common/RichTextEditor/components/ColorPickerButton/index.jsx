import { useColorPickerButton } from './hooks/useColorPickerButton'
import {
  PickerWrap, SwatchIndicator, Popover, Swatch, ClearSwatch,
} from './ColorPickerButton.styles'
import { ToolbarButton } from '../../RichTextEditor.styles'

export default function ColorPickerButton({ icon, title, colors, activeColor, onPick, onClear }) {
  const { open, toggle, close, wrapRef } = useColorPickerButton()

  const handlePick = (color) => {
    onPick(color)
    close()
  }

  return (
    <PickerWrap ref={wrapRef}>
      <ToolbarButton type="button" $active={open} onClick={toggle} title={title}>
        {icon}
        <SwatchIndicator $color={activeColor} />
      </ToolbarButton>

      {open && (
        <Popover onClick={e => e.stopPropagation()}>
          {colors.map(color => (
            <Swatch key={color} type="button" $color={color} onClick={() => handlePick(color)} title={color} />
          ))}
          <ClearSwatch type="button" onClick={() => { onClear(); close() }} title="Hapus warna">×</ClearSwatch>
        </Popover>
      )}
    </PickerWrap>
  )
}
