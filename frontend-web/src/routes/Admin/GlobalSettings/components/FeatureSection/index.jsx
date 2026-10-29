import { useSelector } from 'react-redux'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import {
  SectionCard,
  SectionTitle,
  SectionHint,
  FormGroup,
  ItemCard,
  ItemHeader,
  ItemNumber,
  ItemNote,
} from '../../GlobalSettings.styles'

// One row per feature, never a list an admin can add to.
//
// A row is tied to a feature by its `sessionType`, which is what the landing
// page matches a tab against. Deriving the rows from the feature list means
// there is always exactly one box per feature: a new feature appears here on
// its own, a renamed one keeps its points, and nobody can create a row for a
// feature that does not exist or two rows for the same one.
function FeatureSection({ heading, headingAccent, subtitle, onTextChange, points, onPointsChange }) {
  const loading = useSelector((state) => state.constant.loading.isGetListConstantsLoading)
  const features = useSelector((state) => state.feature.features)

  return (
    <SectionCard>
      <SectionTitle>Section Fitur</SectionTitle>
      <SectionHint>
        Nama tab, judul panel, deskripsi panel, dan video tiap fitur diambil dari
        Kelola Fitur — diubah di sana, bukan di sini. Fitur yang non-aktif tidak
        muncul tabnya di landing page, tapi poinnya tetap bisa disiapkan dari
        sekarang.
      </SectionHint>

      <FormGroup>
        <TextInput
          label="Judul (Baris Hitam)"
          placeholder="Semua yang kamu butuhkan"
          value={heading}
          onChange={(e) => onTextChange('home_feature_heading', e.target.value)}
          disabled={loading}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul (Baris Biru)"
          placeholder="untuk belajar kedokteran."
          value={headingAccent}
          onChange={(e) => onTextChange('home_feature_heading_accent', e.target.value)}
          disabled={loading}
        />
      </FormGroup>

      <FormGroup>
        <Textarea
          label="Subjudul"
          placeholder="Mulai dari memahami materi hingga menguji pemahaman..."
          value={subtitle}
          onChange={(e) => onTextChange('home_feature_subtitle', e.target.value)}
          disabled={loading}
          rows={3}
        />
      </FormGroup>

      {features
        .filter((feature) => feature.sessionType)
        .map((feature) => (
          <ItemCard key={feature.sessionType}>
            <ItemHeader>
              <ItemNumber>{feature.name}</ItemNumber>
              {feature.isActive !== true && feature.isActive !== 'true' && (
                <ItemNote>Non-aktif — tab tidak tampil</ItemNote>
              )}
            </ItemHeader>

            <FormGroup>
              <Textarea
                label="Poin"
                placeholder={'Putar dan amati model dari berbagai sudut.\nPelajari struktur anatomi secara lebih visual.'}
                value={points[feature.sessionType] || ''}
                onChange={(e) => onPointsChange(feature.sessionType, e.target.value)}
                disabled={loading}
                rows={5}
                hint="Satu poin per baris. Desain memakai 4 poin; kosongkan untuk menyembunyikan daftar poin di fitur ini."
              />
            </FormGroup>
          </ItemCard>
        ))}
    </SectionCard>
  )
}

export default FeatureSection
