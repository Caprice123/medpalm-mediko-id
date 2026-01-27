import React, { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/store';
import { generateDiagram, fetchDiagramHistory, updateDiagram } from '@store/skripsi/action';
import { selectDiagramsForActiveTab } from '@store/skripsi/reducer';
import { Excalidraw, exportToBlob, exportToSvg } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import Dropdown from '@components/common/Dropdown';
import Textarea from '@components/common/Textarea';

// Generate Excalidraw-compatible ID (mimics nanoid format)
const generateExcalidrawId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let id = '';
  for (let i = 0; i < 21; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
};

// Transform AI-generated diagram to use proper Excalidraw IDs and ensure required properties
const transformDiagramIds = (diagramData) => {
  if (!diagramData || !diagramData.elements) return diagramData;

  const idMap = new Map(); // Map old IDs to new IDs

  // First pass: Create new IDs for all elements
  diagramData.elements.forEach((element) => {
    if (element.id) {
      idMap.set(element.id, generateExcalidrawId());
    }
  });

  // Second pass: Update all elements and their references
  const transformedElements = diagramData.elements.map((element, index) => {
    const newElement = { ...element };

    // Update element's own ID
    if (newElement.id) {
      newElement.id = idMap.get(newElement.id);
    }

    // Ensure required Excalidraw properties exist
    if (!newElement.version) newElement.version = 1;
    if (!newElement.versionNonce) newElement.versionNonce = Math.floor(Math.random() * 2000000000);
    if (newElement.isDeleted === undefined) newElement.isDeleted = false;
    if (!newElement.groupIds) newElement.groupIds = [];
    if (newElement.frameId === undefined) newElement.frameId = null;
    if (newElement.updated === undefined) newElement.updated = Date.now();

    // Remove invalid index - let Excalidraw auto-generate proper fractional indices
    // Excalidraw uses fractional indexing system with specific format rules
    delete newElement.index;

    // Replace deprecated strokeSharpness with strokeStyle
    if (newElement.strokeSharpness) {
      newElement.strokeStyle = "solid";
      delete newElement.strokeSharpness;
    }
    if (!newElement.strokeStyle) {
      newElement.strokeStyle = "solid";
    }

    // Ensure seed is a proper integer
    if (!newElement.seed || typeof newElement.seed !== 'number') {
      newElement.seed = Math.floor(Math.random() * 2000000000);
    }

    // Update containerId (for text bound to shapes)
    if (newElement.containerId && idMap.has(newElement.containerId)) {
      newElement.containerId = idMap.get(newElement.containerId);
    }

    // Clear boundElements - will be rebuilt in next pass
    newElement.boundElements = null;

    // Update startBinding and endBinding with transformed IDs
    if (newElement.startBinding && newElement.startBinding.elementId) {
      const targetId = idMap.get(newElement.startBinding.elementId) || newElement.startBinding.elementId;
      newElement.startBinding = {
        elementId: targetId,
        focus: 0, // Center by default, will be calculated based on arrow position
        gap: newElement.startBinding.gap || 8,
        fixedPoint: null // Let Excalidraw calculate the connection point dynamically
      };
    }
    if (newElement.endBinding && newElement.endBinding.elementId) {
      const targetId = idMap.get(newElement.endBinding.elementId) || newElement.endBinding.elementId;
      newElement.endBinding = {
        elementId: targetId,
        focus: 0, // Center by default, will be calculated based on arrow position
        gap: newElement.endBinding.gap || 8,
        fixedPoint: null // Let Excalidraw calculate the connection point dynamically
      };
    }

    // For arrows with bindings, store the original points but mark for recalculation
    if (newElement.type === 'arrow' && (newElement.startBinding || newElement.endBinding)) {
      // Keep the points for focus calculation, but we'll let Excalidraw recalculate
      newElement._needsRecalculation = true;
    }

    return newElement;
  });

  // Third pass: Ensure bidirectional arrow bindings and distribute focus values
  // Create a map of elements for quick lookup
  const elementMap = new Map(transformedElements.map(el => [el.id, el]));

  // Track arrows connecting to each element for focus distribution
  const arrowsPerElement = new Map(); // elementId -> { start: [arrows], end: [arrows] }

  transformedElements.forEach((element) => {
    // If this is an arrow with bindings, ensure target elements reference it back
    if (element.type === 'arrow') {
      if (element.startBinding && element.startBinding.elementId) {
        const targetId = element.startBinding.elementId;
        const startTarget = elementMap.get(targetId);
        if (startTarget) {
          if (!startTarget.boundElements) {
            startTarget.boundElements = [];
          }
          // Add this arrow to target's boundElements if not already there
          const hasBinding = startTarget.boundElements.some(b => b.id === element.id);
          if (!hasBinding) {
            startTarget.boundElements.push({ id: element.id, type: 'arrow' });
          }

          // Track this arrow for focus distribution
          if (!arrowsPerElement.has(targetId)) {
            arrowsPerElement.set(targetId, { start: [], end: [] });
          }
          arrowsPerElement.get(targetId).start.push(element);
        }
      }

      if (element.endBinding && element.endBinding.elementId) {
        const targetId = element.endBinding.elementId;
        const endTarget = elementMap.get(targetId);
        if (endTarget) {
          if (!endTarget.boundElements) {
            endTarget.boundElements = [];
          }
          // Add this arrow to target's boundElements if not already there
          const hasBinding = endTarget.boundElements.some(b => b.id === element.id);
          if (!hasBinding) {
            endTarget.boundElements.push({ id: element.id, type: 'arrow' });
          }

          // Track this arrow for focus distribution
          if (!arrowsPerElement.has(targetId)) {
            arrowsPerElement.set(targetId, { start: [], end: [] });
          }
          arrowsPerElement.get(targetId).end.push(element);
        }
      }
    }

    // If this is text with containerId, ensure container references it back
    if (element.type === 'text' && element.containerId) {
      const container = elementMap.get(element.containerId);
      if (container) {
        if (!container.boundElements) {
          container.boundElements = [];
        }
        // Add this text to container's boundElements if not already there
        const hasBinding = container.boundElements.some(b => b.id === element.id);
        if (!hasBinding) {
          container.boundElements.push({ id: element.id, type: 'text' });
        }
      }
    }
  });

  // Calculate correct focus values based on arrow's actual position
  arrowsPerElement.forEach((arrows, elementId) => {
    const targetElement = elementMap.get(elementId);
    if (!targetElement) return;

    // Calculate focus for arrows starting from this element
    arrows.start.forEach((arrow) => {
      if (arrow.startBinding && arrow.points && arrow.points.length > 0) {
        // Calculate where the arrow actually starts (absolute position)
        const arrowStartX = arrow.x + arrow.points[0][0];
        const arrowStartY = arrow.y + arrow.points[0][1];

        // Calculate the normalized position on the element's edge
        // Focus represents horizontal position: -1 (left) to +1 (right)
        const elementLeft = targetElement.x;
        const elementRight = targetElement.x + targetElement.width;
        const elementCenterY = targetElement.y + targetElement.height / 2;

        // Calculate focus based on horizontal position
        const relativeX = (arrowStartX - elementLeft) / targetElement.width;
        const focus = (relativeX - 0.5) * 2; // Convert 0-1 to -1 to +1

        arrow.startBinding.focus = Math.max(-1, Math.min(1, focus)); // Clamp to -1 to 1
      }
    });

    // Calculate focus for arrows ending at this element
    arrows.end.forEach((arrow) => {
      if (arrow.endBinding && arrow.points && arrow.points.length > 0) {
        // Calculate where the arrow actually ends (absolute position)
        const lastPoint = arrow.points[arrow.points.length - 1];
        const arrowEndX = arrow.x + lastPoint[0];
        const arrowEndY = arrow.y + lastPoint[1];

        // Calculate the normalized position on the element's edge
        const elementLeft = targetElement.x;
        const elementRight = targetElement.x + targetElement.width;

        // Calculate focus based on horizontal position
        const relativeX = (arrowEndX - elementLeft) / targetElement.width;
        const focus = (relativeX - 0.5) * 2; // Convert 0-1 to -1 to +1

        arrow.endBinding.focus = Math.max(-1, Math.min(1, focus)); // Clamp to -1 to 1
      }
    });
  });

  // Fourth pass: Clean up invalid references
  const elementIds = new Set(transformedElements.map(el => el.id));
  const cleanedElements = transformedElements.map((element) => {
    const cleaned = { ...element };

    // Remove containerId if container doesn't exist
    if (cleaned.containerId && !elementIds.has(cleaned.containerId)) {
      delete cleaned.containerId;
    }

    // Remove boundElements that don't exist
    if (cleaned.boundElements && Array.isArray(cleaned.boundElements)) {
      cleaned.boundElements = cleaned.boundElements.filter(bound =>
        elementIds.has(bound.id)
      );
      // If no bound elements remain, set to null
      if (cleaned.boundElements.length === 0) {
        cleaned.boundElements = null;
      }
    }

    // Remove startBinding/endBinding if target doesn't exist
    if (cleaned.startBinding && !elementIds.has(cleaned.startBinding.elementId)) {
      cleaned.startBinding = null;
    }
    if (cleaned.endBinding && !elementIds.has(cleaned.endBinding.elementId)) {
      cleaned.endBinding = null;
    }

    return cleaned;
  });

  return {
    ...diagramData,
    elements: cleanedElements
  };
};
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
  const [diagramType, setDiagramType] = useState('flowchart');
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
  const latestDiagram = diagrams.length > 0 ? diagrams[0] : null; // Already sorted by newest first

  // Fetch diagrams on mount
  useEffect(() => {
    if (currentTab?.id) {
      dispatch(fetchDiagramHistory(currentTab.id));
    }
  }, [currentTab?.id, dispatch]);

  // Load latest diagram into Excalidraw when switching to preview
  useEffect(() => {
    if (activeSubTab === 'preview' && excalidrawAPI && latestDiagram) {
      try {
        let diagramData = latestDiagram.diagramData; // Already parsed in backend

        if (diagramData && diagramData.elements) {
          // Transform AI-generated IDs to Excalidraw-compatible IDs
          diagramData = transformDiagramIds(diagramData);

          // Deep clone to make objects mutable (Excalidraw needs to modify them)
          const clonedElements = JSON.parse(JSON.stringify(diagramData.elements));
          const baseAppState = diagramData.appState
            ? JSON.parse(JSON.stringify(diagramData.appState))
            : {};

          // Merge with required Excalidraw fields
          const clonedAppState = {
            viewBackgroundColor: '#ffffff',
            ...baseAppState,
            collaborators: new Map(), // Required by Excalidraw
          };


          excalidrawAPI.updateScene({
            elements: clonedElements,
            appState: clonedAppState,
          });
          setCurrentDiagramId(latestDiagram.id); // Set current diagram ID

          // Force Excalidraw to recalculate arrow paths for bound arrows
          // by triggering a small update after initial load
          setTimeout(() => {
            if (excalidrawAPI) {
              const currentElements = excalidrawAPI.getSceneElements();
              // Update scene again to trigger arrow recalculation
              excalidrawAPI.updateScene({
                elements: currentElements,
              });
            }
          }, 100);
        }
      } catch (error) {
        console.error('Failed to load diagram:', error);
      }
    }
  }, [activeSubTab, excalidrawAPI, latestDiagram, diagrams]);

  // Generate diagram
  const handleGenerate = useCallback(async () => {
    if (!description.trim()) {
      alert('Mohon isi deskripsi diagram terlebih dahulu');
      return;
    }

    setIsGenerating(true);

    try {
      const diagramConfig = {
        type: diagramType,
        detailLevel: detailLevel.value,
        orientation: orientation.value,
        layoutStyle: layoutStyle.value,
        description: description.trim(),
      };

      const result = await dispatch(generateDiagram(currentTab.id, diagramConfig));

      if (result && result.diagram) {
        
        // Switch to preview
        setActiveSubTab('preview');

        // Wait for Excalidraw API to be ready, then load the diagram
        setTimeout(() => {
          if (excalidrawAPI && result.diagram.elements) {
        
            // Deep clone to make objects mutable
            const clonedElements = JSON.parse(JSON.stringify(result.diagram.elements));
            const baseAppState = result.diagram.appState
              ? JSON.parse(JSON.stringify(result.diagram.appState))
              : {};

            // Merge with required Excalidraw fields
            const clonedAppState = {
              viewBackgroundColor: '#ffffff',
              ...baseAppState,
              collaborators: new Map(), // Required by Excalidraw
            };

            // Clear existing and load new diagram
            excalidrawAPI.updateScene({
              elements: clonedElements,
              appState: clonedAppState,
            });

            setCurrentDiagramId(result.diagramId);
          }
        }, 100); // Small delay to ensure preview tab is mounted
      }
    } catch (error) {
      console.error('Failed to generate diagram:', error);
      alert('Gagal membuat diagram. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  }, [description, diagramType, detailLevel, orientation, layoutStyle, currentTab, dispatch, excalidrawAPI]);

  // Save current diagram state back to history (after user edits)
  const handleSaveDiagram = useCallback(async () => {
    if (!excalidrawAPI || !currentDiagramId) {
      alert('Tidak ada diagram yang dimuat untuk disimpan');
      return;
    }

    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();

      const diagramData = {
        type: 'excalidraw',
        version: 2,
        source: 'medpalm-mediko',
        elements,
        appState,
        files,
      };

      await dispatch(updateDiagram(currentDiagramId, diagramData));

      // Refresh diagram history
      await dispatch(fetchDiagramHistory(currentTab.id));

      alert('Diagram berhasil disimpan!');
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

  // Handle Excalidraw changes to prevent invariant errors
  const handleExcalidrawChange = useCallback((elements, appState) => {
    // This handler ensures Excalidraw's internal state stays consistent
    // when elements are added, modified, or deleted.
    // Simply having this handler prevents "invariant broken" errors
    // because Excalidraw expects controlled components to acknowledge changes.
  }, []);

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
  const handleLoadDiagram = useCallback((diagram) => {
    if (!excalidrawAPI) return;

    try {
      let diagramData = diagram.diagramData; // Already parsed
      if (diagramData && diagramData.elements) {
        // Transform AI-generated IDs to Excalidraw-compatible IDs
        diagramData = transformDiagramIds(diagramData);

        // Deep clone to make objects mutable (Excalidraw needs to modify them)
        const clonedElements = JSON.parse(JSON.stringify(diagramData.elements));
        const baseAppState = diagramData.appState
          ? JSON.parse(JSON.stringify(diagramData.appState))
          : {};

        // Merge with required Excalidraw fields
        const clonedAppState = {
          viewBackgroundColor: '#ffffff',
          ...baseAppState,
          collaborators: new Map(), // Required by Excalidraw
        };

        excalidrawAPI.updateScene({
          elements: clonedElements,
          appState: clonedAppState,
        });
        setCurrentDiagramId(diagram.id); // Set current diagram ID
        setActiveSubTab('preview');

        // Force Excalidraw to recalculate arrow paths for bound arrows
        setTimeout(() => {
          if (excalidrawAPI) {
            const currentElements = excalidrawAPI.getSceneElements();
            excalidrawAPI.updateScene({
              elements: currentElements,
            });
          }
        }, 100);
      }
    } catch (error) {
      console.error('Failed to load diagram:', error);
      alert('Gagal memuat diagram. Data mungkin rusak.');
    }
  }, [excalidrawAPI]);

  // console.log(JSON.stringify(excalidrawAPI.getSceneElements()[2]))

  return (
    <DiagramBuilderContainer style={style}>
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
              <ConfigHeader>
                <ConfigIcon>📊</ConfigIcon>
                <ConfigTitle>Flowchart - Proses & Alur</ConfigTitle>
              </ConfigHeader>

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
            </ConfigSection>

            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={isGenerating || !description.trim()}
            >
              {isGenerating ? '⏳ Generating...' : '🎨 Buat Diagram dengan AI'}
            </Button>
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
          <ToolbarBtn $variant="zoom" onClick={handleZoomOut}>
            🔍-
          </ToolbarBtn>
          <ToolbarBtn $variant="zoom" onClick={handleZoomReset}>
            {currentZoom}%
          </ToolbarBtn>
          <ToolbarBtn $variant="zoom" onClick={handleZoomIn}>
            🔍+
          </ToolbarBtn>
          <ToolbarBtn $variant="save" onClick={handleSaveDiagram}>
            💾 Save
          </ToolbarBtn>
          <ToolbarBtn $variant="export" onClick={handleExportPng}>
            PNG
          </ToolbarBtn>
          <ToolbarBtn $variant="export" onClick={handleExportSvg}>
            SVG
          </ToolbarBtn>
        </PreviewToolbar>

        <ExcalidrawWrapper>
          <Excalidraw
            excalidrawAPI={(api) => {
              console.log('Excalidraw API ready:', !!api)
              setExcalidrawAPI(api)
            }}
            onChange={handleExcalidrawChange}
          />
        </ExcalidrawWrapper>
      </PreviewContainer>
    </DiagramBuilderContainer>
  );
};
// layer-ui__wrapper__footer-left zen-mode-transition

export default DiagramBuilderPanel;
