import { BlockNoteEditor } from "@blocknote/core"

/**
 * Convert markdown text to BlockNote blocks structure using built-in parser
 * This is much more reliable than custom parsing
 */
export function markdownToBlocks(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return [{
      type: "paragraph",
      content: []
    }]
  }

  try {
    // Use BlockNote's built-in markdown parser
    const editor = BlockNoteEditor.create()
    const blocks = editor.tryParseMarkdownToBlocks(markdown)
    editor.destroy() // Clean up the editor instance

    return blocks && blocks.length > 0 ? blocks : [{
      type: "paragraph",
      content: []
    }]
  } catch (error) {
    console.error('Failed to parse markdown:', error)
    // Fallback to custom parser if built-in fails
    return customMarkdownParser(markdown)
  }
}

/**
 * Fallback custom parser (in case built-in fails)
 */
function customMarkdownParser(markdown) {

  const lines = markdown.split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmedLine = line.trim()

    // Skip empty lines
    if (!trimmedLine) {
      i++
      continue
    }

    // Check for code blocks (```)
    if (trimmedLine.startsWith('```')) {
      const language = trimmedLine.slice(3).trim()
      const codeLines = []
      i++ // Skip opening ```

      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // Skip closing ```

      blocks.push({
        type: "codeBlock",
        props: {
          language: language || "plaintext"
        },
        content: [{
          type: "text",
          text: codeLines.join('\n'),
          styles: {}
        }]
      })
      continue
    }

    // Check for tables (| header | header |)
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      const tableLines = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }

      // Parse table
      if (tableLines.length >= 2) {
        // First line is header, second is separator, rest is data
        const headerCells = parseTableRow(tableLines[0])
        const dataRows = tableLines.slice(2).map(parseTableRow)

        blocks.push({
          type: "table",
          content: {
            type: "tableContent",
            rows: [
              {
                cells: headerCells.map(cell => [
                  {
                    type: "text",
                    text: cell,
                    styles: { bold: true }
                  }
                ])
              },
              ...dataRows.map(row => ({
                cells: row.map(cell => [
                  {
                    type: "text",
                    text: cell,
                    styles: {}
                  }
                ])
              }))
            ]
          }
        })
      }
      continue
    }

    // Check for headings (# ## ###)
    const headingMatch = trimmedLine.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2]

      blocks.push({
        type: "heading",
        props: {
          level: level
        },
        content: parseInlineFormatting(text)
      })
      i++
      continue
    }

    // Check for bullet lists with indentation (-, *, or spaces before)
    const bulletMatch = line.match(/^(\s*)[-*]\s+(.+)$/)
    if (bulletMatch) {
      const result = parseListItems(lines, i, 'bulletListItem')
      blocks.push(...result.blocks)
      i = result.nextIndex
      continue
    }

    // Check for numbered lists with indentation (1., 2., etc.)
    const numberedMatch = line.match(/^(\s*)\d+\.\s+(.+)$/)
    if (numberedMatch) {
      const result = parseListItems(lines, i, 'numberedListItem')
      blocks.push(...result.blocks)
      i = result.nextIndex
      continue
    }

    // Default: regular paragraph
    blocks.push({
      type: "paragraph",
      content: parseInlineFormatting(trimmedLine)
    })
    i++
  }

  // Return at least one empty paragraph if no blocks were created
  return blocks.length > 0 ? blocks : [{
    type: "paragraph",
    content: []
  }]
}

// Export the fallback parser for testing if needed
export { customMarkdownParser }

/**
 * Parse list items and build nested structure
 */
function parseListItems(lines, startIndex, listType) {
  const listPattern = listType === 'bulletListItem'
    ? /^(\s*)[-*]\s+(.+)$/
    : /^(\s*)\d+\.\s+(.+)$/

  const topLevelBlocks = []
  const stack = [] // Stack to track parent blocks at each level
  let currentIndex = startIndex

  while (currentIndex < lines.length) {
    const line = lines[currentIndex]
    const match = line.match(listPattern)

    if (!match) {
      // Not a list item anymore, stop parsing
      break
    }

    const spaceCount = match[1].length
    const level = Math.floor(spaceCount / 4)
    const text = match[2]

    const block = {
      type: listType,
      content: parseInlineFormatting(text),
      children: []
    }

    // Find the correct parent based on level
    if (level === 0) {
      // Top-level item
      topLevelBlocks.push(block)
      stack[0] = block
      stack.length = 1 // Clear deeper levels
    } else {
      // Nested item - add to parent's children
      const parent = stack[level - 1]
      if (parent) {
        parent.children.push(block)
      } else {
        // No parent found, treat as top-level
        topLevelBlocks.push(block)
      }
      stack[level] = block
      stack.length = level + 1 // Clear deeper levels
    }

    currentIndex++
  }

  return {
    blocks: topLevelBlocks,
    nextIndex: currentIndex
  }
}

/**
 * Parse table row into cells
 */
function parseTableRow(row) {
  return row
    .split('|')
    .slice(1, -1) // Remove first and last empty strings
    .map(cell => cell.trim())
}

/**
 * Parse inline markdown formatting (bold, italic, code, etc.)
 * Returns array of text objects with styles
 */
function parseInlineFormatting(text) {
  if (!text) return []

  const parts = []
  let currentPos = 0

  // Process markdown sequentially to avoid overlapping issues
  while (currentPos < text.length) {
    const remaining = text.substring(currentPos)
    let matched = false

    // Try to match patterns in order of precedence (longest first to avoid conflicts)
    // Bold + Italic (***text***)
    const boldItalicMatch = remaining.match(/^\*\*\*(.+?)\*\*\*/)
    if (boldItalicMatch) {
      parts.push({
        type: "text",
        text: boldItalicMatch[1],
        styles: { bold: true, italic: true }
      })
      currentPos += boldItalicMatch[0].length
      matched = true
      continue
    }

    // Bold (**text** or __text__)
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/) || remaining.match(/^__(.+?)__/)
    if (boldMatch) {
      parts.push({
        type: "text",
        text: boldMatch[1],
        styles: { bold: true }
      })
      currentPos += boldMatch[0].length
      matched = true
      continue
    }

    // Italic (*text* or _text_)
    const italicMatch = remaining.match(/^\*(.+?)\*/) || remaining.match(/^_(.+?)_/)
    if (italicMatch) {
      parts.push({
        type: "text",
        text: italicMatch[1],
        styles: { italic: true }
      })
      currentPos += italicMatch[0].length
      matched = true
      continue
    }

    // Code (`text`)
    const codeMatch = remaining.match(/^`(.+?)`/)
    if (codeMatch) {
      parts.push({
        type: "text",
        text: codeMatch[1],
        styles: { code: true }
      })
      currentPos += codeMatch[0].length
      matched = true
      continue
    }

    // Strikethrough (~~text~~)
    const strikeMatch = remaining.match(/^~~(.+?)~~/)
    if (strikeMatch) {
      parts.push({
        type: "text",
        text: strikeMatch[1],
        styles: { strike: true }
      })
      currentPos += strikeMatch[0].length
      matched = true
      continue
    }

    // No match found, add one character as plain text
    if (!matched) {
      const char = text[currentPos]
      // Append to last part if it's plain text, otherwise create new part
      if (parts.length > 0 && Object.keys(parts[parts.length - 1].styles).length === 0) {
        parts[parts.length - 1].text += char
      } else {
        parts.push({
          type: "text",
          text: char,
          styles: {}
        })
      }
      currentPos++
    }
  }

  // If no parts created, return plain text
  return parts.length > 0 ? parts : [{
    type: "text",
    text: text,
    styles: {}
  }]
}
