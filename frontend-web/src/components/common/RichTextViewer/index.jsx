import DOMPurify from 'dompurify'
import { isRichTextEmpty } from '@utils/richTextUtils'
import { ViewerBody } from './RichTextViewer.styles'
import 'katex/dist/katex.min.css'

// Renders HTML produced by RichTextEditor. The content is admin-authored, but it is
// sanitised anyway so a stored payload can never execute in a student's browser.
export default function RichTextViewer({ html, className }) {
  if (isRichTextEmpty(html)) return null

  const clean = DOMPurify.sanitize(String(html), {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'code', 'pre',
      'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'hr',
      'a', 'img', 'span', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'colgroup', 'col',
      // KaTeX renders to spans plus an optional MathML tree
      'math', 'semantics', 'annotation', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub',
      'msubsup', 'mfrac', 'msqrt', 'mroot', 'mtext', 'mspace', 'mtable', 'mtr', 'mtd',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title', 'style', 'class', 'width', 'height',
      'colspan', 'rowspan', 'colwidth', 'aria-hidden', 'data-latex', 'encoding',
    ],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|data:image\/)/i,
  })

  return <ViewerBody className={className} dangerouslySetInnerHTML={{ __html: clean }} />
}
