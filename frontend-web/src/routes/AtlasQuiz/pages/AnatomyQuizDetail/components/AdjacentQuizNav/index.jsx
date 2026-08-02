import { AdjacentNav, AdjacentCard, AdjacentCardEmpty, AdjacentLabel, AdjacentTitle } from './AdjacentQuizNav.styles'

export default function AdjacentQuizNav({ prevQuiz, nextQuiz, onNavigate }) {
  return (
    <AdjacentNav>
      {prevQuiz ? (
        <AdjacentCard onClick={() => onNavigate(prevQuiz.linkedUniqueId)}>
          <AdjacentLabel>◀ Sebelumnya</AdjacentLabel>
          <AdjacentTitle>{prevQuiz.linkedTitle}</AdjacentTitle>
        </AdjacentCard>
      ) : (
        <AdjacentCardEmpty />
      )}

      {nextQuiz ? (
        <AdjacentCard $right onClick={() => onNavigate(nextQuiz.linkedUniqueId)}>
          <AdjacentLabel>Berikutnya ▶</AdjacentLabel>
          <AdjacentTitle>{nextQuiz.linkedTitle}</AdjacentTitle>
        </AdjacentCard>
      ) : (
        <AdjacentCardEmpty $right />
      )}
    </AdjacentNav>
  )
}
