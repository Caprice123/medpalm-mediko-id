import Image from '@tiptap/extension-image'

const MIN_SIZE = 40
const MAX_SIZE = 2000
const HANDLE_DIRECTIONS = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

// Custom image node that keeps width/height as plain HTML attributes rather than inline
// style, so the stored HTML stays a single <img src width height> tag — nothing extra for
// the viewer's sanitiser to allow, and no wrapper markup to parse back.
const ResizableImage = Image.extend({
  name: 'image',

  addAttributes() {
    const toInt = (element, attribute) => {
      const value = element.getAttribute(attribute)
      return value ? parseInt(value, 10) : null
    }

    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => toInt(element, 'width'),
        renderHTML: (attributes) => (attributes.width ? { width: attributes.width } : {}),
      },
      height: {
        default: null,
        parseHTML: (element) => toInt(element, 'height'),
        renderHTML: (attributes) => (attributes.height ? { height: attributes.height } : {}),
      },
    }
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      // The wrapper stays inline-block so the eight handles hug the image itself; a
      // block-level container around it is what text-align can actually act on.
      const container = document.createElement('div')
      container.className = 'rte-image-align'

      const wrapper = document.createElement('span')
      wrapper.className = 'rte-image-wrapper'

      const img = document.createElement('img')
      img.className = 'rte-image'

      const applyAttrs = (attrs) => {
        container.style.textAlign = attrs.textAlign || ''
        img.src = attrs.src
        if (attrs.alt) img.setAttribute('alt', attrs.alt); else img.removeAttribute('alt')
        if (attrs.title) img.setAttribute('title', attrs.title); else img.removeAttribute('title')
        img.style.width = attrs.width ? `${attrs.width}px` : ''
        if (attrs.width && attrs.height) {
          // Lock the chosen ratio in CSS so that shrinking on a narrow screen
          // (max-width: 100%) scales the height too instead of distorting the image.
          img.style.aspectRatio = `${attrs.width} / ${attrs.height}`
          img.style.height = 'auto'
        } else {
          img.style.aspectRatio = ''
          img.style.height = attrs.height ? `${attrs.height}px` : ''
        }
      }
      applyAttrs(node.attrs)
      wrapper.appendChild(img)
      container.appendChild(wrapper)

      const sizeBadge = document.createElement('span')
      sizeBadge.className = 'rte-image-size-badge'
      const updateBadge = () => {
        const rect = img.getBoundingClientRect()
        sizeBadge.textContent = `${Math.round(rect.width)} × ${Math.round(rect.height)}px`
      }

      const handles = []

      // Word-style resizing: selecting the image shows a border, eight handles and a size
      // badge. Corner handles keep the aspect ratio; side handles change one axis only.
      const startResize = (event, direction) => {
        event.preventDefault()
        event.stopPropagation()

        const startX = event.clientX
        const startY = event.clientY
        const rect = img.getBoundingClientRect()
        const startW = rect.width
        const startH = rect.height
        const clamp = (value) => Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(value)))
        let nextW = startW
        let nextH = startH
        wrapper.classList.add('rte-image-resizing')

        const onMove = (moveEvent) => {
          const dx = (moveEvent.clientX - startX) * (direction.includes('w') ? -1 : 1)
          const dy = (moveEvent.clientY - startY) * (direction.includes('n') ? -1 : 1)
          const isCorner = direction.length === 2

          if (isCorner) {
            nextW = clamp(startW + dx)
            nextH = Math.round(nextW * (startH / startW))
          } else if (direction === 'e' || direction === 'w') {
            nextW = clamp(startW + dx)
          } else {
            nextH = clamp(startH + dy)
          }

          img.style.aspectRatio = ''
          img.style.width = `${nextW}px`
          img.style.height = `${nextH}px`
          updateBadge()
        }

        const onUp = () => {
          document.removeEventListener('mousemove', onMove)
          document.removeEventListener('mouseup', onUp)
          wrapper.classList.remove('rte-image-resizing')
          if (typeof getPos !== 'function') return

          const pos = getPos()
          const current = editor.view.state.doc.nodeAt(pos)
          if (!current) return

          editor.view.dispatch(
            editor.view.state.tr.setNodeMarkup(pos, undefined, {
              ...current.attrs,
              width: nextW,
              height: nextH,
            })
          )
        }

        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onUp)
      }

      if (editor.isEditable) {
        HANDLE_DIRECTIONS.forEach((direction) => {
          const handle = document.createElement('span')
          handle.className = `rte-image-resize-handle rte-image-resize-${direction}`
          handle.addEventListener('mousedown', (event) => startResize(event, direction))
          wrapper.appendChild(handle)
          handles.push(handle)
        })
        wrapper.appendChild(sizeBadge)
      }

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'image') return false
          applyAttrs(updatedNode.attrs)
          updateBadge()
          return true
        },
        selectNode: () => {
          wrapper.classList.add('rte-image-selected')
          updateBadge()
        },
        deselectNode: () => wrapper.classList.remove('rte-image-selected'),
        // Keep ProseMirror from treating a handle drag as a selection or node drag
        stopEvent: (event) => handles.includes(event.target),
        ignoreMutation: (mutation) =>
          handles.includes(mutation.target) ||
          mutation.target === img ||
          mutation.target === sizeBadge ||
          mutation.target === wrapper ||
          mutation.target === container,
      }
    }
  },
})

export default ResizableImage
