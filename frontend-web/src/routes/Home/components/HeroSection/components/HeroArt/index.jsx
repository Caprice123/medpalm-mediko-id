import { useSelector } from 'react-redux'
import { LuUsers, LuFileText, LuHeartPulse } from 'react-icons/lu'
import capybaraDoctor from '@/assets/landing/capybara-doctor-cheering.webp'
import StatCard from './components/StatCard'
import { ArtBox, Mascot } from './HeroArt.styles'

// The three counts the hero used to show in a card underneath it, moved onto
// the art as floating figures. Positions are percentages of the art box, so
// they hold their places around the mascot at every width.
const CARDS = [
  {
    key: 'member',
    icon: <LuUsers />,
    label: 'Member tergabung',
    left: '0%',
    top: '36%',
    background: '#e3eefc',
    color: '#2f6fc4',
  },
  {
    key: 'practice',
    icon: <LuFileText />,
    label: 'Soal & flashcard',
    left: '62%',
    top: '22%',
    background: '#fdeedd',
    color: '#c07722',
  },
  {
    key: 'material',
    icon: <LuHeartPulse />,
    label: 'Materi & model 3D',
    left: '66%',
    top: '64%',
    background: '#fde6e8',
    color: '#c0434f',
  },
]

function HeroArt() {
  // Display-only data, read here rather than threaded down from useHome —
  // the same source the trust card used.
  const trust = useSelector((state) => state.home.stats.trust)

  const counts = {
    member: trust?.memberCount,
    practice: trust?.practiceCount,
    material: trust?.materialCount,
  }

  return (
    <ArtBox>
      <Mascot src={capybaraDoctor} alt="" aria-hidden="true" />

      {CARDS.map((card) => (
        <StatCard
          key={card.key}
          icon={card.icon}
          count={counts[card.key]}
          label={card.label}
          background={card.background}
          color={card.color}
          left={card.left}
          top={card.top}
        />
      ))}
    </ArtBox>
  )
}

export default HeroArt
