import styled from 'styled-components'
import TextInput from '@components/common/TextInput'

/* Runs the full width of its container, so the field's edges line up with the
   topic grid below it rather than floating as a short box over a wide page. The
   button keeps its content width at the right end; the field takes the rest.
   Both parts stand 44px tall on their own (TextInput and a medium Button agree
   on that), so nothing has to be stretched to meet the other. */
export const Row = styled.div`
  display: flex;
  gap: 0.625rem;
  width: 100%;
`

export const Field = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`

/* The common TextInput, re-padded so the icon and the clear button sit inside
   the field instead of beside it — the field is the whole control, and a row
   of three separate boxes read as a form rather than as a search. */
export const SearchInput = styled(TextInput)`
  input {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
`

export const SearchIcon = styled.span`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  color: var(--color-gray-500);
  /* The glyph is decoration over the input — clicks belong to the field. */
  pointer-events: none;
`

export const ClearButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-gray-500);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: var(--color-gray-100);
    color: var(--color-gray-700);
  }
`
