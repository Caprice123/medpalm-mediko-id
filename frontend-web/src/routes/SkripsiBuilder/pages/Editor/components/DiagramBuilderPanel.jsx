import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/store';
import { generateDiagram, fetchDiagramHistory, fetchDiagramDetail, updateDiagram, saveTabDiagram, createDiagram } from '@store/skripsi/action';
import { selectDiagramsForActiveTab } from '@store/skripsi/reducer';
import { convertToExcalidrawElements, Excalidraw, exportToBlob, exportToSvg, MainMenu } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import Dropdown from '@components/common/Dropdown';
import Textarea from '@components/common/Textarea';
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import {
  DiagramBuilderContainer,
  SubTabsNav,
  SubTab,
  FormContainer,
  FormContent,
  ConfigSection,
  ConfigHeader,
  ConfigIcon,
  ConfigTitle,
  ConfigBody,
  FormRowGrid,
  FormField,
  FormLabel,
  TipsBox,
  TipsIcon,
  TipsContent,
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
  ToolbarBtn,
  ExcalidrawWrapper,
} from './DiagramBuilderPanel.styles';
import Button from '@components/common/Button'

const DiagramBuilderPanel = ({ currentTab, style }) => {
  const dispatch = useAppDispatch();
  const [activeSubTab, setActiveSubTab] = useState('form');
  const [excalidrawAPI, setExcalidrawAPI] = useState(null); // Will be set by Excalidraw callback
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDiagramId, setCurrentDiagramId] = useState(null); // Track which diagram is loaded
  const [currentZoom, setCurrentZoom] = useState(100); // Track current zoom percentage

  // Form state
  const [detailLevel, setDetailLevel] = useState({ value: 'simple', label: 'Simple - Ringkas' });
  const [orientation, setOrientation] = useState({ value: 'vertical', label: 'Vertikal ↓' });
  const [layoutStyle, setLayoutStyle] = useState({ value: 'branch', label: 'Branch - Bercabang' });
  const [description, setDescription] = useState('');

  // Dropdown options
  const detailLevelOptions = [
    { value: 'simple', label: 'Simple - Ringkas' },
    { value: 'medium', label: 'Medium - Sedang' },
    { value: 'detailed', label: 'Detailed - Detail' },
  ];

  const orientationOptions = [
    { value: 'vertical', label: 'Vertikal ↓' },
    { value: 'horizontal', label: 'Horizontal →' },
  ];

  const layoutStyleOptions = [
    { value: 'branch', label: 'Branch - Bercabang' },
    { value: 'linear', label: 'Linear - Linear' },
    { value: 'tree', label: 'Tree - Pohon' },
  ];

  // Get diagrams from Redux cache using selector
  const diagrams = useAppSelector(selectDiagramsForActiveTab);

  // Fetch diagrams on mount and load saved diagram from tab content
  useEffect(() => {
    if (currentTab?.id && currentTab?.tabType == "diagram_builder") {
      dispatch(fetchDiagramHistory(currentTab.id));
    }
  }, [currentTab?.id, dispatch]);

  // Generate diagram
  const handleGenerate = useCallback(async () => {
    if (!description.trim()) {
      alert('Mohon isi deskripsi diagram terlebih dahulu');
      return;
    }

    setIsGenerating(true);

    try {
      const diagramConfig = {
        type: 'flowchart',
        detailLevel: detailLevel.value,
        orientation: orientation.value,
        layoutStyle: layoutStyle.value,
        description: description.trim(),
      };

      const result = await dispatch(generateDiagram(currentTab.id, diagramConfig));

      if (result) {
        // Switch to preview
        setActiveSubTab('preview');

        // Wait for Excalidraw API to be ready, then load the diagram
        setTimeout(async () => {
          if (excalidrawAPI) {
            console.log(result)
            const { elements, _files } = await parseMermaidToExcalidraw(result);
            // currently the elements returned from the parser are in a "skeleton" format
            // which we need to convert to fully qualified excalidraw elements first
            const excalidrawElements = convertToExcalidrawElements(elements);

            excalidrawAPI.updateScene({
              elements: excalidrawElements,
            });

            // Save diagram data to tab content and history after generation
            const diagramData = {
              type: 'excalidraw',
              version: 2,
              source: 'medpalm-mediko',
              elements: excalidrawElements,
              appState: excalidrawAPI.getAppState(),
              files: excalidrawAPI.getFiles(),
            };

            // Save to diagram history with ai_generated tag
            const savedDiagram = await dispatch(createDiagram(
              currentTab.id,
              diagramData,
              {
                type: 'flowchart',
                detailLevel: detailLevel.value,
                orientation: orientation.value,
                layoutStyle: layoutStyle.value,
                description: description
              },
              'ai_generated' // creationMethod
            ));

            // Set the diagram ID from the saved entry
            if (savedDiagram && savedDiagram.diagramId) {
              setCurrentDiagramId(savedDiagram.diagramId);
            }
          }
        }, 100); // Small delay to ensure preview tab is mounted
      }
    } catch (error) {
      console.error('Failed to generate diagram:', error);
      alert('Gagal membuat diagram. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  }, [description, detailLevel, orientation, layoutStyle, currentTab, dispatch, excalidrawAPI]);

  // Save current diagram state back to history (after user edits)
  const handleSaveDiagram = useCallback(async () => {
    if (!excalidrawAPI) {
      alert('Tidak ada diagram yang dimuat untuk disimpan');
      return;
    }

    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();

      // Check if there are any elements to save
      if (!elements || elements.length === 0) {
        alert('Tidak ada diagram untuk disimpan');
        return;
      }

      const diagramData = {
        type: 'excalidraw',
        version: 2,
        source: 'medpalm-mediko',
        elements,
        appState,
        files,
      };

      // Save to diagram history
      if (currentDiagramId) {
        // Update existing diagram
        await dispatch(updateDiagram(currentDiagramId, diagramData));
      } else {
        // Create new diagram entry for manually created diagrams
        // No config needed since fields are nullable
        const result = await dispatch(createDiagram(
          currentTab.id,
          diagramData,
          {}, // Empty config for manual diagrams
          'manual' // creationMethod
        ));
        // Set the diagramId for subsequent saves
        if (result && result.diagramId) {
          setCurrentDiagramId(result.diagramId);
        }
      }
    } catch (error) {
      console.error('Failed to save diagram:', error);
      alert('Gagal menyimpan diagram. Silakan coba lagi.');
    }
  }, [excalidrawAPI, currentDiagramId, currentTab, dispatch]);

  // Update zoom percentage display
  useEffect(() => {
    if (!excalidrawAPI) return;

    const updateZoom = () => {
      const appState = excalidrawAPI.getAppState();
      const zoomValue = appState.zoom?.value || 1;
      setCurrentZoom(Math.round(zoomValue * 100));
    };

    // Update zoom on mount
    updateZoom();

    // Poll for zoom changes (Excalidraw doesn't have zoom change events)
    const interval = setInterval(updateZoom, 200);
    return () => clearInterval(interval);
  }, [excalidrawAPI]);

  // Zoom functions
  const handleZoomIn = useCallback(() => {
    if (!excalidrawAPI) return;
    const appState = excalidrawAPI.getAppState();
    const currentZoomValue = appState.zoom?.value || 1;
    const newZoom = Math.min(currentZoomValue * 1.2, 30);
    excalidrawAPI.updateScene({
      appState: { zoom: { value: newZoom } }
    });
    setCurrentZoom(Math.round(newZoom * 100));
  }, [excalidrawAPI]);

  const handleZoomOut = useCallback(() => {
    if (!excalidrawAPI) return;
    const appState = excalidrawAPI.getAppState();
    const currentZoomValue = appState.zoom?.value || 1;
    const newZoom = Math.max(currentZoomValue / 1.2, 0.1);
    excalidrawAPI.updateScene({
      appState: { zoom: { value: newZoom } }
    });
    setCurrentZoom(Math.round(newZoom * 100));
  }, [excalidrawAPI]);

  const handleZoomReset = useCallback(() => {
    if (!excalidrawAPI) return;
    excalidrawAPI.updateScene({
      appState: { zoom: { value: 1 } }
    });
    setCurrentZoom(100);
  }, [excalidrawAPI]);

  // Export functions
  const handleExportPng = useCallback(async () => {
    if (!excalidrawAPI) return;

    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();

      const blob = await exportToBlob({
        elements,
        appState: {
          ...appState,
          exportBackground: true,
          exportWithDarkMode: false,
        },
        files: excalidrawAPI.getFiles(),
        mimeType: 'image/png',
        quality: 1,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.png';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export PNG failed:', error);
    }
  }, [excalidrawAPI]);

  const handleExportSvg = useCallback(async () => {
    if (!excalidrawAPI) return;

    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();

      const svg = await exportToSvg({
        elements,
        appState: {
          ...appState,
          exportBackground: true,
          exportWithDarkMode: false,
        },
        files: excalidrawAPI.getFiles(),
      });

      const svgString = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.svg';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export SVG failed:', error);
    }
  }, [excalidrawAPI]);

  // Load diagram from history
  const handleLoadDiagram = useCallback(async (diagram) => {
    try {
      // Fetch full diagram data from detail endpoint
      const fullDiagram = await dispatch(fetchDiagramDetail(diagram.id));

      if (fullDiagram && fullDiagram.diagramData && fullDiagram.diagramData.elements) {
        // Set initial data and remount Excalidraw to ensure proper rendering
        excalidrawAPI.updateScene({
            elements: fullDiagram.diagramData.elements,
        })
        setCurrentDiagramId(fullDiagram.id);
        setActiveSubTab('preview');
      }
    } catch (error) {
      console.error('Failed to load diagram:', error);
      alert('Gagal memuat diagram. Data mungkin rusak.');
    }
  }, [dispatch, excalidrawAPI]);

  // console.log(JSON.stringify(excalidrawAPI.getSceneElements()[2]))

  return (
    <DiagramBuilderContainer $activeSubTab={activeSubTab} style={{ ...style}}>
      {/* Subtabs */}
      <SubTabsNav>
        <SubTab
          $active={activeSubTab === 'form'}
          onClick={() => setActiveSubTab('form')}
        >
          📝 Form
        </SubTab>
        <SubTab
          $active={activeSubTab === 'preview'}
          onClick={() => setActiveSubTab('preview')}
        >
          👁️ Preview
        </SubTab>
        <SubTab
          $active={activeSubTab === 'history'}
          onClick={() => setActiveSubTab('history')}
        >
          📚 Riwayat
        </SubTab>
      </SubTabsNav>

      {/* Form Subtab */}
      {activeSubTab === 'form' && (
        <FormContainer>
          <FormContent>
            <ConfigSection>
              <ConfigBody>
                <FormRowGrid>
                  <FormField>
                    <Dropdown
                      label="Tingkat Detail"
                      options={detailLevelOptions}
                      value={detailLevel}
                      onChange={setDetailLevel}
                      placeholder="Pilih tingkat detail"
                    />
                  </FormField>

                  <FormField>
                    <Dropdown
                      label="Orientasi"
                      options={orientationOptions}
                      value={orientation}
                      onChange={setOrientation}
                      placeholder="Pilih orientasi"
                    />
                  </FormField>
                </FormRowGrid>

                <FormField>
                  <Dropdown
                    label="Gaya Layout"
                    options={layoutStyleOptions}
                    value={layoutStyle}
                    onChange={setLayoutStyle}
                    placeholder="Pilih gaya layout"
                  />
                </FormField>

                <FormField>
                  <Textarea
                    label="Deskripsi Diagram"
                    rows={8}
                    placeholder="Jelaskan diagram yang ingin Anda buat dengan bahasa sehari-hari..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormField>

                <TipsBox>
                  <TipsIcon>💡</TipsIcon>
                  <TipsContent>
                    <strong>Tips:</strong>
                    <p>Contoh input untuk Flowchart:</p>
                    <p>"Penelitian dimulai dengan identifikasi masalah, kemudian dilakukan studi literatur, setelah itu pengumpulan data melalui wawancara dan observasi, lalu analisis data, dan terakhir penentuan kesimpulan."</p>
                  </TipsContent>
                </TipsBox>
              </ConfigBody>
                <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={isGenerating || !description.trim()}
                >
                {isGenerating ? '⏳ Generating...' : '🎨 Buat Diagram dengan AI'}
                </Button>
            </ConfigSection>

          </FormContent>
        </FormContainer>
      )}

      {/* History Subtab */}
      {activeSubTab === 'history' && (
        <HistoryContainer>
          <HistoryHeader>
            <HistoryTitle>
              📚 Riwayat Diagram
            </HistoryTitle>
            <HistorySubtitle>
              {diagrams.length} diagram telah dibuat
            </HistorySubtitle>
          </HistoryHeader>

          {diagrams.length === 0 ? (
            <EmptyHistory>
              <span>📊</span>
              <h4>Belum Ada Diagram</h4>
              <p>Diagram yang Anda buat akan muncul di sini.<br/>Mulai dengan membuat diagram pertama Anda!</p>
            </EmptyHistory>
          ) : (
            <HistoryList>
              {diagrams.map((diagram) => (
                <HistoryCard
                  key={diagram.id}
                  $active={currentDiagramId === diagram.id}
                  onClick={() => handleLoadDiagram(diagram)}
                >
                  <HistoryCardHeader>
                    <HistoryIcon>📊</HistoryIcon>
                    <HistoryCardInfo>
                      <HistoryCardTitle>
                        {diagram.diagramType}
                      </HistoryCardTitle>
                      <HistoryCardMeta>
                        <HistoryCardMetaItem>
                          {diagram.detailLevel}
                        </HistoryCardMetaItem>
                        <HistoryCardMetaItem>
                          {diagram.orientation}
                        </HistoryCardMetaItem>
                        <HistoryCardMetaItem>
                          {diagram.layoutStyle}
                        </HistoryCardMetaItem>
                      </HistoryCardMeta>
                    </HistoryCardInfo>
                  </HistoryCardHeader>

                  <HistoryCardDescription>
                    {diagram.description}
                  </HistoryCardDescription>

                  <HistoryCardFooter>
                    <HistoryCardDate>
                      🕐 {new Date(diagram.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </HistoryCardDate>
                    <HistoryCardActions>
                      <Button variant="primary" onClick={(e) => {
                        e.stopPropagation();
                        handleLoadDiagram(diagram);
                      }}>
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

      {/* Preview Subtab - Keep mounted to preserve Excalidraw API */}
      <PreviewContainer style={{ display: activeSubTab === 'preview' ? 'flex' : 'none' }}>
        <PreviewToolbar>
          <Button variant="secondary" size="small" onClick={handleZoomOut}>
            🔍-
          </Button>
          <Button variant="secondary" size="small" onClick={handleZoomReset}>
            {currentZoom}%
          </Button>
          <Button variant="secondary" size="small" onClick={handleZoomIn}>
            🔍+
          </Button>
          <Button variant="secondary" size="small" onClick={handleSaveDiagram}>
            💾 Save
          </Button>
          <Button variant="secondary" size="small" onClick={handleExportPng}>
            PNG
          </Button>
          <Button variant="secondary" size="small" onClick={handleExportSvg}>
            SVG
          </Button>
        </PreviewToolbar>

        <ExcalidrawWrapper>
          <Excalidraw
            excalidrawAPI={(api) => {
              console.log('Excalidraw API ready:', !!api)
              setExcalidrawAPI(api)
            }}
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
  );
};

export default DiagramBuilderPanel;
