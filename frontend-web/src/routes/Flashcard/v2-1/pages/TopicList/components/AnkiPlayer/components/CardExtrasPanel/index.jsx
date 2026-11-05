import { generatePath } from 'react-router-dom'
import RichTextViewer from '@components/common/RichTextViewer'
import { isRichTextEmpty } from '@utils/richTextUtils'
import { SummaryNotesRoute } from '@routes/SummaryNotes/routes'
import { useCardExtrasPanel } from './hooks/useCardExtrasPanel'
import {
  Wrapper, ShortExplanationLabel, ShortExplanationBox,
  LongExplanationToggle, LongExplanationChevron,
  LongExplanationCollapse, LongExplanationCollapseInner, LongExplanationBox,
  Divider, RelatedGrid, RelatedColumn, RelatedColumnLabel,
  RelatedRow, RelatedRowText, RelatedRowIcon,
} from './CardExtrasPanel.styles'

// `renderHtml` is opt-in: Diagnostic V2 authors its explanations in the TipTap editor and
// stores HTML, while Flashcard still stores plain text and must keep rendering it verbatim.
export default function CardExtrasPanel({ explanationShort, explanationLong, references = [], linkedSummaryNotes = [], renderHtml = false }) {
  const { showLong, toggleLong } = useCardExtrasPanel()

  const hasShort = renderHtml ? !isRichTextEmpty(explanationShort) : !!explanationShort
  const hasLong = renderHtml ? !isRichTextEmpty(explanationLong) : !!explanationLong
  const hasExplanation = hasShort || hasLong
  const hasRelated = references.length > 0 || linkedSummaryNotes.length > 0
  if (!hasExplanation && !hasRelated) return null

  return (
    <Wrapper>
      {hasShort && (
        <div>
          <ShortExplanationLabel>Penjelasan Singkat</ShortExplanationLabel>
          <ShortExplanationBox>
            {renderHtml ? <RichTextViewer html={explanationShort} /> : explanationShort}
          </ShortExplanationBox>
        </div>
      )}

      {hasLong && (
        <div>
          <LongExplanationToggle type="button" onClick={toggleLong} aria-expanded={showLong}>
            {showLong ? 'Sembunyikan Penjelasan Panjang' : 'Lihat Penjelasan Panjang'}
            <LongExplanationChevron $open={showLong} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </LongExplanationChevron>
          </LongExplanationToggle>
          <LongExplanationCollapse $open={showLong}>
            <LongExplanationCollapseInner>
              <LongExplanationBox>
                {renderHtml ? <RichTextViewer html={explanationLong} /> : explanationLong}
              </LongExplanationBox>
            </LongExplanationCollapseInner>
          </LongExplanationCollapse>
        </div>
      )}

      {hasRelated && (
        <>
          <Divider />
          <RelatedGrid>
            {linkedSummaryNotes.length > 0 && (
              <RelatedColumn>
                <RelatedColumnLabel>📖 Modul Terkait</RelatedColumnLabel>
                {linkedSummaryNotes.map(note => (
                  <RelatedRow
                    key={note.uniqueId}
                    href={generatePath(SummaryNotesRoute.detailRoute, { id: note.uniqueId })}
                    target="_blank"
                    rel="noopener noreferrer"
                    $variant="module"
                  >
                    <RelatedRowText>{note.title}</RelatedRowText>
                    <RelatedRowIcon>↗</RelatedRowIcon>
                  </RelatedRow>
                ))}
              </RelatedColumn>
            )}

            {references.length > 0 && (
              <RelatedColumn>
                <RelatedColumnLabel>🔗 Referensi</RelatedColumnLabel>
                {references.map((ref, i) => (
                  ref.url ? (
                    <RelatedRow key={i} href={ref.url} target="_blank" rel="noopener noreferrer" $variant="reference">
                      <RelatedRowText>{ref.label || ref.url}</RelatedRowText>
                      <RelatedRowIcon>🔗</RelatedRowIcon>
                    </RelatedRow>
                  ) : (
                    <RelatedRow key={i} as="div" $variant="reference">
                      <RelatedRowText>{ref.label}</RelatedRowText>
                    </RelatedRow>
                  )
                ))}
              </RelatedColumn>
            )}
          </RelatedGrid>
        </>
      )}
    </Wrapper>
  )
}
