import styled from 'styled-components'

// Two modes of the same conversation area, switched by a standard segmented control. V1 made
// these two of five top-level tabs, which is what let the worksheet disappear.
export const ModeSwitch = styled.div`
  display: inline-flex;
  padding: 0.1875rem;
  border-radius: 10px;
  background: var(--color-gray-100);

  /* Beside the title there is not enough room for both labels and they break mid-phrase, so
     the switch takes its own full-width row. min-width: 0 is the part that matters: a flex
     item will not shrink below its own content without it, which is what pushed the second
     label straight off the screen edge. */
  @media (max-width: 620px) {
    display: flex;
    width: 100%;
    min-width: 0;
  }
`

export const ModeButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4375rem;
  padding: 0.4375rem 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ $active }) => ($active ? 'var(--color-surface)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-600)')};
  box-shadow: ${({ $active }) => ($active ? '0 1px 4px -1px rgba(21, 36, 46, 0.18)' : 'none')};

  svg {
    flex: none;
  }

  &:hover {
    color: var(--color-brand-blue-deep);
  }

  /* Once the switch owns its own row, the two labels are what has to fit: the pictograms step
     aside, the halves share the width evenly, and each can shrink. */
  @media (max-width: 620px) {
    flex: 1;
    min-width: 0;
    padding: 0.4375rem 0.5rem;

    svg {
      display: none;
    }
  }
`

// The label is its own element so it can ellipsis. At any width where both labels still fit
// this never shows — it is the floor that keeps a long label from breaking the control
// instead of simply being trimmed.
export const ModeLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Stream = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`
