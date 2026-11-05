import styled from 'styled-components'

// The station board. Three work areas side by side, and the whole point of the layout is that
// none of them can hide behind another: the worksheet's unfilled sections are visible while
// the student is still talking to the patient.
export const Page = styled.div`
  background: var(--color-surface-app);

  ::selection {
    background: var(--color-brand-blue-tint-strong);
    color: var(--color-brand-blue-deep);
  }
`

// A declared grid that folds by whole columns, never by squeezing: the worksheet becomes a
// drawer before it becomes unreadable, and the rail stacks above the dialogue before that.
export const Board = styled.div`
  display: grid;
  grid-template-columns: 304px minmax(0, 1fr) 352px;
  gap: 1rem;
  align-items: stretch;
  padding: 1rem;

  /* Exactly the screen. The station is mounted beside the app shell rather than inside it,
     so there is no top bar to subtract and nothing to measure at runtime: the board owns the
     viewport outright. */
  height: 100dvh;

  @media (max-width: 1180px) {
    grid-template-columns: 276px minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
  }

  /* Below this the areas stack, and a locked height would squeeze the conversation into a
     sliver — so the page scrolls here instead of the areas. */
  @media (max-width: 980px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(70vh, 1fr);
    height: auto;
    padding: 0.75rem;
  }
`

// Once the worksheet loses its column it comes back as a sheet over the board, docked to the
// right edge on a laptop and filling the screen on a phone.
//
// Rendered through a portal into <body>, the same way the shared Modal is: inside the page
// tree any ancestor with a transform, filter or containment turns `position: fixed` into
// something anchored to that ancestor instead of the viewport, which is what left the sheet
// floating short of the right edge with a scrim covering only part of the screen.
//
// It sits above the shell (whose bar is z-index 100) rather than below it. An overlay that
// dims the page but leaves a strip of chrome undimmed reads as a rendering fault, and the
// sheet needs its own header at the top of the screen to be reachable.
export const WorksheetDrawer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  justify-content: flex-end;
  background: rgba(11, 20, 25, 0.38);
`

export const DrawerPanel = styled.div`
  display: flex;
  width: min(420px, 100%);
  height: 100%;
  padding: 0.75rem;

  /* The worksheet area is a flex child here and would otherwise size to its own content,
     sitting left-aligned inside this right-docked box and leaving a strip of scrim between
     the sheet and the screen edge. It has to fill the sheet. */
  > * {
    flex: 1;
    min-width: 0;
  }
`

// Shared by BriefRail, Dialogue and Worksheet: the panel shell every area sits in.
export const Area = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 160ms ease-out, box-shadow 160ms ease-out;

  /* The area being worked in sharpens its edge; the others stay flat. Nothing moves, so the
     board never shuffles under the student's hands mid-station. */
  &:focus-within {
    border-color: var(--color-brand-blue-tint-strong);
    box-shadow: 0 2px 12px -5px rgba(4, 74, 119, 0.2);
  }
`

// Shared by Dialogue and Worksheet.
export const AreaHead = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-gray-200);
  flex: none;

  /* Lets a control that needs the full width — the dialogue's mode switch — drop onto its own
     row rather than squeezing the title or breaking its own labels mid-phrase. Once it does,
     a heading that just names the active mode says the same thing the switch already shows,
     so it steps out; the area keeps its accessible name from aria-label either way. */
  @media (max-width: 620px) {
    flex-wrap: wrap;

    h2[data-mirrors-mode='true'] {
      display: none;
    }
  }

  h2 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-gray-800);
  }
`

export const AreaBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-color: var(--color-gray-300) transparent;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-gray-300);
    border-radius: 5px;
    border: 3px solid var(--color-surface);
  }
`

// Shared by BriefRail and Worksheet: a mono-ish field label, never an eyebrow over a heading.
export const MicroLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-gray-500);
  white-space: nowrap;
`

export const Numeric = styled.span`
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
`

// The worksheet's own toggle, docked at the right edge once the board folds the column away.
export const WorksheetToggle = styled.button`
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 0.625rem;
  border: 1px solid var(--color-gray-200);
  border-right: none;
  border-radius: 12px 0 0 12px;
  background: var(--color-surface);
  color: var(--color-brand-blue-deep);
  font-size: 0.8125rem;
  font-weight: 700;
  writing-mode: vertical-rl;
  box-shadow: -2px 0 12px -6px rgba(4, 74, 119, 0.3);

  /* A count of what is still empty, so the closed drawer still warns. */
  b {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    writing-mode: horizontal-tb;
    min-width: 1.25rem;
    padding: 0.0625rem 0.25rem;
    border-radius: 999px;
    background: var(--color-danger-tint);
    color: var(--color-danger-dark);
    font-variant-numeric: tabular-nums;
  }
`

export const MobileEndBar = styled.div`
  display: none;

  @media (max-width: 980px) {
    display: block;
    position: sticky;
    bottom: 0;
    padding: 0.75rem;
    background: var(--color-surface);
    border-top: 1px solid var(--color-gray-200);
  }
`
