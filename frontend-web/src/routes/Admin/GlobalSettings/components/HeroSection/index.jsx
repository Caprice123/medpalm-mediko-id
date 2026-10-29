import { useSelector } from 'react-redux'
import Textarea from '@components/common/Textarea'
import { SectionCard, SectionTitle, SectionHint, FormGroup } from '../../GlobalSettings.styles'

function HeroSection({ title, subtitle, onTextChange }) {
  const loading = useSelector((state) => state.constant.loading.isGetListConstantsLoading)

  return (
    <SectionCard>
      <SectionTitle>Hero</SectionTitle>
      <SectionHint>
        Angka-angka di ticker dan kartu statistik hero dihitung otomatis dari
        jumlah konten, bukan diatur di sini. Subjudul juga dipakai sebagai
        deskripsi di panel kiri halaman login.
      </SectionHint>

      <FormGroup>
        <Textarea
          label="Judul Utama"
          placeholder={'Better Learning.\nBetter Doctors.\nBetter Lives.'}
          value={title}
          onChange={(e) => onTextChange('home_hero_title', e.target.value)}
          disabled={loading}
          rows={4}
          hint="Gunakan baris baru untuk memisahkan baris judul."
        />
      </FormGroup>

      <FormGroup>
        <Textarea
          label="Subjudul"
          placeholder="18.000+ flashcards, 20.000+ soal, simulasi OSCE AI..."
          value={subtitle}
          onChange={(e) => onTextChange('home_hero_subtitle', e.target.value)}
          disabled={loading}
          rows={3}
        />
      </FormGroup>
    </SectionCard>
  )
}

export default HeroSection
