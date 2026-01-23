/**
 * Extract text content from a content array
 * @param {Array} content - BlockNote content array
 * @returns {string} - Plain text
 */
function extractTextFromContent(content) {
  if (!content || !Array.isArray(content)) {
    return ''
  }

  return content
    .map((item) => {
      if (typeof item === 'string') {
        return item
      }
      if (item.type === 'text') {
        return item.text || ''
      }
      if (item.type === 'link' && item.content) {
        return extractTextFromContent(item.content)
      }
      return ''
    })
    .join('')
}

/**
 * Convert a single BlockNote block to Markdown
 * @param {Object} block - BlockNote block
 * @returns {string} - Markdown string
 */
function blockToMarkdown(block) {
  const type = block.type
  const content = extractTextFromContent(block.content)

  switch (type) {
    case 'heading': {
      const level = block.props?.level || 1
      const prefix = '#'.repeat(level)
      return `${prefix} ${content}\n`
    }

    case 'paragraph': {
      return content ? `${content}\n` : '\n'
    }

    case 'bulletListItem': {
      const text = content || ''
      let result = `- ${text}\n`
      // Process children recursively
      if (block.children && block.children.length > 0) {
        const childrenMd = block.children
          .map((child) => blockToMarkdown(child))
          .join('')
          .split('\n')
          .map((line) => (line ? `  ${line}` : line))
          .join('\n')
        result += childrenMd
      }
      return result
    }

    case 'numberedListItem': {
      const text = content || ''
      let result = `1. ${text}\n`
      // Process children recursively
      if (block.children && block.children.length > 0) {
        const childrenMd = block.children
          .map((child) => blockToMarkdown(child))
          .join('')
          .split('\n')
          .map((line) => (line ? `   ${line}` : line))
          .join('\n')
        result += childrenMd
      }
      return result
    }

    case 'checkListItem': {
      const checked = block.props?.checked ? 'x' : ' '
      const text = content || ''
      return `- [${checked}] ${text}\n`
    }

    case 'table': {
      // Tables are complex, just add a placeholder or skip
      return `[Table]\n`
    }

    case 'image': {
      const url = block.props?.url || ''
      const caption = block.props?.caption || 'Image'
      return `![${caption}](${url})\n`
    }

    case 'video':
    case 'audio':
    case 'file':
    case 'embed': {
      // Skip embeds and media in markdown
      return ''
    }

    case 'codeBlock': {
      const language = block.props?.language || ''
      return `\`\`\`${language}\n${content}\n\`\`\`\n`
    }

    default: {
      // For unknown types, just extract text content
      return content ? `${content}\n` : ''
    }
  }
}

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
    const markdown = blocks.map((block) => blockToMarkdown(block)).join('\n')
    return markdown
  } catch (error) {
    console.error('Failed to convert blocks to markdown:', error)
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

    console.log(blocks)

    // Use BlockNote's official markdown converter
    const markdown = blocksToMarkdown(blocks)
    return markdown.trim()
  } catch (error) {
    console.error('Error converting BlockNote to markdown:', error)
    return ''
  }
}
