import { Node, mergeAttributes } from '@tiptap/core'

// An inline chip that points at something outside the paragraph it sits in —
// in the PBL editor, another section of the same report.
//
// The target is held as an id; the label is stored beside it so the saved HTML
// still reads correctly anywhere the chip is not interactive (a Word export, a
// plain-HTML preview). Whoever mounts the editor supplies `resolve` and
// `onOpen` through this extension's storage: the editor itself knows nothing
// about sections, only that a reference has an id, a name, and somewhere to go
// when it is clicked.
const InlineReference = Node.create({
  name: 'inlineReference',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addStorage() {
    return {
      // (refId) => current title, `null` when the target is gone, `undefined`
      // when nothing is resolving references in this editor.
      resolve: null,
      onOpen: null,
    }
  },

  addAttributes() {
    return {
      refId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-ref-id'),
        renderHTML: (attributes) => (attributes.refId ? { 'data-ref-id': attributes.refId } : {}),
      },
      label: {
        default: '',
        // The label doubles as the chip's text, so an older document that
        // stored it only as text content still parses back with a name.
        parseHTML: (element) => element.getAttribute('data-ref-label') || element.textContent || '',
        renderHTML: (attributes) => ({ 'data-ref-label': attributes.label || '' }),
      },
      // Set when the section this points at has been deleted. Kept in the
      // document rather than worked out on the fly so the chip still reads as
      // broken in an export.
      missing: {
        default: false,
        parseHTML: (element) => element.getAttribute('data-ref-missing') === 'true',
        renderHTML: (attributes) => (attributes.missing ? { 'data-ref-missing': 'true' } : {}),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-ref-id]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'span',
      mergeAttributes({ class: 'rte-inline-ref' }, HTMLAttributes),
      node.attrs.label || 'bagian',
    ]
  },

  addNodeView() {
    return ({ node, editor }) => {
      const dom = document.createElement('span')
      dom.className = 'rte-inline-ref'
      dom.setAttribute('contenteditable', 'false')

      const render = (current) => {
        const resolved = editor.storage.inlineReference.resolve?.(current.attrs.refId)
        const isMissing = resolved === null || current.attrs.missing
        const label = (resolved ?? current.attrs.label) || 'bagian'

        dom.textContent = isMissing ? `${label} (dihapus)` : label
        dom.classList.toggle('is-missing', isMissing)
        dom.setAttribute('data-ref-id', current.attrs.refId ?? '')
        dom.title = isMissing
          ? 'Bagian yang dirujuk sudah dihapus'
          : `Buka bagian "${label}"`
      }

      render(node)

      dom.addEventListener('click', (event) => {
        event.preventDefault()
        editor.storage.inlineReference.onOpen?.(node.attrs.refId)
      })

      return {
        dom,
        update: (updated) => {
          if (updated.type.name !== node.type.name) return false
          render(updated)
          return true
        },
      }
    }
  },

  addCommands() {
    return {
      // `label` is what the chip shows until a resolver says otherwise, so a
      // reference inserted here reads correctly even before the next render.
      insertInlineReference: ({ refId, label }) => ({ commands }) => commands.insertContent({
        type: this.name,
        attrs: { refId: String(refId), label, missing: false },
      }),
    }
  },
})

export default InlineReference
