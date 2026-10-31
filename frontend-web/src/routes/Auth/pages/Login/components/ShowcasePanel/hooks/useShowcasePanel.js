import { useSelector } from 'react-redux'

// Two lines, the second in brand blue. A newline in the constant is the split
// point — the same convention the landing hero uses for `home_hero_title`.
const DEFAULT_HEADLINE = 'Lanjutkan belajar\ndari topik terakhirmu.'

const DEFAULT_LEDE =
  'Materi, Atlas Anatomi 3D, kuis, dan kartu kilat dalam satu platform.'

export function useShowcasePanel() {
  const constants = useSelector((state) => state.constant.constants)

  const [firstLine, ...accentLines] = (
    constants.home_hero_badge || DEFAULT_HEADLINE
  ).split('\n')

  return {
    firstLine,
    accentLines,
    lede: constants.home_hero_subtitle || DEFAULT_LEDE,
  }
}

export default useShowcasePanel
