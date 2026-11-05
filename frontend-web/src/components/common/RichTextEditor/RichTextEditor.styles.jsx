import styled from 'styled-components'

export const EditorShell = styled.div`
  border: 1.5px solid var(--color-gray-200);
  border-radius: 10px;
  background: var(--color-surface);
  overflow: hidden;
  opacity: ${p => p.$disabled ? 0.6 : 1};

  &:focus-within {
    border-color: var(--color-brand-blue);
  }
`

// One flat list of buttons that wraps onto further lines when it runs out of width — no
// sideways scrolling, and no row split baked into the markup, so narrow editors grow
// downwards and wide ones stay on a single line.
export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 0.25rem;
  column-gap: 0.125rem;
  padding: 0.375rem 0.5rem;
  background: var(--color-gray-50);
  border-bottom: 1px solid var(--color-gray-200);
`

export const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  flex-shrink: 0;
`

export const ToolbarDivider = styled.span`
  width: 1px;
  align-self: stretch;
  flex-shrink: 0;
  margin: 0.125rem 0.25rem;
  background: var(--color-gray-200);
`

export const ToolbarButton = styled.button`
  position: relative;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 0.375rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  color: ${p => p.$active ? 'var(--color-brand-blue)' : 'var(--color-gray-500)'};
  background: ${p => p.$active ? 'var(--color-brand-blue-tint)' : 'transparent'};
  transition: background 0.15s, color 0.15s;

  &:hover:not(:disabled) {
    background: var(--color-gray-100);
    color: var(--color-gray-900);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`

export const EditorSurface = styled.div`
  padding: 0.75rem 0.875rem;

  .tiptap {
    outline: none;
    min-height: ${p => p.$minHeight || '6rem'};
    font-size: 0.9375rem;
    line-height: 1.7;
    color: var(--color-gray-900);

    > :first-child { margin-top: 0; }
    > :last-child { margin-bottom: 0; }

    p { margin: 0 0 0.5rem; }

    h2, h3, h4 {
      color: var(--color-gray-900);
      line-height: 1.4;
      margin: 0.875rem 0 0.375rem;
    }
    h2 { font-size: 1.0625rem; }
    h3 { font-size: 1rem; }
    h4 { font-size: 0.9375rem; }

    ul, ol { margin: 0 0 0.5rem; padding-left: 1.25rem; }
    li { margin-bottom: 0.2rem; }

    blockquote {
      margin: 0 0 0.5rem;
      padding: 0.375rem 0.75rem;
      border-left: 3px solid var(--color-gray-300);
      color: var(--color-gray-500);
    }

    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.875em;
      background: var(--color-gray-100);
      padding: 0.1rem 0.3rem;
      border-radius: 4px;
    }

    hr {
      border: none;
      border-top: 1px solid var(--color-gray-200);
      margin: 0.75rem 0;
    }

    a {
      color: var(--color-brand-blue);
      text-decoration: underline;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }

    /* Word-style image resizing: the node view wraps every image so the eight handles and
       the size badge can be positioned against it. */
    .rte-image-align {
      line-height: 0;
      margin: 0.375rem 0;
    }

    .rte-image-wrapper {
      position: relative;
      display: inline-block;
      line-height: 0;
      max-width: 100%;
    }

    .rte-image-wrapper.rte-image-selected .rte-image,
    .rte-image-wrapper.rte-image-resizing .rte-image {
      outline: 2px solid var(--color-brand-blue);
      outline-offset: 1px;
    }

    .rte-image-resize-handle {
      position: absolute;
      width: 10px;
      height: 10px;
      background: var(--color-surface);
      border: 1.5px solid var(--color-brand-blue);
      border-radius: 2px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.12s;
    }

    .rte-image-wrapper:hover .rte-image-resize-handle,
    .rte-image-wrapper.rte-image-selected .rte-image-resize-handle,
    .rte-image-wrapper.rte-image-resizing .rte-image-resize-handle {
      opacity: 1;
      pointer-events: auto;
    }

    .rte-image-resize-nw { top: -5px; left: -5px; cursor: nwse-resize; }
    .rte-image-resize-n  { top: -5px; left: 50%; margin-left: -5px; cursor: ns-resize; }
    .rte-image-resize-ne { top: -5px; right: -5px; cursor: nesw-resize; }
    .rte-image-resize-e  { top: 50%; right: -5px; margin-top: -5px; cursor: ew-resize; }
    .rte-image-resize-se { bottom: -5px; right: -5px; cursor: nwse-resize; }
    .rte-image-resize-s  { bottom: -5px; left: 50%; margin-left: -5px; cursor: ns-resize; }
    .rte-image-resize-sw { bottom: -5px; left: -5px; cursor: nesw-resize; }
    .rte-image-resize-w  { top: 50%; left: -5px; margin-top: -5px; cursor: ew-resize; }

    .rte-image-size-badge {
      position: absolute;
      right: 4px;
      bottom: 4px;
      padding: 0.1rem 0.375rem;
      border-radius: 4px;
      background: rgba(17, 24, 39, 0.78);
      color: #fff;
      font-size: 0.625rem;
      font-weight: 600;
      line-height: 1.4;
      opacity: 0;
      pointer-events: none;
    }

    .rte-image-wrapper.rte-image-selected .rte-image-size-badge,
    .rte-image-wrapper.rte-image-resizing .rte-image-size-badge {
      opacity: 1;
    }

    mark {
      padding: 0.05em 0.15em;
      border-radius: 3px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      margin: 0 0 0.625rem;
      overflow: hidden;

      td, th {
        border: 1px solid var(--color-gray-300);
        padding: 0.375rem 0.5rem;
        vertical-align: top;
        position: relative;
      }

      th {
        background: var(--color-gray-100);
        font-weight: 700;
        text-align: left;
      }

      .selectedCell::after {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--color-brand-blue-tint);
        pointer-events: none;
      }
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--color-brand-blue);
      cursor: col-resize;
    }

    .tiptap-mathematics-render {
      padding: 0 0.15rem;
      cursor: pointer;
      border-radius: 4px;

      &:hover { background: var(--color-brand-blue-tint); }
    }

    /* Placeholder only shows on the first empty line, like the native one */
    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
      color: var(--color-gray-400);
    }
  }
`

export const HeadingLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`

export const TextColorGlyph = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
`
