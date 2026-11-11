// Mermaid rejects unquoted node labels containing characters that are part of its
// grammar - `A[Foo (bar)]` fails with "got 'PS'". Quoting the label (`A["Foo (bar)"]`)
// is the documented fix. The LLM that generates these diagrams does not reliably quote.
//
// This only runs as a rescue, after an unmodified parse has already failed, so it is
// free to be aggressive: it quotes every node label it can find.

// Longest delimiters first, so `[[` is consumed before `[` and `((` before `(`.
const SHAPES = [
  ['[[', ']]'], // subroutine
  ['[(', ')]'], // cylinder
  ['([', '])'], // stadium
  ['((', '))'], // circle
  ['{{', '}}'], // hexagon
  ['[/', '/]'], // parallelogram
  ['[\\', '\\]'], // parallelogram alt
  ['[', ']'], // rectangle
  ['{', '}'], // rhombus
  ['(', ')'], // rounded
]

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// A label may legitimately contain a delimiter that isn't its own - `[Foo (bar)]` is the
// whole point - so each shape only excludes the characters of its own delimiters.
const contentClass = (open, close) =>
  `[^${escapeRegExp([...new Set(open + close)].join(''))}\\n]*?`

// Skip labels this pass already quoted (an earlier, longer shape matched first) and
// Mermaid's own entity syntax (`#quot;`), which must not be wrapped.
const isSafe = (label) => label.trim() === '' || label.includes('"') || label.includes('#')

export const sanitizeMermaid = (mermaidText) => {
  if (typeof mermaidText !== 'string') return mermaidText

  return SHAPES.reduce((text, [open, close]) => {
    const pattern = new RegExp(
      `([A-Za-z0-9_-]+)${escapeRegExp(open)}(${contentClass(open, close)})${escapeRegExp(close)}`,
      'g',
    )
    return text.replace(pattern, (match, id, label) =>
      isSafe(label) ? match : `${id}${open}"${label}"${close}`,
    )
  }, mermaidText)
}
