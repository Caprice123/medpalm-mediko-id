import styled from 'styled-components'
import { Container as BootstrapContainer } from 'react-bootstrap'

export const Page = styled.div`
  background: var(--color-surface-app);
  min-height: calc(100vh - 44px);
  padding-block: 2.5rem;

  @media (max-width: 768px) {
    padding-block: 1.5rem;
  }
`

export const Content = styled(BootstrapContainer)`
  max-width: 880px;
`

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-gray-800);
  margin: 0 0 0.35rem;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`

export const Subtitle = styled.p`
  font-size: 0.95rem;
  color: var(--color-gray-500);
  margin: 0 0 2rem;
`

// Shared by TemplatePicker, WorkModePicker and ReportDetailsForm — the
// numbered step label above each group.
export const StepLabel = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-gray-500);
  margin: 0 0 0.85rem;
`

export const StepNumber = styled.span`
  color: var(--color-brand-blue);
`

export const Footer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
`

// One numbered step (its label plus the cards under it).
//
// A step that is not reachable yet is dimmed rather than hidden: the student
// can see the whole shape of what they are about to fill in, which is the
// reason this is one page and not a three-screen wizard. Only step 1 is
// required, so the later steps unlock together the moment a template is
// picked — there is nothing to gate them on separately.
//
// `pointer-events: none` stops the clicks; the `inert` attribute the page puts
// on the same element is what takes the controls out of the tab order, so the
// dimming is not a lie to anyone navigating by keyboard.
export const StepGroup = styled.section`
  & + & {
    margin-top: 2rem;
  }

  ${({ $locked }) => $locked && `
    opacity: 0.45;
    pointer-events: none;
    user-select: none;
  `}

  /* Only the unlocking is animated. Fading on the way in would otherwise also
     fade every later re-render of an open step. */
  transition: opacity 0.25s ease;
`

// Why the steps below are greyed out, next to the label that is waiting.
export const LockedHint = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
  color: var(--color-gray-400);
`
