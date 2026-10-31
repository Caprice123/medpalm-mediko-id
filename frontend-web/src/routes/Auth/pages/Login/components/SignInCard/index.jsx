import { useSelector } from 'react-redux'
import { GoogleLogin } from '@react-oauth/google'
import { useCountUp } from '@hooks/useCountUp'
import {
  Card,
  Title,
  Subtitle,
  GoogleSlot,
  Note,
  CountRow,
  CountItem,
  CountValue,
  CountLabel,
} from './SignInCard.styles'
import { useSignInCard } from './hooks/useSignInCard'

function SignInCard() {
  const { title, subtitle, handleGoogleSuccess, handleGoogleError } = useSignInCard()

  // Display-only, so it is selected here rather than threaded down from the
  // page hook. The same three counts the landing hero floats over its art.
  const trust = useSelector((state) => state.home.stats.trust)

  // One call per figure rather than a loop — hook order has to stay fixed, and
  // there are exactly three. Same hook the hero's stat cards use, so both
  // sweeps run at the same speed.
  const members = useCountUp(trust?.memberCount)
  const practice = useCountUp(trust?.practiceCount)
  const material = useCountUp(trust?.materialCount)

  const counts = trust
    ? [
        { label: 'Member', value: members },
        { label: 'Soal & kartu', value: practice },
        { label: 'Materi & 3D', value: material },
      ]
    : []

  return (
    <Card>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>

      <GoogleSlot>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          size="large"
          text="continue_with"
          width="336"
        />
      </GoogleSlot>

      <Note>
        Tidak perlu daftar — akunmu dibuat otomatis saat pertama kali masuk.
      </Note>

      {/* `null` means the stats request has not landed yet; three placeholder
          dashes under the button would read as broken, so the row waits. */}
      {counts.length > 0 && (
        <CountRow>
          {counts.map((count) => (
            <CountItem key={count.label}>
              <CountValue>{`${count.value.toLocaleString('id-ID')}+`}</CountValue>
              <CountLabel>{count.label}</CountLabel>
            </CountItem>
          ))}
        </CountRow>
      )}
    </Card>
  )
}

export default SignInCard
