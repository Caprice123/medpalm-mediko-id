import { memo } from 'react'
import { useSelector } from 'react-redux'
import { FaRegImage } from 'react-icons/fa'
import Button from '@components/common/Button'
import Textarea from '@components/common/Textarea'
import Loading from '@components/common/Loading'
import Endpoints from '@config/endpoint'
import { selectDiagramsForTab } from '@store/skripsi/v2/reducer'
import { formatJakartaDateLong } from '@utils/dateUtils'
import { useDiagramBuilder, QUICK_PROMPTS } from './hooks/useDiagramBuilder'
import {
  Panel, Body, Intro, SectionLabel, QuickPrompts, QuickPrompt, Hint,
  ResultsSection, ResultsTitle, EmptyHint, DiagramCard, DiagramImage,
  DiagramMeta, DiagramCaption,
} from './DiagramBuilderPanel.styles'

// The Diagram Builder draws a picture from a description. V1 built Mermaid and
// handed it to an Excalidraw canvas the student then had to tidy; this asks an
// image model for the finished figure instead.
//
// The picture is shown through /api/v1/blobs/:id rather than through the signed
// URL the serializer also sends: a student copies a diagram straight out of
// this panel into a section, and a signed src pasted into the document stops
// working within the hour — which is how the two broken images in the database
// got there. The signed URL expires; this one is re-signed per request.
const DiagramBuilderPanel = memo(({ tab, style }) => {
  const tabId = tab?.id ?? null
  const {
    description,
    setDescription,
    applyQuickPrompt,
    canGenerate,
    handleGenerate,
  } = useDiagramBuilder(tabId)

  const diagrams = useSelector(state => selectDiagramsForTab(state, tabId))
  const isGenerating = useSelector(state => state.skripsiV2.loading.isGeneratingDiagram)
  const isFetching = useSelector(state => state.skripsiV2.loading.isFetchingDiagrams)

  return (
    <Panel style={style}>
      <Body>
        <Intro>Buat gambar atau flowchart (mis. patofisiologi) dari deskripsi.</Intro>

        <SectionLabel>Prompt cepat</SectionLabel>
        <QuickPrompts>
          {QUICK_PROMPTS.map(prompt => (
            <QuickPrompt key={prompt.label} type="button" onClick={() => applyQuickPrompt(prompt.text)}>
              {prompt.label}
            </QuickPrompt>
          ))}
        </QuickPrompts>

        <Hint>Pilih prompt, sesuaikan bila perlu, lalu tekan Generate diagram.</Hint>

        <Textarea
          value={description}
          onChange={setDescription}
          placeholder="Flowchart patofisiologi crush syndrome..."
          rows={4}
        />

        <div>
          <Button variant="primary" onClick={handleGenerate} disabled={!canGenerate || isGenerating}>
            <FaRegImage /> {isGenerating ? 'Menggambar...' : 'Generate diagram'}
          </Button>
        </div>
      </Body>

      <ResultsSection>
        <ResultsTitle>Hasil</ResultsTitle>

        {isGenerating && <Loading text="Menggambar diagram..." />}

        {!isGenerating && isFetching && diagrams.length === 0 && <Loading text="Memuat diagram..." />}

        {!isGenerating && !isFetching && diagrams.length === 0 && (
          <EmptyHint>Belum ada diagram. Tulis deskripsinya di atas lalu generate.</EmptyHint>
        )}

        {diagrams.map((diagram) => {
          // A diagram saved before blobId was serialized has only the signed
          // URL to fall back on.
          const src = diagram.blobId
            ? Endpoints.api.blobImageUrl(diagram.blobId)
            : diagram.imageUrl

          return (
            <DiagramCard key={diagram.id}>
              {src && <DiagramImage src={src} alt={diagram.description} />}
              <DiagramMeta>
                <DiagramCaption>
                  {diagram.description} · {formatJakartaDateLong(diagram.createdAt)}
                </DiagramCaption>
                {src && (
                  <Button
                    as="a"
                    variant="secondary"
                    size="small"
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buka
                  </Button>
                )}
              </DiagramMeta>
            </DiagramCard>
          )
        })}
      </ResultsSection>
    </Panel>
  )
})

DiagramBuilderPanel.displayName = 'DiagramBuilderPanel'

export default DiagramBuilderPanel
