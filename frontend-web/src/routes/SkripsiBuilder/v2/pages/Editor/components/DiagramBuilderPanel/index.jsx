import { useCallback, useState } from 'react'
import { Excalidraw, MainMenu } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import Button from '@components/common/Button'
import Dropdown from '@components/common/Dropdown'
import Textarea from '@components/common/Textarea'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'
import { useDiagramCanvas } from './hooks/useDiagramCanvas'
import {
  useDiagramGenerator,
  DETAIL_LEVEL_OPTIONS,
  ORIENTATION_OPTIONS,
  LAYOUT_STYLE_OPTIONS,
} from './hooks/useDiagramGenerator'
import { useDiagramHistory } from './hooks/useDiagramHistory'
import {
  DiagramBuilderContainer,
  SubTabsNav,
  SubTab,
  FormContainer,
  FormContent,
  ConfigSection,
  ConfigBody,
  FormRowGrid,
  FormField,
  TipsBox,
  TipsIcon,
  TipsContent,
  GenerateButtonWrapper,
  HistoryContainer,
  HistoryHeader,
  HistoryTitle,
  HistorySubtitle,
  HistoryList,
  HistoryCard,
  HistoryCardHeader,
  HistoryIcon,
  HistoryCardInfo,
  HistoryCardTitle,
  HistoryCardMeta,
  HistoryCardMetaItem,
  HistoryCardDescription,
  HistoryCardFooter,
  HistoryCardDate,
  HistoryCardActions,
  EmptyHistory,
  PreviewContainer,
  PreviewToolbar,
  ExcalidrawWrapper,
} from './DiagramBuilderPanel.styles'

const DiagramBuilderPanel = ({ tab, style }) => {
  const tabId = tab?.id ?? null
  const [subTab, setSubTab] = useState('form')

  const showPreview = useCallback(() => setSubTab('preview'), [])

  const {
    api,
    setApi,
    zoomPercent,
    diagramId,
    setDiagramId,
    handleChange,
    save,
    zoomIn,
    zoomOut,
    resetZoom,
    exportPng,
    exportSvg,
  } = useDiagramCanvas({ tabId })

  const generator = useDiagramGenerator({
    tabId,
    api,
    onGenerated: setDiagramId,
    onShowPreview: showPreview,
  })

  const { diagrams, loadDiagram } = useDiagramHistory({
    tabId,
    api,
    onLoaded: setDiagramId,
    onShowPreview: showPreview,
  })

  return (
    <DiagramBuilderContainer $activeSubTab={subTab} style={style}>
      <SubTabsNav>
        <SubTab $active={subTab === 'form'} onClick={() => setSubTab('form')}>
          📝 Form
        </SubTab>
        <SubTab $active={subTab === 'preview'} onClick={showPreview}>
          👁️ Preview
        </SubTab>
        <SubTab $active={subTab === 'history'} onClick={() => setSubTab('history')}>
          📚 Riwayat
        </SubTab>
      </SubTabsNav>

      {subTab === 'form' && (
        <FormContainer>
          <FormContent>
            <ConfigSection>
              <ConfigBody>
                <FormRowGrid>
                  <FormField>
                    <Dropdown
                      label="Tingkat Detail"
                      options={DETAIL_LEVEL_OPTIONS}
                      value={generator.detailLevel}
                      onChange={generator.setDetailLevel}
                      placeholder="Pilih tingkat detail"
                    />
                  </FormField>

                  <FormField>
                    <Dropdown
                      label="Orientasi"
                      options={ORIENTATION_OPTIONS}
                      value={generator.orientation}
                      onChange={generator.setOrientation}
                      placeholder="Pilih orientasi"
                    />
                  </FormField>
                </FormRowGrid>

                <FormField>
                  <Dropdown
                    label="Gaya Layout"
                    options={LAYOUT_STYLE_OPTIONS}
                    value={generator.layoutStyle}
                    onChange={generator.setLayoutStyle}
                    placeholder="Pilih gaya layout"
                  />
                </FormField>

                <FormField>
                  <Textarea
                    label="Deskripsi Diagram"
                    rows={8}
                    placeholder="Jelaskan diagram yang ingin Anda buat dengan bahasa sehari-hari..."
                    value={generator.description}
                    onChange={(e) => generator.setDescription(e.target.value)}
                  />
                </FormField>

                <TipsBox>
                  <TipsIcon>💡</TipsIcon>
                  <TipsContent>
                    <strong>Tips:</strong>
                    <p>Contoh input untuk Flowchart:</p>
                    <p>
                      &quot;Penelitian dimulai dengan identifikasi masalah, kemudian dilakukan studi
                      literatur, setelah itu pengumpulan data melalui wawancara dan observasi, lalu
                      analisis data, dan terakhir penentuan kesimpulan.&quot;
                    </p>
                  </TipsContent>
                </TipsBox>
              </ConfigBody>

              <GenerateButtonWrapper>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={generator.handleGenerate}
                  disabled={!generator.canGenerate}
                >
                  {generator.isGenerating ? '⏳ Generating...' : '🎨 Buat Diagram dengan AI'}
                </Button>
              </GenerateButtonWrapper>
            </ConfigSection>
          </FormContent>
        </FormContainer>
      )}

      {subTab === 'history' && (
        <HistoryContainer>
          <HistoryHeader>
            <HistoryTitle>📚 Riwayat Diagram</HistoryTitle>
            <HistorySubtitle>{diagrams.length} diagram telah dibuat</HistorySubtitle>
          </HistoryHeader>

          {diagrams.length === 0 ? (
            <EmptyHistory>
              <span>📊</span>
              <h4>Belum Ada Diagram</h4>
              <p>
                Diagram yang Anda buat akan muncul di sini.
                <br />
                Mulai dengan membuat diagram pertama Anda!
              </p>
            </EmptyHistory>
          ) : (
            <HistoryList>
              {diagrams.map((diagram) => (
                <HistoryCard
                  key={diagram.id}
                  $active={diagramId === diagram.id}
                  onClick={() => loadDiagram(diagram)}
                >
                  <HistoryCardHeader>
                    <HistoryIcon>{diagram.diagramType ? '📊' : '✏️'}</HistoryIcon>
                    <HistoryCardInfo>
                      <HistoryCardTitle>
                        {diagram.diagramType || 'Diagram Manual'}
                      </HistoryCardTitle>
                      <HistoryCardMeta>
                        {/* A hand-drawn diagram has no generation config, so
                            these only exist on generated entries. */}
                        {diagram.detailLevel && (
                          <HistoryCardMetaItem>{diagram.detailLevel}</HistoryCardMetaItem>
                        )}
                        {diagram.orientation && (
                          <HistoryCardMetaItem>{diagram.orientation}</HistoryCardMetaItem>
                        )}
                        {diagram.layoutStyle && (
                          <HistoryCardMetaItem>{diagram.layoutStyle}</HistoryCardMetaItem>
                        )}
                        <HistoryCardMetaItem>
                          {diagram.creationMethod === 'manual' ? '✏️ Manual' : '🤖 AI'}
                        </HistoryCardMetaItem>
                      </HistoryCardMeta>
                    </HistoryCardInfo>
                  </HistoryCardHeader>

                  <HistoryCardDescription>
                    {diagram.description || 'Tanpa deskripsi'}
                  </HistoryCardDescription>

                  <HistoryCardFooter>
                    <HistoryCardDate>
                      🕐 {formatJakartaDateTimeFull(diagram.createdAt)}
                    </HistoryCardDate>
                    <HistoryCardActions>
                      <Button
                        variant="primary"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          loadDiagram(diagram)
                        }}
                      >
                        Lihat
                      </Button>
                    </HistoryCardActions>
                  </HistoryCardFooter>
                </HistoryCard>
              ))}
            </HistoryList>
          )}
        </HistoryContainer>
      )}

      {/* The preview stays mounted whichever subtab is showing: unmounting it
          would drop the Excalidraw API handle, and with it the scene the
          student has drawn. */}
      <PreviewContainer style={{ display: subTab === 'preview' ? 'flex' : 'none' }}>
        <PreviewToolbar>
          <Button variant="secondary" size="small" onClick={zoomOut}>🔍-</Button>
          <Button variant="secondary" size="small" onClick={resetZoom}>{zoomPercent}%</Button>
          <Button variant="secondary" size="small" onClick={zoomIn}>🔍+</Button>
          <Button variant="secondary" size="small" onClick={save}>💾 Simpan</Button>
          <Button variant="secondary" size="small" onClick={exportPng}>PNG</Button>
          <Button variant="secondary" size="small" onClick={exportSvg}>SVG</Button>
        </PreviewToolbar>

        <ExcalidrawWrapper>
          <Excalidraw
            excalidrawAPI={setApi}
            onChange={handleChange}
            initialData={{ appState: { currentItemFontFamily: 1 } }}
          >
            <MainMenu>
              <MainMenu.DefaultItems.SaveToActiveFile />
              <MainMenu.DefaultItems.Export />
              <MainMenu.DefaultItems.Help />
              <MainMenu.DefaultItems.ClearCanvas />
              <MainMenu.DefaultItems.ToggleTheme />
            </MainMenu>
          </Excalidraw>
        </ExcalidrawWrapper>
      </PreviewContainer>
    </DiagramBuilderContainer>
  )
}

export default DiagramBuilderPanel
