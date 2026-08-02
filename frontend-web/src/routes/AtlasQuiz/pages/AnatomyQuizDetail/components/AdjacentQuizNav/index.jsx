import { AdjacentNav, AdjacentCard, AdjacentCardEmpty, AdjacentLabel, AdjacentTitle } from './AdjacentQuizNav.styles'

export default function AdjacentQuizNav({ prevQuiz, nextQuiz, onNavigate }) {
  return (
    <AdjacentNav>
      {prevQuiz ? (
        <AdjacentCard onClick={() => onNavigate(prevQuiz.uniqueId)}>
          <AdjacentLabel>◀ Sebelumnya</AdjacentLabel>
          <AdjacentTitle>{prevQuiz.title}</AdjacentTitle>
        </AdjacentCard>
      ) : (
        <AdjacentCardEmpty />
      )}

      {nextQuiz ? (
        <AdjacentCard $right onClick={() => onNavigate(nextQuiz.uniqueId)}>
          <AdjacentLabel>Berikutnya ▶</AdjacentLabel>
          <AdjacentTitle>{nextQuiz.title}</AdjacentTitle>
        </AdjacentCard>
      ) : (
        <AdjacentCardEmpty $right />
      )}
    </AdjacentNav>
  )
}
