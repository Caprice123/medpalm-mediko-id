// Pure helpers that read a BlockNote document (the array stored in
// summary_notes.content) without any React/Redux involvement.
//
// A BlockNote block looks like:
//   { id, type: 'heading', props: { level }, content: [{ type: 'text', text }], children: [] }
// Inline content nests — a heading with a bolded word or a link is several inline
// nodes, not one — so text is flattened recursively rather than read off
// `content[0].text`, which would silently drop part of the heading.

const WORDS_PER_MINUTE = 180 // deliberately conservative: dense clinical prose, not blog copy

function inlineText(content) {
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content
    .map(node => {
      if (typeof node === 'string') return node
      if (typeof node?.text === 'string') return node.text
      if (node?.content) return inlineText(node.content)
      return ''
    })
    .join('')
}

function walk(blocks, visit) {
  if (!Array.isArray(blocks)) return
  for (const block of blocks) {
    if (!block) continue
    visit(block)
    if (Array.isArray(block.children)) walk(block.children, visit)
  }
}

// Headings only from the top level: a heading nested inside a list or column is
// not a document section, and putting it in the outline would make the table of
// contents disagree with the page's visual structure.
export function extractOutline(blocks) {
  if (!Array.isArray(blocks)) return []
  return blocks
    .filter(block => block?.type === 'heading' && block.id)
    .map(block => ({
      id: block.id,
      level: Number(block.props?.level) || 1,
      text: inlineText(block.content).trim(),
    }))
    .filter(heading => heading.text.length > 0)
}

export function estimateReadingMinutes(blocks) {
  let words = 0
  walk(blocks, block => {
    const text = inlineText(block.content).trim()
    if (text) words += text.split(/\s+/).length
  })
  if (words === 0) return 0
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
