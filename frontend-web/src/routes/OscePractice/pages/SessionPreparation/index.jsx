import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Container,
  Card,
  Header,
  IconCircle,
  Title,
  Subtitle,
  PermissionCard,
  PermissionIconCircle,
  PermissionContent,
  PermissionTitle,
  PermissionDescription,
  PermissionButton,
  StatusBadge,
  InfoGrid,
  InfoBox,
  InfoBoxTitle,
  InfoBoxIcon,
  InfoBoxText,
  Actions,
  Button,
  ErrorMessage,
  HelpText,
} from './SessionPreparation.styles'
import { startOsceSession, fetchSessionDetail } from '@store/oscePractice/userAction'

function SessionPreparation() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { sessionId } = useParams()
  const { sessionDetail, loading } = useSelector(state => state.oscePractice)

  const [microphoneGranted, setMicrophoneGranted] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [permissionError, setPermissionError] = useState(null)

  // Fetch session detail on mount
  useEffect(() => {
    if (sessionId) {
      dispatch(fetchSessionDetail(sessionId))
    }
  }, [sessionId, dispatch])

  // Check initial permission status
  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    try {
      // Check microphone permission
      const micPermission = await navigator.permissions.query({ name: 'microphone' })
      setMicrophoneGranted(micPermission.state === 'granted')
    } catch (err) {
      console.error('Error checking permissions:', err)
    }
  }

  const requestMicrophonePermission = async () => {
    setIsRequesting(true)
    setPermissionError(null)

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })

      // Stop the stream immediately - we just needed to request permission
      stream.getTracks().forEach(track => track.stop())

      setMicrophoneGranted(true)
    } catch (err) {
      console.error('Permission denied:', err)
      setPermissionError('Akses mikrofon ditolak. Silakan aktifkan izin mikrofon di pengaturan browser Anda.')
    } finally {
      setIsRequesting(false)
    }
  }

  const handleStart = async () => {
    if (!microphoneGranted) {
      setPermissionError('Harap berikan izin akses mikrofon terlebih dahulu.')
      return
    }

    setIsStarting(true)
    try {
      // Start the session (this will deduct credits)
      await dispatch(startOsceSession(sessionId))

      // Clear old session detail from Redux so practice page starts fresh
    //   dispatch(actions.setSessionDetail(null))

      // Navigate to practice page after successfully starting session
      navigate(`/osce-practice/session/${sessionId}/practice`)
    } catch (err) {
      console.error('Failed to start session:', err)
      // Error handling is done in the action creator
    } finally {
      setIsStarting(false)
    }
  }

  console.log("SESSION PREPARATION")
  console.log(sessionDetail)

  const handleCancel = () => {
    navigate(-1)
  }

  // Show loading state
  if (loading.isLoadingSessionDetail) {
    return (
      <Container>
        <Card>
          <Header>
            <IconCircle>⏳</IconCircle>
            <Title>Memuat Sesi...</Title>
            <Subtitle>Mohon tunggu sebentar</Subtitle>
          </Header>
        </Card>
      </Container>
    )
  }

  // Show error if session not found
  if (!sessionDetail) {
    return (
      <Container>
        <Card>
          <Header>
            <IconCircle>⚠️</IconCircle>
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
          <IconCircle>🎤</IconCircle>
          <Title>Persiapan Sesi OSCE</Title>
          <Subtitle>
            Sebelum memulai, pastikan mikrofon Anda berfungsi dengan baik untuk komunikasi optimal dengan AI
          </Subtitle>
        </Header>

        {permissionError && (
          <ErrorMessage>{permissionError}</ErrorMessage>
        )}

        <PermissionCard granted={microphoneGranted}>
          <PermissionIconCircle>🎤</PermissionIconCircle>
          <PermissionContent>
            <StatusBadge granted={microphoneGranted}>
              {microphoneGranted ? '✓ Diizinkan' : 'Diperlukan'}
            </StatusBadge>
            <PermissionTitle>Akses Mikrofon</PermissionTitle>
            <PermissionDescription>
              {microphoneGranted
                ? 'Mikrofon Anda sudah dapat diakses dan siap digunakan untuk sesi OSCE'
                : 'Kami memerlukan akses ke mikrofon Anda untuk merekam respons audio selama sesi latihan OSCE'}
            </PermissionDescription>
          </PermissionContent>
          {!microphoneGranted && (
            <PermissionButton
              onClick={requestMicrophonePermission}
              disabled={isRequesting}
            >
              {isRequesting ? 'Meminta...' : 'Berikan Izin'}
            </PermissionButton>
          )}
        </PermissionCard>

        <InfoGrid>
          <InfoBox>
            <InfoBoxTitle>
              <InfoBoxIcon>🔒</InfoBoxIcon>
              Privasi & Keamanan
            </InfoBoxTitle>
            <InfoBoxText>
              Audio Anda hanya digunakan untuk evaluasi OSCE dan tidak akan dibagikan kepada pihak ketiga
            </InfoBoxText>
          </InfoBox>

          <InfoBox>
            <InfoBoxTitle>
              <InfoBoxIcon>🎧</InfoBoxIcon>
              Kualitas Audio
            </InfoBoxTitle>
            <InfoBoxText>
              Pastikan Anda berada di lingkungan yang tenang untuk hasil rekaman yang optimal
            </InfoBoxText>
          </InfoBox>
        </InfoGrid>

        <Actions>
          <Button variant="secondary" onClick={handleCancel}>
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={handleStart}
            disabled={!microphoneGranted || isStarting}
          >
            {isStarting ? 'Memulai Sesi...' : 'Mulai Latihan'}
          </Button>
        </Actions>
      </Card>
    </Container>
  )
}

export default SessionPreparation
