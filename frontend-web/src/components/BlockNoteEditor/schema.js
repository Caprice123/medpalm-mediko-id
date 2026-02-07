import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core"
import { createEmbedBlock } from './customBlocks/EmbedBlock'

/**
 * Shared embed block instance - created once at module level
 * This prevents duplicate block registrations
 */
export const embedBlock = createEmbedBlock()

/**
 * Shared BlockNote schema with custom blocks
 * Used by both the editor and DOCX exporter
 */
export const editorSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    embed: embedBlock,
  },
})
