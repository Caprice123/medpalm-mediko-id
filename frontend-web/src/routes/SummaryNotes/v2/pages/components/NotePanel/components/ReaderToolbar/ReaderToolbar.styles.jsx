import styled from 'styled-components'
import { Nav, Sep, Crumb, CurrentCrumb } from '@components/common/Breadcrumb/Breadcrumb.styles'

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-gray-200);
`

export const CrumbArea = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;

  ${Nav} {
    flex-wrap: nowrap;
  }

  /* Each crumb truncates instead of the trail scrolling: a horizontal scrollbar in a
     32px strip is worse than an ellipsis, and hiding one would mean inventing yet
     another scrollbar treatment. */
  ${Crumb},
  ${CurrentCrumb} {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ${Sep} {
    flex-shrink: 0;
    color: var(--color-gray-400);
  }
`

export const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
`

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  height: 32px;
  min-width: 32px;
  padding: 0 ${p => p.$hasLabel ? '0.625rem' : '0'};
  border: 1px solid ${p => p.$active ? 'var(--color-brand-blue)' : 'transparent'};
  border-radius: 7px;
  background: ${p => p.$active ? 'var(--color-brand-blue-tint)' : 'transparent'};
  color: ${p => {
    if (p.$warm) return 'var(--color-warning)'
    return p.$active ? 'var(--color-brand-blue)' : 'var(--color-gray-500)'
  }};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s, border-color 0.15s;

  svg { font-size: 1.0625rem; flex-shrink: 0; }

  &:hover {
    background: var(--color-brand-blue-tint);
    color: ${p => p.$warm ? 'var(--color-warning-dark)' : 'var(--color-brand-blue)'};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: transparent;
    color: var(--color-gray-400);
  }
`

export const ControlsAnchor = styled.div`
  position: relative;
`
