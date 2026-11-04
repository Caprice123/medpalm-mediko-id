import BlockNoteEditor from '@components/BlockNoteEditor'
import EmbedLoadingBanner from '@components/common/EmbedLoadingBanner'
import { BodyWrapper } from './NoteBody.styles'

export default function NoteBody({ parsedContent }) {
  const hasEmbeds = parsedContent?.some(block => block.type === 'embed')

  return (
    <>
      {hasEmbeds && <EmbedLoadingBanner />}
      <BodyWrapper>
        <BlockNoteEditor initialContent={parsedContent} editable={false} />
      </BodyWrapper>
    </>
  )
}
