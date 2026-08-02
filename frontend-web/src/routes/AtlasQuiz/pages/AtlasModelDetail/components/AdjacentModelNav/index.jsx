import { AdjacentNav, AdjacentCard, AdjacentCardEmpty, AdjacentLabel, AdjacentTitle } from './AdjacentModelNav.styles'

export default function AdjacentModelNav({ prevModel, nextModel, onNavigate }) {
  return (
    <AdjacentNav>
      {prevModel ? (
        <AdjacentCard onClick={() => onNavigate(prevModel.linkedUniqueId)}>
          <AdjacentLabel>◀ Sebelumnya</AdjacentLabel>
          <AdjacentTitle>{prevModel.linkedTitle}</AdjacentTitle>
        </AdjacentCard>
      ) : (
        <AdjacentCardEmpty />
      )}

      {nextModel ? (
        <AdjacentCard $right onClick={() => onNavigate(nextModel.linkedUniqueId)}>
          <AdjacentLabel>Berikutnya ▶</AdjacentLabel>
          <AdjacentTitle>{nextModel.linkedTitle}</AdjacentTitle>
        </AdjacentCard>
      ) : (
        <AdjacentCardEmpty $right />
      )}
    </AdjacentNav>
  )
}
