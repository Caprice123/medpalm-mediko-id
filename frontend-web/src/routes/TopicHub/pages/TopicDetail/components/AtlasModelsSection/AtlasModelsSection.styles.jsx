import styled from 'styled-components'

export const ModuleGroup = styled.div`
  & + & {
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
