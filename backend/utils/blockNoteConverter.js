import { BlockNoteEditor } from '@blocknote/core'

/**
 * Convert BlockNote blocks to Markdown format
 * @param {Array} blocks - BlockNote blocks array
 * @returns {string} - Markdown string
 */
export function blocksToMarkdown(blocks) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return ''
  }

  try {
    // Use BlockNote's built-in method to convert blocks to markdown
    const editor = BlockNoteEditor.create()
    const markdown = editor.blocksToMarkdownLossy(blocks)
    editor.destroy() // Clean up
    return markdown
  } catch (error) {
    console.error('Failed to convert blocks to markdown:', error)
    // Fallback to empty string
    return ''
  }
}

/**
 * Convert BlockNote JSON content to markdown using official BlockNote API
 * @param {string|Array|Object} content - BlockNote content (JSON string or parsed object)
 * @returns {string} - Markdown string
 */
export function blockNoteToMarkdown(content) {
  try {
    // Parse content if it's a string
    const blocks = typeof content === 'string' ? JSON.parse(content) : content

    if (!Array.isArray(blocks)) {
      console.warn('Content is not an array of blocks')
      return ''
    }

    // Use BlockNote's official markdown converter
    const markdown = blocksToMarkdown(blocks)
    return markdown.trim()
  } catch (error) {
    console.error('Error converting BlockNote to markdown:', error)
    return ''
  }
}
