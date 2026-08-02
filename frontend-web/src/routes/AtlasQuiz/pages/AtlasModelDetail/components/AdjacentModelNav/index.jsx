import { AdjacentNav, AdjacentCard, AdjacentCardEmpty, AdjacentLabel, AdjacentTitle } from './AdjacentModelNav.styles'

export default function AdjacentModelNav({ prevModel, nextModel, onNavigate }) {
  return (
    <AdjacentNav>
      {prevModel ? (
        <AdjacentCard onClick={() => onNavigate(prevModel.uniqueId)}>
          <AdjacentLabel>◀ Sebelumnya</AdjacentLabel>
          <AdjacentTitle>{prevModel.title}</AdjacentTitle>
        </AdjacentCard>
      ) : (
        <AdjacentCardEmpty />
      )}

      {nextModel ? (
        <AdjacentCard $right onClick={() => onNavigate(nextModel.uniqueId)}>
          <AdjacentLabel>Berikutnya ▶</AdjacentLabel>
          <AdjacentTitle>{nextModel.title}</AdjacentTitle>
        </AdjacentCard>
      ) : (
        <AdjacentCardEmpty $right />
      )}
    </AdjacentNav>
  )
}
