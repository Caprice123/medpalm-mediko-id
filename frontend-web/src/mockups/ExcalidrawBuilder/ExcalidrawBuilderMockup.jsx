import React, { useState, useCallback } from 'react';
import { Excalidraw, exportToBlob, exportToSvg } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import './ExcalidrawBuilderMockup.css';
import { setTimeout, setInterval, clearTimeout, clearInterval } from 'worker-timers'

const ExcalidrawBuilderMockup = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [savedDiagrams, setSavedDiagrams] = useState([]);
  const [activeTab, setActiveTab] = useState('diagram');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [diagramType, setDiagramType] = useState('flowchart');
  const [detailLevel, setDetailLevel] = useState('simple');
  const [orientation, setOrientation] = useState('vertical');
  const [layoutStyle, setLayoutStyle] = useState('branch');
  const [description, setDescription] = useState('');

  // Export to PNG
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
      alert('Export failed. Please try again.');
    }
  }, [excalidrawAPI]);

  // Export to SVG
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
      alert('Export failed. Please try again.');
    }
  }, [excalidrawAPI]);

  // Export to JSON
  const handleExportJson = useCallback(() => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    const files = excalidrawAPI.getFiles();

    const data = {
      type: 'excalidraw',
      version: 2,
      source: 'medpalm-mediko',
      elements,
      appState,
      files,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.excalidraw';
    a.click();
    URL.revokeObjectURL(url);
  }, [excalidrawAPI]);

  // Save diagram to history
  const handleSave = useCallback(() => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    const files = excalidrawAPI.getFiles();

    const diagram = {
      id: Date.now(),
      elements,
      appState,
      files,
      timestamp: new Date().toISOString(),
    };

    setSavedDiagrams((prev) => [diagram, ...prev]);
    alert('Diagram saved to history!');
  }, [excalidrawAPI]);

  // Load diagram from history
  const handleLoad = useCallback((diagram) => {
    if (!excalidrawAPI) return;

    excalidrawAPI.updateScene({
      elements: diagram.elements,
      appState: diagram.appState,
    });
  }, [excalidrawAPI]);

  // Generate diagram (placeholder)
  const handleGenerate = useCallback(() => {
    if (!excalidrawAPI || !description.trim()) {
      alert('Mohon isi deskripsi diagram terlebih dahulu');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('AI generation adalah placeholder. Silakan gambar diagram Anda secara manual menggunakan tools Excalidraw.');
    }, 2000);
  }, [excalidrawAPI, description]);

  return (
    <div className="excalidraw-builder-mockup">
      {/* Tabs Navigation */}
      <div className="tabs-navigation">
        <button
          className={`tab ${activeTab === 'researcher1' ? 'active' : ''}`}
          onClick={() => setActiveTab('researcher1')}
        >
          AI Researcher 1
        </button>
        <button
          className={`tab ${activeTab === 'researcher2' ? 'active' : ''}`}
          onClick={() => setActiveTab('researcher2')}
        >
          AI Researcher 2
        </button>
        <button
          className={`tab ${activeTab === 'researcher3' ? 'active' : ''}`}
          onClick={() => setActiveTab('researcher3')}
        >
          AI Researcher 3
        </button>
        <button
          className={`tab ${activeTab === 'paraphraser' ? 'active' : ''}`}
          onClick={() => setActiveTab('paraphraser')}
        >
          Paraphraser
        </button>
        <button
          className={`tab ${activeTab === 'diagram' ? 'active' : ''}`}
          onClick={() => setActiveTab('diagram')}
        >
          Diagram Builder
        </button>
      </div>

      <div className="mockup-content">
        {/* Left Panel - Diagram Builder */}
        <div className="mockup-left-panel">
          <div className="panel-header">
            <h1>Diagram Builder</h1>
            <p className="subtitle">Buat diagram otomatis dari deskripsi Anda (0.5 kredit/diagram)</p>
            <div className="credit-badge">
              🪙 0.00 kredit
            </div>
          </div>

          <div className="panel-actions">
            <button className="btn-action" onClick={handleGenerate} disabled={isGenerating}>
              🎨 Buat Diagram
            </button>
            <button className="btn-preview" onClick={() => setShowPreview(!showPreview)}>
              👁 Preview
            </button>
          </div>

          <div className="diagram-config">
            <div className="config-section">
              <div className="section-header">
                <span className="section-icon">📊</span>
                <span className="section-title">Flowchart - Proses & Alur</span>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Tingkat Detail</label>
                  <select
                    className="form-select"
                    value={detailLevel}
                    onChange={(e) => setDetailLevel(e.target.value)}
                  >
                    <option value="simple">Simple - Ringkas</option>
                    <option value="medium">Medium - Sedang</option>
                    <option value="detailed">Detailed - Detail</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Orientasi</label>
                  <select
                    className="form-select"
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                  >
                    <option value="vertical">Vertikal ↓</option>
                    <option value="horizontal">Horizontal →</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Gaya Layout</label>
                <select
                  className="form-select"
                  value={layoutStyle}
                  onChange={(e) => setLayoutStyle(e.target.value)}
                >
                  <option value="branch">Branch - Bercabang</option>
                  <option value="linear">Linear - Linear</option>
                  <option value="tree">Tree - Pohon</option>
                </select>
              </div>

              <div className="form-field">
                <label>Deskripsi Diagram</label>
                <textarea
                  className="form-textarea"
                  rows="10"
                  placeholder="Jelaskan diagram yang ingin Anda buat dengan bahasa sehari-hari..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="tips-box">
                <div className="tips-icon">💡</div>
                <div className="tips-content">
                  <strong>Tips:</strong>
                  <p>Contoh input untuk Flowchart:</p>
                  <p>"Penelitian dimulai dengan identifikasi masalah, kemudian dilakukan studi literatur, setelah itu pengumpulan data melalui wawancara dan observasi, lalu analisis data, dan terakhir penentuan kesimpulan."</p>
                </div>
              </div>
            </div>
          </div>

          <div className="panel-footer">
            <button
              className="btn-generate-ai"
              onClick={handleGenerate}
              disabled={isGenerating || !description.trim()}
            >
              {isGenerating ? '⏳ Generating...' : '🎨 Buat Diagram dengan AI'}
            </button>

            <div className="export-actions">
              <button onClick={handleSave} className="btn-small btn-primary">
                💾 Save
              </button>
              <button onClick={handleExportPng} className="btn-small btn-success">
                PNG
              </button>
              <button onClick={handleExportSvg} className="btn-small btn-success">
                SVG
              </button>
              <button onClick={handleExportJson} className="btn-small btn-info">
                JSON
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Excalidraw Canvas */}
        <div className="mockup-right-panel">
          <div className="excalidraw-wrapper">
            <Excalidraw
              excalidrawAPI={(api) => setExcalidrawAPI(api)}
              initialData={{
                appState: {
                  // ✅ PROFESSIONAL STYLE (Not cartoon/sketchy)
                  currentItemStrokeStyle: "solid",        // Clean solid lines (not hand-drawn)
                  currentItemRoughness: 0,                // Perfect lines, no roughness
                  currentItemStrokeWidth: 2,              // Professional line thickness
                  currentItemStrokeColor: "#1e293b",      // Dark professional color
                  currentItemFillStyle: "solid",          // Solid fill (not hachure pattern)
                  currentItemOpacity: 100,                // Full opacity

                  // Arrow settings
                  currentItemStartArrowhead: null,        // No start arrow
                  currentItemEndArrowhead: "arrow",       // Arrow at end

                  // UI settings
                  viewBackgroundColor: '#ffffff',
                  currentItemFontFamily: 1,               // System font
                  currentItemFontSize: 16,
                  gridSize: 20,                           // Show grid
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcalidrawBuilderMockup;
