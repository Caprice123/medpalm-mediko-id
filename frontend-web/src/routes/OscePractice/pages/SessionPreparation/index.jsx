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
} from './SessionPreparation.styles'
import { useSessionPreparation } from './hooks/useSessionPreparation'

function SessionPreparation() {
  const {
    sessionDetail, loading,
    microphoneGranted, isRequesting, permissionError,
    sttProvider, testingProvider,
    requestMicrophonePermission, handleStart, handleCancel, handleBackToHome,
  } = useSessionPreparation()

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
            <Button variant="primary" onClick={handleBackToHome}>
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

        <PermissionCard granted={!!sttProvider && !testingProvider}>
          <PermissionIconCircle>🌐</PermissionIconCircle>
          <PermissionContent>
            <StatusBadge granted={!!sttProvider && !testingProvider}>
              {testingProvider ? '⏳ Memeriksa...' : sttProvider ? '✓ Siap' : '⏳ Memeriksa...'}
            </StatusBadge>
            <PermissionTitle>Layanan Speech-to-Text</PermissionTitle>
            <PermissionDescription>
              {testingProvider
                ? 'Memeriksa konektivitas layanan transkripsi suara...'
                : sttProvider === 'deepgram'
                ? 'Menggunakan Deepgram (Real-time) untuk transkripsi suara berkualitas tinggi'
                : sttProvider === 'whisper'
                ? 'Menggunakan Whisper sebagai layanan transkripsi cadangan'
                : 'Menentukan layanan transkripsi terbaik yang tersedia...'}
            </PermissionDescription>
          </PermissionContent>
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
            disabled={!microphoneGranted || loading.isStartingSession || testingProvider || !sttProvider}
          >
            {loading.isStartingSession ? 'Memulai Sesi...' : testingProvider ? 'Memeriksa Konektivitas...' : 'Mulai Latihan'}
          </Button>
        </Actions>
      </Card>
    </Container>
  )
}

export default SessionPreparation
