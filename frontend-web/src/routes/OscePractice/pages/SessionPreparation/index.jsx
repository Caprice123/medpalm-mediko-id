import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Container,
  Card,
  Header,
  Icon,
  Title,
  Subtitle,
  TopicInfo,
  TopicTitle,
  TopicMeta,
  PermissionSection,
  SectionTitle,
  PermissionItem,
  PermissionIcon,
  PermissionText,
  PermissionLabel,
  PermissionStatus,
  StatusBadge,
  Actions,
  Button,
  ErrorMessage,
  HelpText,
} from './SessionPreparation.styles'

function SessionPreparation() {
  const navigate = useNavigate()
  const { sessionId } = useParams()
  const { userSessions } = useSelector(state => state.oscePractice)

  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
  })
  const [error, setError] = useState(null)
  const [isRequesting, setIsRequesting] = useState(false)

  // Find session data
  const session = userSessions.find(s => s.uniqueId === sessionId)

  // Check initial permission status
  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    try {
      // Check camera permission
      const cameraPermission = await navigator.permissions.query({ name: 'camera' })
      // Check microphone permission
      const micPermission = await navigator.permissions.query({ name: 'microphone' })

      setPermissions({
        camera: cameraPermission.state === 'granted',
        microphone: micPermission.state === 'granted',
      })

      // If both are already granted, auto-navigate after 2 seconds
      if (cameraPermission.state === 'granted' && micPermission.state === 'granted') {
        setTimeout(() => {
          handleStart()
        }, 2000)
      }
    } catch (err) {
      console.error('Error checking permissions:', err)
    }
  }

  const requestPermissions = async () => {
    setIsRequesting(true)
    setError(null)

    try {
      // Request both camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      // Stop the stream immediately - we just needed to request permission
      stream.getTracks().forEach(track => track.stop())

      setPermissions({
        camera: true,
        microphone: true,
      })

      // Auto-navigate to practice session after 1 second
      setTimeout(() => {
        handleStart()
      }, 1000)
    } catch (err) {
      console.error('Permission denied:', err)
      setError(
        'Gagal mendapatkan akses kamera dan mikrofon. Pastikan Anda memberikan izin saat diminta oleh browser.'
      )
    } finally {
      setIsRequesting(false)
    }
  }

  const handleStart = () => {
    if (permissions.camera && permissions.microphone) {
      navigate(`/osce-practice/session/${sessionId}/practice`)
    } else {
      setError('Harap berikan izin akses kamera dan mikrofon terlebih dahulu.')
    }
  }

  const handleCancel = () => {
    navigate('/osce-practice')
  }

  if (!session) {
    return (
      <Container>
        <Card>
          <Header>
            <Icon>⚠️</Icon>
            <Title>Sesi Tidak Ditemukan</Title>
            <Subtitle>Sesi yang Anda cari tidak tersedia.</Subtitle>
          </Header>
          <Actions>
            <Button variant="primary" onClick={() => navigate('/osce-practice')}>
              Kembali ke Beranda
            </Button>
          </Actions>
        </Card>
      </Container>
    )
  }

  return (
    <Container>
      <Card>
        <Header>
          <Icon>🎥</Icon>
          <Title>Persiapan Sesi OSCE</Title>
          <Subtitle>Izinkan akses kamera dan mikrofon untuk memulai latihan</Subtitle>
        </Header>

        <TopicInfo>
          <TopicTitle>{session.topicTitle}</TopicTitle>
          <TopicMeta>
            <span>⏱️ {session.topicDurationMinutes || 15} menit</span>
            <span>🤖 {session.aiModelUsed}</span>
          </TopicMeta>
        </TopicInfo>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <PermissionSection>
          <SectionTitle>Izin yang Diperlukan</SectionTitle>

          <PermissionItem granted={permissions.camera}>
            <PermissionIcon>📹</PermissionIcon>
            <PermissionText>
              <PermissionLabel>Kamera</PermissionLabel>
              <PermissionStatus granted={permissions.camera}>
                {permissions.camera
                  ? 'Kamera dapat diakses'
                  : 'Diperlukan untuk rekaman video'}
              </PermissionStatus>
            </PermissionText>
            <StatusBadge granted={permissions.camera}>
              {permissions.camera ? '✓ Aktif' : 'Belum Aktif'}
            </StatusBadge>
          </PermissionItem>

          <PermissionItem granted={permissions.microphone}>
            <PermissionIcon>🎤</PermissionIcon>
            <PermissionText>
              <PermissionLabel>Mikrofon</PermissionLabel>
              <PermissionStatus granted={permissions.microphone}>
                {permissions.microphone
                  ? 'Mikrofon dapat diakses'
                  : 'Diperlukan untuk rekaman audio'}
              </PermissionStatus>
            </PermissionText>
            <StatusBadge granted={permissions.microphone}>
              {permissions.microphone ? '✓ Aktif' : 'Belum Aktif'}
            </StatusBadge>
          </PermissionItem>
        </PermissionSection>

        <Actions>
          <Button variant="secondary" onClick={handleCancel}>
            Batal
          </Button>

          {permissions.camera && permissions.microphone ? (
            <Button variant="primary" onClick={handleStart}>
              Mulai Latihan
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={requestPermissions}
              disabled={isRequesting}
            >
              {isRequesting ? 'Meminta Izin...' : 'Berikan Izin'}
            </Button>
          )}
        </Actions>

        <HelpText>
          Browser akan meminta izin akses kamera dan mikrofon.
          <br />
          Pastikan untuk mengklik "Izinkan" atau "Allow" saat diminta.
        </HelpText>
      </Card>
    </Container>
  )
}

export default SessionPreparation
