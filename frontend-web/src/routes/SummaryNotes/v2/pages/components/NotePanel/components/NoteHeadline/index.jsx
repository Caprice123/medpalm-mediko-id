import { PiBookmarkSimple, PiClock, PiPencilSimpleLine } from 'react-icons/pi'
import { formatJakartaDateLong } from '@utils/dateUtils'
import { NoteTitle, MetaRow, MetaItem, Lede } from './NoteHeadline.styles'

export default function NoteHeadline({ title, description, subtopicName, readingMinutes, updatedAt }) {
  return (
    <>
      <NoteTitle>{title}</NoteTitle>

      <MetaRow>
        {subtopicName && <MetaItem><PiBookmarkSimple />{subtopicName}</MetaItem>}
        {readingMinutes > 0 && <MetaItem><PiClock />{readingMinutes} menit baca</MetaItem>}
        {updatedAt && (
          <MetaItem><PiPencilSimpleLine />Diperbarui {formatJakartaDateLong(updatedAt)}</MetaItem>
        )}
      </MetaRow>

      {description && <Lede>{description}</Lede>}
    </>
  )
}
