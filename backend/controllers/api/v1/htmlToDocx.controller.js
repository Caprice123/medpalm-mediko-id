import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import axios from 'axios';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

/**
 * Parse simple HTML and convert to DOCX using the docx package
 * This is more reliable for image handling
 */
export const convertHtmlToDocxWithImages = async (req, res) => {
  try {
    const { htmlContent, fileName = 'document' } = req.body;

    if (!htmlContent) {
      return res.status(400).json({
        message: 'HTML content is required'
      });
    }

    // Convert all image URLs to base64 FIRST
    const htmlWithBase64Images = await convertImagesToBase64InHtml(htmlContent)
    console.log(htmlWithBase64Images)

    const dom = new JSDOM(htmlWithBase64Images);
    const document = dom.window.document;

    const children = [];

    // Helper function to check and process images in any element
    const processImageInElement = async (element) => {
      const imgElement = element.querySelector('img');
      if (imgElement) {
        const src = imgElement.getAttribute('src');
        if (src) {
          try {
            const imageData = await fetchImageWithType(src);
            return new Paragraph({
              children: [
                new ImageRun({
                  data: imageData.buffer,
                  transformation: {
                    width: 600,
                    height: 400,
                  },
                  type: imageData.type,
                }),
              ],
              alignment: AlignmentType.CENTER,
            });
          } catch (error) {
            console.error('Failed to add image:', error.message);
            return new Paragraph({
              text: `[Image could not be loaded: ${error.message}]`,
              italics: true,
            });
          }
        }
      }
      return null;
    };

    // Process each element in the body
    for (const element of document.body.children) {
      const tagName = element.tagName.toLowerCase();

      // First check if ANY element contains an image
      const imageParagraph = await processImageInElement(element);
      if (imageParagraph) {
        children.push(imageParagraph);
        continue; // Skip normal processing if we found an image
      }

      // Normal element processing (no images)
      if (tagName === 'h1') {
        children.push(
          new Paragraph({
            text: element.textContent,
            heading: HeadingLevel.HEADING_1,
          })
        );
      } else if (tagName === 'h2') {
        children.push(
          new Paragraph({
            text: element.textContent,
            heading: HeadingLevel.HEADING_2,
          })
        );
      } else if (tagName === 'h3') {
        children.push(
          new Paragraph({
            text: element.textContent,
            heading: HeadingLevel.HEADING_3,
          })
        );
      } else if (tagName === 'p') {
        const runs = [];
        parseInlineElements(element, runs);
        if (runs.length > 0) {
          children.push(new Paragraph({ children: runs }));
        } else {
          children.push(new Paragraph({ text: '' }));
        }
      } else if (tagName === 'img') {
        // Direct img tag (shouldn't happen due to helper, but keep for safety)
        const src = element.getAttribute('src');
        if (src) {
          try {
            const imageData = await fetchImageWithType(src);
            children.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageData.buffer,
                    transformation: {
                      width: 600,
                      height: 400,
                    },
                    type: imageData.type,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              })
            );
          } catch (error) {
            console.error('Failed to add image:', error.message);
            children.push(
              new Paragraph({
                text: `[Image could not be loaded: ${error.message}]`,
                italics: true,
              })
            );
          }
        }
      } else if (tagName === 'ul' || tagName === 'ol') {
        // Handle lists
        for (const li of element.children) {
          children.push(
            new Paragraph({
              text: li.textContent,
              bullet: { level: 0 },
            })
          );
        }
      } else if (tagName === 'table') {
        // Handle tables
        try {
          const tableElement = await parseTable(element);
          children.push(tableElement);
        } catch (error) {
          console.error('Failed to parse table:', error.message);
          children.push(
            new Paragraph({
              text: '[Table could not be rendered]',
              italics: true,
            })
          );
        }
      } else {
        // Default: treat as paragraph
        children.push(
          new Paragraph({
            text: element.textContent,
          })
        );
      }
    }

    // Create the document with proper properties
    const doc = new Document({
      creator: "Mediko App",
      title: fileName,
      description: "Generated from HTML",
      styles: {
        default: {
          document: {
            run: {
              font: "Times New Roman",
              size: 24, // 12pt (size is in half-points, so 24 = 12pt)
            },
            paragraph: {
              spacing: {
                line: 276, // 1.15 line spacing
                before: 0,
                after: 160,
              },
            },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}.docx"`);
    res.setHeader('Content-Length', buffer.length);

    // Send the buffer
    res.send(buffer);
  } catch (error) {
    console.error('Error converting HTML to DOCX:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to convert HTML to DOCX',
      error: error.message
    });
  }
};

/**
 * Parse inline elements (bold, italic, etc.)
 */
function parseInlineElements(element, runs) {
  for (const node of element.childNodes) {
    if (node.nodeType === 3) { // Text node
      const text = node.textContent;
      if (text && text.trim()) {
        runs.push(new TextRun({ text }));
      }
    } else if (node.nodeType === 1) { // Element node
      const tagName = node.tagName.toLowerCase();
      const text = node.textContent;

      if (text && text.trim()) {
        if (tagName === 'strong' || tagName === 'b') {
          runs.push(new TextRun({ text, bold: true }));
        } else if (tagName === 'em' || tagName === 'i') {
          runs.push(new TextRun({ text, italics: true }));
        } else if (tagName === 'u') {
          runs.push(new TextRun({ text, underline: {} }));
        } else {
          runs.push(new TextRun({ text }));
        }
      }
    }
  }
}

/**
 * Parse HTML table element to docx Table
 */
async function parseTable(tableElement) {
  const rows = [];

  // Process thead
  const thead = tableElement.querySelector('thead');
  if (thead) {
    for (const tr of thead.querySelectorAll('tr')) {
      const cells = [];
      for (const cell of tr.querySelectorAll('th, td')) {
        cells.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: cell.textContent.trim(), bold: true })],
              }),
            ],
            shading: {
              fill: 'CCCCCC', // Light gray background for headers
            },
          })
        );
      }
      rows.push(new TableRow({ children: cells }));
    }
  }

  // Process tbody
  const tbody = tableElement.querySelector('tbody');
  const bodyRows = tbody ? tbody.querySelectorAll('tr') : tableElement.querySelectorAll('tr');

  for (const tr of bodyRows) {
    const cells = [];
    for (const cell of tr.querySelectorAll('th, td')) {
      cells.push(
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: cell.textContent.trim() })],
            }),
          ],
        })
      );
    }
    if (cells.length > 0) {
      rows.push(new TableRow({ children: cells }));
    }
  }

  return new Table({
    rows: rows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
      left: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
      right: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
      insideVertical: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
    },
  });
}

/**
 * Decode HTML entities in a string
 */
function decodeHtmlEntities(text) {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'"
  };
  return text.replace(/&[a-z]+;|&#\d+;/gi, entity => entities[entity] || entity);
}

/**
 * Convert all image URLs in HTML to base64 data URIs
 */
async function convertImagesToBase64InHtml(htmlContent) {
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  const imageUrls = [];

  // Extract all image URLs
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const encodedUrl = match[1];
    const decodedUrl = decodeHtmlEntities(encodedUrl);

    // Only process HTTP/HTTPS URLs, skip data URIs
    if (decodedUrl.startsWith('http://') || decodedUrl.startsWith('https://')) {
      imageUrls.push({ encoded: encodedUrl, decoded: decodedUrl });
    }
  }

  // Convert all images to base64
  let updatedHtml = htmlContent;
  for (const urlObj of imageUrls) {
    try {
      const response = await axios.get(urlObj.decoded, {
        responseType: 'arraybuffer',
        timeout: 15000,
      });

      const contentType = response.headers['content-type'] || 'image/png';
      const base64 = Buffer.from(response.data).toString('base64');
      const dataUri = `data:${contentType};base64,${base64}`;

      // Replace the ENCODED URL in HTML with base64 data URI
      const escapedUrl = urlObj.encoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      updatedHtml = updatedHtml.replace(new RegExp(escapedUrl, 'g'), dataUri);
    } catch (error) {
      console.error(`Failed to convert image: ${error.message}`);
    }
  }

  return updatedHtml;
}

/**
 * Fetch image from URL or base64 with type detection
 */
async function fetchImageWithType(src) {
  let buffer;
  let mimeType;

  if (src.startsWith('data:')) {
    // Base64 data URI
    const matches = src.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid data URI format');
    }

    mimeType = matches[1];
    const base64Data = matches[2];
    buffer = Buffer.from(base64Data, 'base64');
  } else {
    // External URL
    const response = await axios.get(src, {
      responseType: 'arraybuffer',
      timeout: 15000,
    });

    mimeType = response.headers['content-type'] || 'image/png';
    buffer = Buffer.from(response.data);
  }

  // Map MIME type to docx image type
  let imageType;
  if (mimeType.includes('png')) {
    imageType = 'png';
  } else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
    imageType = 'jpg';
  } else if (mimeType.includes('gif')) {
    imageType = 'gif';
  } else if (mimeType.includes('bmp')) {
    imageType = 'bmp';
  } else {
    imageType = 'png';
  }

  return { buffer, type: imageType };
}
