import { DOCXExporter, docxDefaultSchemaMappings } from '@blocknote/xl-docx-exporter'
import { Packer, Paragraph, TextRun, ExternalHyperlink } from 'docx'
import { editorSchema } from './schema'
import api from '@config/api'

/**
 * Get the export schema (for external use if needed)
 */
export function getExportSchema() {
  return editorSchema
}

/**
 * Convert blob URL to iDrive presigned URL
 * Example: http://localhost:5000/api/v1/blobs/57 -> https://idrive-url...
 */
async function resolveImageUrl(url) {
  try {
    // Check if this is a blob URL (matches any host with blob endpoint)
    // Matches: /api/v1/blobs/{id} or /api/v1/blobs/{id}/anything
    const blobUrlPattern = /\/api\/v1\/blobs\/(\d+)(?:\/|$)/
    const match = url.match(blobUrlPattern)

    if (match) {
      const blobId = match[1]
      console.log(`Resolving blob URL for blobId: ${blobId}`)

      // Call the new endpoint to get the presigned URL using axios
      const response = await api.get(`/api/v1/blobs/${blobId}/url`)

      console.log(`Resolved blob ${blobId} to: ${response.data.url}`)
      return response.data.url
    }

    // If not a blob URL, return as-is (might be external image or iDrive URL already)
    return url
  } catch (error) {
    console.error('Failed to resolve image URL:', url, error)
    // Return original URL as fallback
    return url
  }
}

/**
 * Replace localhost blob URLs with iDrive presigned URLs in blocks
 */
async function resolveBlockImageUrls(blocks) {
  const resolvedBlocks = []

  for (const block of blocks) {
    // Clone the block to avoid mutating the original
    const newBlock = { ...block }

    // If it's an image block, resolve the URL
    if (block.type === 'image' && block.props?.url) {
      const resolvedUrl = await resolveImageUrl(block.props.url)
      newBlock.props = {
        ...block.props,
        url: resolvedUrl
      }
    }

    // Recursively process children if they exist
    if (block.children && Array.isArray(block.children)) {
      newBlock.children = await resolveBlockImageUrls(block.children)
    }

    resolvedBlocks.push(newBlock)
  }

  return resolvedBlocks
}

/**
 * Export BlockNote blocks to DOCX file
 * @param {Array} blocks - BlockNote blocks array
 * @param {string} fileName - File name without extension
 * @param {Object} options - Document options
 * @param {string} options.title - Document title
 * @param {string} options.creator - Document creator
 * @param {string} options.description - Document description
 * @param {string} options.subject - Document subject
 * @returns {Promise<void>}
 */
export async function exportBlocksToDocx(blocks, fileName = 'document', options = {}) {
  try {
    // Use the shared schema from schema.js
    const schema = editorSchema

    // Resolve localhost blob URLs to iDrive presigned URLs
    console.log('Resolving image URLs in blocks...')
    const resolvedBlocks = await resolveBlockImageUrls(blocks)
    console.log('Image URLs resolved successfully')

    // Create custom mappings that include the embed block handler
    const customMappings = {
      ...docxDefaultSchemaMappings,
      blockMapping: {
        ...docxDefaultSchemaMappings.blockMapping,
        // Custom handler for embed blocks
        embed: (block) => {
          const url = block.props?.url || ''

          if (!url) {
            return new Paragraph({
              children: [
                new TextRun({
                  text: '[Embedded content - no URL specified]',
                  italics: true,
                  color: '666666',
                }),
              ],
            })
          }

          // Create a paragraph with a hyperlink
          return new Paragraph({
            children: [
              new TextRun({
                text: 'Embedded content: ',
                italics: true,
              }),
              new ExternalHyperlink({
                children: [
                  new TextRun({
                    text: url,
                    style: 'Hyperlink',
                    underline: {
                      type: 'single',
                    },
                    color: '0563C1',
                  }),
                ],
                link: url,
              }),
            ],
          })
        },
      },
    }

    // Create DOCX exporter with schema and custom mappings
    const exporter = new DOCXExporter(schema, customMappings)

    // Convert blocks to DOCX document with custom font settings
    const docxDocument = await exporter.toDocxJsDocument(resolvedBlocks, {
      documentOptions: {
        title: options.title || fileName,
        creator: options.creator || 'Mediko',
        description: options.description || '',
        subject: options.subject || '',
        // Configure default styles: Times New Roman, 12pt, 1.5 line spacing
        styles: {
          default: {
            document: {
              run: {
                font: 'Times New Roman',
                size: 24, // 12pt (size is in half-points)
              },
              paragraph: {
                spacing: {
                  line: 360, // 1.5 line spacing (360 = 1.5 * 240)
                },
              },
            },
          },
          paragraphStyles: [
            {
              id: 'Normal',
              name: 'Normal',
              basedOn: 'Normal',
              next: 'Normal',
              run: {
                font: 'Times New Roman',
                size: 24, // 12pt
              },
              paragraph: {
                spacing: {
                  line: 360, // 1.5 line spacing
                },
              },
            },
            {
              id: 'Heading1',
              name: 'Heading 1',
              basedOn: 'Normal',
              next: 'Normal',
              run: {
                font: 'Times New Roman',
                size: 32, // 16pt
                bold: true,
              },
              paragraph: {
                spacing: {
                  line: 360, // 1.5 line spacing
                  before: 240,
                  after: 120,
                },
              },
            },
            {
              id: 'Heading2',
              name: 'Heading 2',
              basedOn: 'Normal',
              next: 'Normal',
              run: {
                font: 'Times New Roman',
                size: 28, // 14pt
                bold: true,
              },
              paragraph: {
                spacing: {
                  line: 360, // 1.5 line spacing
                  before: 200,
                  after: 100,
                },
              },
            },
            {
              id: 'Heading3',
              name: 'Heading 3',
              basedOn: 'Normal',
              next: 'Normal',
              run: {
                font: 'Times New Roman',
                size: 26, // 13pt
                bold: true,
              },
              paragraph: {
                spacing: {
                  line: 360, // 1.5 line spacing
                  before: 160,
                  after: 80,
                },
              },
            },
          ],
        },
      },
    })

    // Convert to buffer and trigger download
    const buffer = await Packer.toBlob(docxDocument)

    // Create download link
    const url = window.URL.createObjectURL(buffer)
    const link = document.createElement('a')
    link.href = url
    link.download = `${fileName}.docx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    console.log('Successfully exported DOCX')
  } catch (error) {
    console.error('Failed to export DOCX:', error)
    throw new Error(`Gagal mengekspor DOCX: ${error.message}`)
  }
}

/**
 * Export from BlockNote editor instance
 * @param {Object} editor - BlockNote editor instance
 * @param {string} fileName - File name without extension
 * @param {Object} options - Document options
 * @returns {Promise<void>}
 */
export async function exportEditorToDocx(editor, fileName = 'document', options = {}) {
  if (!editor) {
    throw new Error('Editor instance is required')
  }

  const blocks = editor.document
  return exportBlocksToDocx(blocks, fileName, options)
}
