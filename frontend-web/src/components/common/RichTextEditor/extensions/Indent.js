import { Extension } from '@tiptap/core'

// Paragraph indentation, the way a word processor does it: a level counter on
// the block, rendered as a left margin.
//
// Tiptap has no indent of its own — its Tab only nests list items — so a
// paragraph of a bab that needs to sit one step in had no way to say so. The
// level is stored rather than the margin itself so the step can be retuned in
// one place and old documents follow, and it is parsed back out of the margin
// on load so a document round-trips through stored HTML unchanged.
const Indent = Extension.create({
  name: 'indent',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      // Roughly the 1.27cm a thesis template asks for per step.
      step: 1.25,
      unit: 'rem',
      maxLevel: 8,
    }
  },

  addGlobalAttributes() {
    const { step, unit } = this.options

    return [{
      types: this.options.types,
      attributes: {
        indent: {
          default: 0,
          parseHTML: (element) => {
            const margin = parseFloat(element.style.marginLeft || '0')
            if (!Number.isFinite(margin) || margin <= 0) return 0
            // Stored in rem, but a paste from elsewhere may arrive in px.
            const inRem = element.style.marginLeft.endsWith('px') ? margin / 16 : margin
            return Math.round(inRem / step)
          },
          renderHTML: (attributes) => (
            attributes.indent
              ? { style: `margin-left: ${attributes.indent * step}${unit}` }
              : {}
          ),
        },
      },
    }]
  },

  addCommands() {
    const { types, maxLevel } = this.options

    // Inside a list, indenting means nesting the item — anything else would
    // leave the bullet behind while its text walked off to the right.
    const shift = (delta) => () => ({ editor, chain, state }) => {
      if (editor.isActive('listItem')) {
        return delta > 0
          ? chain().focus().sinkListItem('listItem').run()
          : chain().focus().liftListItem('listItem').run()
      }

      const { $from } = state.selection
      const node = $from.node($from.depth)
      if (!node || !types.includes(node.type.name)) return false

      const current = node.attrs.indent || 0
      const next = Math.min(Math.max(current + delta, 0), maxLevel)
      if (next === current) return false

      return chain().focus().updateAttributes(node.type.name, { indent: next }).run()
    }

    return { indent: shift(1), outdent: shift(-1) }
  },

  // Tab is left to the list extensions and to leaving the editor by keyboard;
  // these are the shortcuts a word processor uses for the same thing.
  addKeyboardShortcuts() {
    return {
      'Mod-]': () => this.editor.commands.indent(),
      'Mod-[': () => this.editor.commands.outdent(),
    }
  },
})

export default Indent
