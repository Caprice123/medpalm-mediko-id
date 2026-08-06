import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { useOcclusionEditor } from './hooks/useOcclusionEditor'
import {
  Wrapper, FieldLabel, HintText, ImageContainer, RegionBox, RegionList, RegionRow,
} from './OcclusionEditor.styles'

export default function OcclusionEditor({ imageUrl, regions, onChange }) {
  const { containerRef, drawing, handleMouseDown, handleMouseMove, handleMouseUp, updateRegionLabel, removeRegion } =
    useOcclusionEditor({ regions, onChange })

  if (!imageUrl) {
    return <HintText>Unggah gambar terlebih dahulu untuk menandai area occlusion.</HintText>
  }

  return (
    <Wrapper>
      <FieldLabel>Area Occlusion *</FieldLabel>
      <HintText>Klik dan seret pada gambar untuk menandai area yang akan disembunyikan.</HintText>

      <ImageContainer
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img src={imageUrl} alt="" draggable={false} style={{ width: '100%', display: 'block', pointerEvents: 'none' }} />
        {regions.map((r, i) => (
          <RegionBox key={r.id} style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.width}%`, height: `${r.height}%` }}>
            {i + 1}
          </RegionBox>
        ))}
        {drawing && (
          <RegionBox $drawing style={{ left: `${drawing.x}%`, top: `${drawing.y}%`, width: `${drawing.width}%`, height: `${drawing.height}%` }} />
        )}
      </ImageContainer>

      <RegionList>
        {regions.length === 0 && <HintText>Belum ada area occlusion.</HintText>}
        {regions.map((r, i) => (
          <RegionRow key={r.id}>
            <span>{i + 1}</span>
            <TextInput
              value={r.label}
              onChange={e => updateRegionLabel(r.id, e.target.value)}
              placeholder="Label area (contoh: Ventrikel Kiri)"
            />
            <Button size="small" variant="danger" onClick={() => removeRegion(r.id)}>Hapus</Button>
          </RegionRow>
        ))}
      </RegionList>
    </Wrapper>
  )
}
