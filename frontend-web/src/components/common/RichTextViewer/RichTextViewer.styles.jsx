import styled from 'styled-components'

// Typography for rich text coming out of RichTextEditor. Kept deliberately close to the
// surrounding body copy so an explanation does not shout louder than the question above it.
export const ViewerBody = styled.div`
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--color-gray-700);
  word-break: break-word;

  > :first-child { margin-top: 0; }
  > :last-child { margin-bottom: 0; }

  p { margin: 0 0 0.625rem; }

  h1, h2, h3, h4 {
    color: var(--color-gray-900);
    line-height: 1.4;
    margin: 1rem 0 0.5rem;
  }
  h1 { font-size: 1.125rem; }
  h2 { font-size: 1.0625rem; }
  h3 { font-size: 1rem; }
  h4 { font-size: 0.9375rem; }

  strong, b { font-weight: 700; color: var(--color-gray-900); }
  u { text-decoration: underline; }
  s { text-decoration: line-through; }

  ul, ol { margin: 0 0 0.625rem; padding-left: 1.25rem; }
  li { margin-bottom: 0.25rem; }

  blockquote {
    margin: 0 0 0.625rem;
    padding: 0.5rem 0.875rem;
    border-left: 3px solid var(--color-gray-300);
    background: var(--color-gray-50);
    border-radius: 0 6px 6px 0;
    color: var(--color-gray-500);
  }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.875em;
    background: var(--color-gray-100);
    padding: 0.1rem 0.3rem;
    border-radius: 4px;
  }

  pre {
    background: var(--color-gray-100);
    padding: 0.75rem 0.875rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 0 0 0.625rem;

    code { background: none; padding: 0; }
  }

  hr {
    border: none;
    border-top: 1px solid var(--color-gray-200);
    margin: 0.875rem 0;
  }

  a {
    color: var(--color-brand-blue);
    text-decoration: underline;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 0.375rem 0;
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

    td, th {
      border: 1px solid var(--color-gray-300);
      padding: 0.375rem 0.5rem;
      vertical-align: top;
    }

    th {
      background: var(--color-gray-100);
      font-weight: 700;
      text-align: left;
      color: var(--color-gray-900);
    }
  }

  .tiptap-mathematics-render { padding: 0 0.15rem; }

  [style*='text-align: center'] { text-align: center; }
  [style*='text-align: right'] { text-align: right; }

  /* An <img> cannot centre itself with text-align, which is what the editor writes onto
     the node — turn that into the margins that actually move it. */
  img[style*='text-align: center'] {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  img[style*='text-align: right'] {
    display: block;
    margin-left: auto;
    margin-right: 0;
  }
  img[style*='text-align: left'] {
    display: block;
    margin-left: 0;
    margin-right: auto;
  }
`
