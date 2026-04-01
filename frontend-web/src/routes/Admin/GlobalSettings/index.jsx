import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchConstants, updateConstants } from '@store/constant/action'
import { actions as constantActions } from '@store/constant/reducer'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import {
  PageTitle,
  SectionCard,
  SectionTitle,
  FormGroup,
  FormRow,
  ItemCard,
  ItemHeader,
  ItemNumber,
  RemoveButton,
  AddButton,
} from './GlobalSettings.styles'

const CONSTANT_KEYS = [
  'home_hero_badge',
  'home_hero_title',
  'home_hero_subtitle',
  'home_hero_slides',
  'home_how_it_works_youtube_url',
  'home_faq_items',
  'home_social_items',
  'login_signin_title',
  'login_signin_subtitle',
]

const SOCIAL_TYPE_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
]

const DEFAULT_HERO_SLIDE = { icon: '', label: '', title: '', desc: '' }
const DEFAULT_FAQ = { question: '', answer: '' }
const DEFAULT_SOCIAL = { platform: '', type: 'instagram', handle: '', desc: '', url: '', btnLabel: '' }

function parseJson(value, fallback) {
  if (!value) return fallback
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback
  } catch {
    return fallback
  }
}

export default function GlobalSettings() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    home_hero_badge: '',
    home_hero_title: '',
    home_hero_subtitle: '',
    home_how_it_works_youtube_url: '',
    login_signin_title: '',
    login_signin_subtitle: '',
  })
  const [heroSlides, setHeroSlides] = useState([{ ...DEFAULT_HERO_SLIDE }])
  const [faqItems, setFaqItems] = useState([{ ...DEFAULT_FAQ }])
  const [socialItems, setSocialItems] = useState([{ ...DEFAULT_SOCIAL }])

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      dispatch(constantActions.updateFilter({ key: 'keys', value: CONSTANT_KEYS }))
      const constants = await dispatch(fetchConstants())
      const { home_hero_slides, home_faq_items, home_social_items, ...rest } = constants || {}
      setSettings(prev => ({ ...prev, ...rest }))
      setHeroSlides(parseJson(home_hero_slides, [{ ...DEFAULT_HERO_SLIDE }]))
      setFaqItems(parseJson(home_faq_items, [{ ...DEFAULT_FAQ }]))
      setSocialItems(parseJson(home_social_items, [{ ...DEFAULT_SOCIAL }]))
    } catch (err) {
      console.error('Failed to load global settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleItemChange = (setter, index, field, value) => {
    setter(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  const addItem = (setter, template) => {
    setter(prev => [...prev, { ...template }])
  }

  const removeItem = (setter, index) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...settings,
        home_hero_slides: JSON.stringify(heroSlides),
        home_faq_items: JSON.stringify(faqItems),
        home_social_items: JSON.stringify(socialItems),
      }
      await dispatch(updateConstants(payload, () => {}))
      alert('Pengaturan berhasil disimpan!')
    } catch (err) {
      console.error('Failed to save global settings:', err)
      alert('Gagal menyimpan pengaturan.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageTitle>Pengaturan Global</PageTitle>

      {/* Hero — Left (Text) */}
      <SectionCard>
        <SectionTitle>Hero — Teks</SectionTitle>

        <FormGroup>
          <TextInput
            label="Badge"
            placeholder="✨ Platform Medis Berbasis AI"
            value={settings.home_hero_badge}
            onChange={(e) => handleChange('home_hero_badge', e.target.value)}
            disabled={loading}
          />
        </FormGroup>

        <FormGroup>
          <Textarea
            label="Judul Utama"
            placeholder={'Better Learning.\nBetter Doctors.\nBetter Lives.'}
            value={settings.home_hero_title}
            onChange={(e) => handleChange('home_hero_title', e.target.value)}
            disabled={loading}
            rows={4}
            hint="Gunakan baris baru untuk memisahkan baris judul."
          />
        </FormGroup>

        <FormGroup>
          <Textarea
            label="Subjudul"
            placeholder="1.895+ Model Anatomi 3D Interaktif..."
            value={settings.home_hero_subtitle}
            onChange={(e) => handleChange('home_hero_subtitle', e.target.value)}
            disabled={loading}
            rows={3}
          />
        </FormGroup>
      </SectionCard>

      {/* Login Page */}
      <SectionCard>
        <SectionTitle>Halaman Login</SectionTitle>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1rem' }}>
          Tagline, deskripsi, dan fitur di panel kiri login diambil dari Hero (Badge, Subjudul, Slide Fitur).
        </p>

        <FormGroup>
          <TextInput
            label="Judul Sign In"
            placeholder="Selamat Datang Kembali"
            value={settings.login_signin_title}
            onChange={(e) => handleChange('login_signin_title', e.target.value)}
            disabled={loading}
          />
        </FormGroup>

        <FormGroup>
          <Textarea
            label="Subjudul Sign In"
            placeholder="Masuk untuk mengakses platform pembelajaran kedokteran berbasis AI"
            value={settings.login_signin_subtitle}
            onChange={(e) => handleChange('login_signin_subtitle', e.target.value)}
            disabled={loading}
            rows={3}
          />
        </FormGroup>
      </SectionCard>

      {/* Hero — Right (Slides) */}
      <SectionCard>
        <SectionTitle>Hero — Slide Fitur</SectionTitle>

        {heroSlides.map((slide, index) => (
          <ItemCard key={index}>
            <ItemHeader>
              <ItemNumber>Slide {index + 1}</ItemNumber>
              {heroSlides.length > 1 && (
                <RemoveButton onClick={() => removeItem(setHeroSlides, index)}>Hapus</RemoveButton>
              )}
            </ItemHeader>

            <FormRow $cols="80px 1fr">
              <FormGroup>
                <TextInput
                  label="Icon"
                  placeholder="📝"
                  value={slide.icon}
                  onChange={(e) => handleItemChange(setHeroSlides, index, 'icon', e.target.value)}
                  disabled={loading}
                />
              </FormGroup>
              <FormGroup>
                <TextInput
                  label="Label"
                  placeholder="Bank Soal"
                  value={slide.label}
                  onChange={(e) => handleItemChange(setHeroSlides, index, 'label', e.target.value)}
                  disabled={loading}
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <TextInput
                label="Judul"
                placeholder="40.000+ Soal MCQ"
                value={slide.title}
                onChange={(e) => handleItemChange(setHeroSlides, index, 'title', e.target.value)}
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <TextInput
                label="Deskripsi"
                placeholder="Latihan UKMPPD & ujian blok..."
                value={slide.desc}
                onChange={(e) => handleItemChange(setHeroSlides, index, 'desc', e.target.value)}
                disabled={loading}
              />
            </FormGroup>
          </ItemCard>
        ))}

        <AddButton onClick={() => addItem(setHeroSlides, DEFAULT_HERO_SLIDE)} disabled={loading}>
          + Tambah Slide
        </AddButton>
      </SectionCard>

      {/* How It Works */}
      <SectionCard>
        <SectionTitle>Cara Kerja — YouTube</SectionTitle>

        <FormGroup>
          <TextInput
            label="YouTube Embed URL"
            placeholder="https://www.youtube.com/embed/VIDEO_ID"
            value={settings.home_how_it_works_youtube_url}
            onChange={(e) => handleChange('home_how_it_works_youtube_url', e.target.value)}
            disabled={loading}
            hint="Gunakan URL embed, contoh: https://www.youtube.com/embed/abc123"
          />
        </FormGroup>
      </SectionCard>

      {/* FAQ */}
      <SectionCard>
        <SectionTitle>FAQ</SectionTitle>

        {faqItems.map((item, index) => (
          <ItemCard key={index}>
            <ItemHeader>
              <ItemNumber>Pertanyaan {index + 1}</ItemNumber>
              {faqItems.length > 1 && (
                <RemoveButton onClick={() => removeItem(setFaqItems, index)}>Hapus</RemoveButton>
              )}
            </ItemHeader>

            <FormGroup>
              <TextInput
                label="Pertanyaan"
                placeholder="Apa itu kredit?"
                value={item.question}
                onChange={(e) => handleItemChange(setFaqItems, index, 'question', e.target.value)}
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Textarea
                label="Jawaban"
                placeholder="Kredit adalah..."
                value={item.answer}
                onChange={(e) => handleItemChange(setFaqItems, index, 'answer', e.target.value)}
                disabled={loading}
                rows={3}
              />
            </FormGroup>
          </ItemCard>
        ))}

        <AddButton onClick={() => addItem(setFaqItems, DEFAULT_FAQ)} disabled={loading}>
          + Tambah Pertanyaan
        </AddButton>
      </SectionCard>

      {/* Social Media */}
      <SectionCard>
        <SectionTitle>Sosial Media</SectionTitle>

        {socialItems.map((item, index) => (
          <ItemCard key={index}>
            <ItemHeader>
              <ItemNumber>Platform {index + 1}</ItemNumber>
              {socialItems.length > 1 && (
                <RemoveButton onClick={() => removeItem(setSocialItems, index)}>Hapus</RemoveButton>
              )}
            </ItemHeader>

            <FormRow>
              <FormGroup>
                <TextInput
                  label="Nama Platform"
                  placeholder="Instagram"
                  value={item.platform}
                  onChange={(e) => handleItemChange(setSocialItems, index, 'platform', e.target.value)}
                  disabled={loading}
                />
              </FormGroup>
              <FormGroup>
                <Dropdown
                  label="Tipe Icon"
                  options={SOCIAL_TYPE_OPTIONS}
                  value={SOCIAL_TYPE_OPTIONS.find(o => o.value === item.type) || null}
                  onChange={(option) => handleItemChange(setSocialItems, index, 'type', option?.value || 'instagram')}
                  disabled={loading}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <TextInput
                  label="Handle / Nomor"
                  placeholder="@medpal.id"
                  value={item.handle}
                  onChange={(e) => handleItemChange(setSocialItems, index, 'handle', e.target.value)}
                  disabled={loading}
                />
              </FormGroup>
              <FormGroup>
                <TextInput
                  label="Label Tombol"
                  placeholder="Ikuti"
                  value={item.btnLabel}
                  onChange={(e) => handleItemChange(setSocialItems, index, 'btnLabel', e.target.value)}
                  disabled={loading}
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <TextInput
                label="Deskripsi"
                placeholder="Tips & Edukasi Medis"
                value={item.desc}
                onChange={(e) => handleItemChange(setSocialItems, index, 'desc', e.target.value)}
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <TextInput
                label="URL"
                placeholder="https://instagram.com/medpal.id"
                value={item.url}
                onChange={(e) => handleItemChange(setSocialItems, index, 'url', e.target.value)}
                disabled={loading}
              />
            </FormGroup>
          </ItemCard>
        ))}

        <AddButton onClick={() => addItem(setSocialItems, DEFAULT_SOCIAL)} disabled={loading}>
          + Tambah Platform
        </AddButton>
      </SectionCard>

      <Button variant="primary" onClick={handleSave} disabled={loading || saving}>
        {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
      </Button>
    </div>
  )
}
