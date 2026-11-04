import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNotePanel } from './hooks/useNotePanel'
import { useReadingPreferences } from './hooks/useReadingPreferences'
import { useActiveHeading } from './hooks/useActiveHeading'
import { useSiblingNavigation } from './hooks/useSiblingNavigation'
import NotePanelLoadingSkeleton from './components/NotePanelLoadingSkeleton'
import NoteEmptyState from './components/NoteEmptyState'
import ReaderToolbar from './components/ReaderToolbar'
import ReadingProgressBar from './components/ReadingProgressBar'
import TableOfContents from './components/TableOfContents'
import NoteHeadline from './components/NoteHeadline'
import NoteBody from './components/NoteBody'
import NoteReferenceSection from './components/NoteReferenceSection'
import LinkedResourcesSection from './components/LinkedResourcesSection'
import SiblingNavFooter from './components/SiblingNavFooter'
import { ReaderShell, ReaderScroll, ReaderLayout, ArticleHeader, Article } from './NotePanel.styles'

// A single heading is not an outline — it would show a one-item table of contents
// that tells the reader nothing they cannot already see.
const MIN_OUTLINE_LENGTH = 2

function NotePanel({ noteId, isEmptySubtopic, isNavOpen, onToggleNav, onSelectNote }) {
  const isLoading = useSelector(s => s.summaryNotesV2.loading.isNoteDetailLoading)
  // A callback ref held in state, not a useRef: the scroll container is behind the
  // loading-skeleton early return below, so it mounts after the scroll hooks first
  // run. State makes its arrival a dependency change the hooks can react to.
  const [scrollElement, setScrollElement] = useState(null)

  const {
    detail, parsedContent, outline, readingMinutes, breadcrumbPath,
    topicSlug, topicName, topicNodeId, subtopicSlug, subtopicName, subtopicNodeId,
  } = useNotePanel(noteId)

  const readingPreferences = useReadingPreferences()
  const { activeHeadingId, scrollToHeading } = useActiveHeading(scrollElement, outline)
  const { previous, next, goToSibling, isLoadingSibling } = useSiblingNavigation({
    topicNodeId, subtopicNodeId, onSelectNote,
  })

  if (!noteId) {
    return <NoteEmptyState isEmptySubtopic={isEmptySubtopic} isNavOpen={isNavOpen} onOpenNav={onToggleNav} />
  }

  if (isLoading || !detail) {
    return <NotePanelLoadingSkeleton />
  }

  const showToc = outline.length >= MIN_OUTLINE_LENGTH

  return (
    <ReaderShell>
      <ReaderToolbar
        note={detail}
        breadcrumbPath={breadcrumbPath}
        isNavOpen={isNavOpen}
        onToggleNav={onToggleNav}
        readingPreferences={readingPreferences}
      />
      <ReadingProgressBar scrollElement={scrollElement} />

      <ReaderScroll ref={setScrollElement} $fontScale={readingPreferences.fontScale}>
        {/* The outline sits between the headline and the body in the DOM: stacked,
            that puts it right under the note's description; wide, grid placement
            moves it into the rail beside them. */}
        <ReaderLayout $withToc={showToc}>
          <ArticleHeader>
            <NoteHeadline
              title={detail.title}
              description={detail.description}
              subtopicName={subtopicName}
              readingMinutes={readingMinutes}
              updatedAt={detail.updatedAt}
            />
          </ArticleHeader>

          {showToc && (
            <TableOfContents
              outline={outline}
              activeHeadingId={activeHeadingId}
              onJumpTo={scrollToHeading}
            />
          )}

          <Article>
            <NoteBody parsedContent={parsedContent} />

            <NoteReferenceSection sourceDocument={detail.sourceDocument} />

            <LinkedResourcesSection
              topicSlug={topicSlug}
              topicName={topicName}
              subtopicSlug={subtopicSlug}
              subtopicName={subtopicName}
            />

            <SiblingNavFooter
              previous={previous}
              next={next}
              isLoading={isLoadingSibling}
              onNavigate={goToSibling}
            />
          </Article>
        </ReaderLayout>
      </ReaderScroll>
    </ReaderShell>
  )
}

export default NotePanel
