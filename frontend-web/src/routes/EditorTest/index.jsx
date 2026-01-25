import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer, Table, TableRow, TableCell, ImageRun, WidthType, VerticalAlign } from "docx";
import { saveAs } from "file-saver";
import {
  Container,
  Header,
  Title,
  EditorWrapper,
  OutputSection,
  OutputTitle,
  OutputContent,
  ButtonGroup
} from './EditorTest.styles'
import { useState } from 'react'
import Button from '@components/common/Button'

export default function EditorTest() {
  const [content, setContent] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to BlockNote! 👋",
      },
      {
        type: "paragraph",
        content: "Type / to see commands",
      },
    ],
  });

  // Update content on change
  const handleChange = () => {
    if (!editor) return
    const blocks = editor.document
    setContent(JSON.stringify(blocks, null, 2))
  }

  // Show loading if editor is not ready
  if (!editor) {
    return (
      <Container>
        <Header>
          <Title>📝 BlockNote Editor Test</Title>
        </Header>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading editor...</p>
        </div>
      </Container>
    )
  }

  // Convert BlockNote blocks to docx paragraphs
  const convertBlocksToDocx = async (blocks, level = 0) => {
    const docxElements = []

    for (const block of blocks) {
      try {
        // Convert content to TextRun objects with formatting
        const createTextRuns = (content) => {
          if (!content) return [new TextRun({ text: '', size: 24 })]

          return content.map(item => {
            if (typeof item === 'string') {
              return new TextRun({ text: item, size: 24 })
            }

            const styles = item.styles || {}
            return new TextRun({
              text: item.text || '',
              size: 24,
              bold: styles.bold || false,
              italics: styles.italic || false,
              underline: styles.underline ? {} : undefined,
              strike: styles.strike || false,
              font: styles.code ? 'Courier New' : undefined,
              shading: styles.code ? { fill: 'F0F0F0' } : undefined,
            })
          })
        }

        // Get plain text for simple blocks
        const text = block.content?.map(item => {
          if (typeof item === 'string') return item
          if (item.text) return item.text
          return ''
        }).join('') || ''

        // Handle different block types
        if (block.type === 'heading') {
          const headingLevelNum = block.props?.level || 1
          const headingLevel = headingLevelNum === 1 ? HeadingLevel.HEADING_1 :
                              headingLevelNum === 2 ? HeadingLevel.HEADING_2 :
                              HeadingLevel.HEADING_3

          const textRuns = createTextRuns(block.content)

          docxElements.push(
            new Paragraph({
              children: textRuns,
              heading: headingLevel,
            })
          )
        } else if (block.type === 'bulletListItem') {
          const textRuns = createTextRuns(block.content)

          docxElements.push(
            new Paragraph({
              children: textRuns,
              bullet: {
                level: level  // Use the nesting level
              },
              style: "Normal"
            })
          )
        } else if (block.type === 'numberedListItem') {
          const textRuns = createTextRuns(block.content)

          docxElements.push(
            new Paragraph({
              children: textRuns,
              numbering: {
                reference: "default-numbering",
                level: level  // Use the nesting level
              },
              style: "Normal"
            })
          )
        } else if (block.type === 'image') {
          // Handle image blocks
          const imageUrl = block.props?.url
          if (imageUrl) {
            try {
              // Fetch image and convert to base64
              const response = await fetch(imageUrl)
              const blob = await response.blob()
              const arrayBuffer = await blob.arrayBuffer()
              const buffer = new Uint8Array(arrayBuffer)

              docxElements.push(
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: buffer,
                      transformation: {
                        width: 500,
                        height: 350,
                      },
                    })
                  ],
                  spacing: {
                    before: 200,
                    after: 200,
                  }
                })
              )
            } catch (err) {
              console.error('Failed to load image:', err)
              // Add placeholder text if image fails
              docxElements.push(
                new Paragraph({
                  children: [new TextRun({
                    text: `[Image: ${imageUrl}]`,
                    italics: true,
                    size: 24
                  })]
                })
              )
            }
          }
        } else if (block.type === 'table') {
          // Handle table blocks
          const tableContent = block.content?.tableContent || []
          if (tableContent.length > 0) {
            const tableRows = tableContent.map(row => {
              const cells = row.cells?.map(cell => {
                const cellText = cell.content?.map(item => {
                  if (typeof item === 'string') return item
                  if (item.text) return item.text
                  return ''
                }).join('') || ''

                return new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({
                        text: cellText,
                        size: 24
                      })]
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER,
                })
              }) || []

              return new TableRow({ children: cells })
            })

            docxElements.push(
              new Table({
                rows: tableRows,
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
              })
            )
          }
        } else if (block.type === 'codeBlock') {
          // Handle code blocks
          const code = block.content?.map(item => {
            if (typeof item === 'string') return item
            if (item.text) return item.text
            return ''
          }).join('\n') || ''

          docxElements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: code,
                  size: 20,  // Slightly smaller for code
                  font: 'Courier New',
                })
              ],
              shading: {
                fill: 'F5F5F5',
              },
              indent: level > 0 ? {
                left: 720 * level
              } : undefined,
              spacing: {
                before: 100,
                after: 100,
              }
            })
          )
        } else if (block.type === 'checkListItem') {
          // Handle checklist/to-do items
          const isChecked = block.props?.checked || false
          const checkbox = isChecked ? '☑' : '☐'

          docxElements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${checkbox} ${text}`,
                  size: 24
                })
              ],
              indent: level > 0 ? {
                left: 720 * level
              } : undefined
            })
          )
        } else {
          // Default paragraph with formatting and indentation
          const textRuns = createTextRuns(block.content)

          docxElements.push(
            new Paragraph({
              children: textRuns,
              indent: level > 0 ? {
                left: 720 * level  // 720 twips = 0.5 inch per level
              } : undefined
            })
          )
        }

        // Handle nested children recursively with incremented level
        if (block.children && block.children.length > 0) {
          const childElements = await convertBlocksToDocx(block.children, level + 1)
          docxElements.push(...childElements)
        }
      } catch (err) {
        console.error('Error converting block:', block, err)
      }
    }

    return docxElements
  }

  // Export to Word
  const handleExportToWord = async () => {
    try {
      setIsExporting(true)

      // 1. Get blocks from editor
      const blocks = editor.document

      // 2. Convert blocks to docx format
      const docxParagraphs = await convertBlocksToDocx(blocks)

      // 3. Create document
      const doc = new Document({
        numbering: {
          config: [
            {
              reference: "default-numbering",
              levels: [
                {
                  level: 0,
                  format: "decimal",
                  text: "%1.",
                  alignment: AlignmentType.START,
                },
                {
                  level: 1,
                  format: "decimal",
                  text: "%2.",
                  alignment: AlignmentType.START,
                },
                {
                  level: 2,
                  format: "decimal",
                  text: "%3.",
                  alignment: AlignmentType.START,
                },
                {
                  level: 3,
                  format: "decimal",
                  text: "%4.",
                  alignment: AlignmentType.START,
                },
                {
                  level: 4,
                  format: "decimal",
                  text: "%5.",
                  alignment: AlignmentType.START,
                }
              ]
            }
          ]
        },
        sections: [
          {
            children: docxParagraphs.length > 0 ? docxParagraphs : [
              new Paragraph({ children: [new TextRun("Empty document")] })
            ]
          }
        ]
      })

      // 4. Generate and download
      const blob = await Packer.toBlob(doc)
      saveAs(blob, `document-${Date.now()}.docx`)

      alert('Document exported successfully!')
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export document: ' + error.message)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Container>
      <Header>
        <Title>📝 BlockNote Editor Test</Title>
      </Header>

      <EditorWrapper>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>Try it out:</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
              Type <strong>/</strong> for commands (headings, lists, images, tables) • <strong>Tab</strong> to indent • <strong>Shift+Tab</strong> to unindent
            </p>
          </div>
          <ButtonGroup>
            <Button onClick={handleExportToWord} disabled={isExporting}>
              {isExporting ? '⏳ Exporting...' : '📥 Export to Word'}
            </Button>
          </ButtonGroup>
        </div>

        <BlockNoteView
          editor={editor}
          onChange={handleChange}
          theme="light"
          onKeyDown={(e) => {
            // Prevent tab from leaving the editor
            if (e.key === 'Tab') {
              e.stopPropagation()
              // Let BlockNote handle the tab for indentation
              // Don't prevent default - let BlockNote's native handler work
            }
          }}
        />
      </EditorWrapper>

      <OutputSection>
        <OutputTitle>📄 Output JSON</OutputTitle>
        <OutputContent>
          <pre>{content || 'Start typing to see the output...'}</pre>
        </OutputContent>
      </OutputSection>
    </Container>
  )
}
