import { useCallback, useRef, useState } from 'react'
import DOMPurify from 'dompurify'
import { PhotoSlider } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { isRichTextEmpty } from '@utils/richTextUtils'
import { PhotoViewerToolbar } from '@components/common/PhotoViewerToolbar'
import { ViewerBody } from './RichTextViewer.styles'
import 'katex/dist/katex.min.css'

// Renders HTML produced by RichTextEditor. The content is admin-authored, but it is
// sanitised anyway so a stored payload can never execute in a student's browser.
export default function RichTextViewer({ html, className }) {
  const bodyRef = useRef(null)
  const [images, setImages] = useState([])
  const [photoIndex, setPhotoIndex] = useState(0)
  const [photoVisible, setPhotoVisible] = useState(false)

  // The HTML is injected rather than rendered as React, so there is no per-image element to
  // wrap in a PhotoView. The click is caught on the container instead and the gallery read
  // off the DOM, which also lets the lightbox page through every image in the document.
  const handleClick = useCallback((event) => {
    const target = event.target
    if (target.tagName !== 'IMG') return
    // An image used as a link stays a link.
    if (target.closest('a')) return

    const sources = Array.from(bodyRef.current?.querySelectorAll('img') || [])
      .map(img => img.currentSrc || img.src)
      .filter(Boolean)
    const clickedIndex = sources.indexOf(target.currentSrc || target.src)

    setImages(sources)
    setPhotoIndex(clickedIndex >= 0 ? clickedIndex : 0)
    setPhotoVisible(true)
  }, [])

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
    // DOMPurify URI-checks every attribute it does not already know to be URI-free, so the
    // strict regexp above silently dropped plain-value attributes too: the width/height an
    // admin resized an image to, a table's colspan/rowspan/colwidth, a link's target/rel.
    // Declaring them URI-safe skips that check for values that are never URLs — href and
    // src stay checked.
    ADD_URI_SAFE_ATTR: ['width', 'height', 'colspan', 'rowspan', 'colwidth', 'target', 'rel', 'encoding'],
  })

  return (
    <>
      <ViewerBody
        ref={bodyRef}
        className={className}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: clean }}
      />

      <PhotoSlider
        images={images.map((src, i) => ({ key: i, src }))}
        visible={photoVisible}
        onClose={() => setPhotoVisible(false)}
        afterClose={() => setPhotoIndex(0)}
        index={photoIndex}
        onIndexChange={setPhotoIndex}
        maskOpacity={0.9}
        toolbarRender={(props) => <PhotoViewerToolbar {...props} />}
      />
    </>
  )
}
