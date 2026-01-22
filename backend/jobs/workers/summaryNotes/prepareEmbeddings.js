import prisma from '#prisma/client'
import { getVectorDB } from '#services/vectorDB/vectorDBFactory'
import embeddingService from '#services/embedding/embeddingService'
import MarkdownChunker from '#services/embedding/markdownChunker'
import { queueEmbedChunk } from '#jobs/queues/summaryNotesQueue'
import { blockNoteToMarkdown } from '#utils/blockNoteConverter'

/**
 * Prepare Embeddings Job Handler
 *
 * Converts BlockNote content to markdown, then chunks and queues individual chunk jobs for parallel processing
 */
export async function prepareEmbeddingsHandler(job) {
  const { summaryNoteId } = job.data

  // Fetch the summary note from database
  const summaryNote = await prisma.summary_notes.findUnique({
    where: { id: parseInt(summaryNoteId) }
  })

  if (!summaryNote) {
    throw new Error(`Summary note ${summaryNoteId} not found`)
  }

  // Check if still published (might have been unpublished while in queue)
  if (summaryNote.status !== 'published') {
    console.log(`⚠️  Note ${summaryNoteId} is not published, skipping embedding`)
    return
  }

  console.log(`📄 Preparing embeddings for: "${summaryNote.title}"`)

  // Convert BlockNote content to markdown
  console.log(`⚙️  Converting BlockNote content to markdown...`)
  const markdownContent = blockNoteToMarkdown(summaryNote.content)

  if (!markdownContent || markdownContent.trim() === '') {
    throw new Error(`Failed to convert content to markdown for note ${summaryNoteId}`)
  }

  console.log(`✓ Converted to markdown (${markdownContent.length} characters)`)

  // Chunk the markdown content by headings
  const chunks = MarkdownChunker.chunkByHeadings(
    summaryNote.title,
    markdownContent
  )

  console.log(`📦 Split into ${chunks.length} chunks, queuing parallel jobs...`)

  // Queue one job per chunk (these will process in parallel!)
  const chunkJobs = chunks.map((chunk, index) => {
    return queueEmbedChunk({
      summaryNoteId: summaryNote.id,
      chunkIndex: index,
      chunk: {
        content: chunk.content,
        heading: chunk.heading,
        level: chunk.level,
        parent: chunk.parent || ''
      },
      metadata: {
        title: summaryNote.title,
        description: summaryNote.description || '',
        created_at: summaryNote.created_at ? summaryNote.created_at.toISOString() : new Date().toISOString()
      }
    })
  })

  await Promise.all(chunkJobs)

  console.log(`✓ Queued ${chunks.length} chunk jobs for note ${summaryNoteId}`)
}
