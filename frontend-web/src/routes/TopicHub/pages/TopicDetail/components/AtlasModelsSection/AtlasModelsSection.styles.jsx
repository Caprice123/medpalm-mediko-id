import styled from 'styled-components'
import { ItemGrid } from '../../TopicDetail.styles'

export const ModuleGroup = styled.div`
  /* Spaced from the grid of single-model cards above it as well as from a
     preceding group — the single-model grid is what the section usually opens
     with, and without this the first heading sat tight against it. */
  & + &,
  ${ItemGrid} + & {
    margin-top: 1.75rem;
  }
`

/* A module name, one step below the section heading: the models under it are
   the things being chosen, so this labels a group rather than competing with
   the section that contains it. */
export const ModuleTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gray-600);
  margin: 0 0 0.75rem;
`
