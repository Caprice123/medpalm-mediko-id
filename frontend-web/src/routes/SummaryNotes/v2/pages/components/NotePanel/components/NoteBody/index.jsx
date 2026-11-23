import { useRef } from 'react'
import BlockNoteEditor from '@components/BlockNoteEditor'
import EmbedLoadingBanner from '@components/common/EmbedLoadingBanner'
import { useImageLoadingState } from './hooks/useImageLoadingState'
import { BodyWrapper } from './NoteBody.styles'

export default function NoteBody({ parsedContent }) {
  const hasEmbeds = parsedContent?.some(block => block.type === 'embed')

  // Scoped to the body rather than the document: the only images that want a placeholder are
  // the note's own figures, not the chrome around them.
  const bodyRef = useRef(null)
  useImageLoadingState(bodyRef)

  return (
    <>
      {hasEmbeds && <EmbedLoadingBanner />}
      <BodyWrapper ref={bodyRef}>
        <BlockNoteEditor initialContent={parsedContent} editable={false} />
      </BodyWrapper>
    </>
  )
}
