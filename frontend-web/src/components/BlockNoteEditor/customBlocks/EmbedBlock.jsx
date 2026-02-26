// EmbedBlock.jsx
import { createReactBlockSpec } from "@blocknote/react";
import { useState, useRef } from "react";
import {
  EmbedContainer,
  EmbedCard,
  TabHeader,
  TabButton,
  ContentArea,
  PlaceholderOverlay,
  PlaceholderIcon,
  PlaceholderText,
  URLInput,
  ActionButtons,
  CancelButton,
  EmbedButton,
  EmbedWrapper,
  IframeContainer,
  IframeElement,
  EditButton,
  WidthHandle,
  HeightResizeHandle,
  ResizeOverlay,
  SizeLabel,
} from './EmbedBlock.styles';

export const createEmbedBlock = createReactBlockSpec(
  {
    type: "embed",
    propSchema: {
      url: { default: "" },
      height: { default: 480 },
      width: { default: 100 },
    },
    content: "none",
  },
  {
    render: (props) => {
      const { url, height, width } = props.block.props;
      const [isEditing, setIsEditing] = useState(!url);
      const [urlInput, setUrlInput] = useState(url || "");
      const [localHeight, setLocalHeight] = useState(height);
      const [localWidth, setLocalWidth] = useState(width);
      const [isResizingHeight, setIsResizingHeight] = useState(false);
      const [isResizingWidth, setIsResizingWidth] = useState(false);
      const localHeightRef = useRef(height);
      const localWidthRef = useRef(width);
      const outerRef = useRef(null);

      const handleSave = () => {
        if (urlInput.trim()) {
          props.editor.updateBlock(props.block, {
            props: {
              url: urlInput.trim(),
              height: localHeightRef.current,
              width: localWidthRef.current,
            },
          });
          setIsEditing(false);
        }
      };

      const handleRemove = () => {
        props.editor.removeBlocks([props.block]);
      };

      const handleHeightResizeStart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const startY = e.clientY;
        const startHeight = localHeightRef.current;
        setIsResizingHeight(true);

        const handleMouseMove = (moveEvent) => {
          const delta = moveEvent.clientY - startY;
          const newHeight = Math.max(100, startHeight + delta);
          localHeightRef.current = newHeight;
          setLocalHeight(newHeight);
        };

        const handleMouseUp = () => {
          setIsResizingHeight(false);
          props.editor.updateBlock(props.block, {
            props: { height: localHeightRef.current },
          });
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      };

      const handleWidthResizeStart = (e, side) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startWidth = localWidthRef.current;
        const parentWidth = outerRef.current?.clientWidth || 800;
        setIsResizingWidth(true);

        const handleMouseMove = (moveEvent) => {
          const delta = moveEvent.clientX - startX;
          const pixelDelta = side === 'right' ? delta : -delta;
          const currentPixelWidth = (startWidth / 100) * parentWidth;
          const newPixelWidth = currentPixelWidth + pixelDelta;
          const newWidth = Math.min(100, Math.max(20, (newPixelWidth / parentWidth) * 100));
          localWidthRef.current = newWidth;
          setLocalWidth(newWidth);
        };

        const handleMouseUp = () => {
          setIsResizingWidth(false);
          props.editor.updateBlock(props.block, {
            props: { width: Math.round(localWidthRef.current) },
          });
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      };

      // Editing mode - Compact floating card
      if (isEditing || !url) {
        return (
          <div className="bn-block-content" contentEditable={false}>
            <EmbedContainer>
              <EmbedCard>
                {/* Tab header */}
                <TabHeader>
                  <TabButton>Embed</TabButton>
                </TabHeader>

                {/* Content area */}
                <ContentArea>
                  {/* Placeholder overlay - shows when empty */}
                  {!urlInput && (
                    <PlaceholderOverlay>
                      <PlaceholderIcon>🔗</PlaceholderIcon>
                      <PlaceholderText>Add embed URL</PlaceholderText>
                    </PlaceholderOverlay>
                  )}

                  {/* Actual input field - always present */}
                  <URLInput
                    id="embed-url-input"
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && urlInput.trim()) {
                        e.preventDefault();
                        handleSave();
                      } else if (e.key === "Escape") {
                        e.preventDefault();
                        if (url) {
                          setIsEditing(false);
                        } else {
                          handleRemove();
                        }
                      }
                    }}
                    autoFocus
                  />

                  {/* Action buttons */}
                  <ActionButtons>
                    <CancelButton
                      onClick={() => {
                        if (url) {
                          setIsEditing(false);
                        } else {
                          handleRemove();
                        }
                      }}
                    >
                      Cancel
                    </CancelButton>
                    <EmbedButton
                      onClick={handleSave}
                      disabled={!urlInput.trim()}
                    >
                      Embed link
                    </EmbedButton>
                  </ActionButtons>
                </ContentArea>
              </EmbedCard>
            </EmbedContainer>
          </div>
        );
      }

      // View mode with iframe
      const isEditable = props.editor.isEditable;
      const isResizing = isResizingHeight || isResizingWidth;

      return (
        <div
          className="bn-block-content"
          contentEditable={false}
          style={{ width: "100%", position: "relative" }}
          ref={outerRef}
        >
          <EmbedWrapper width={localWidth}>
            {/* Left width resize handle — absolutely positioned */}
            {isEditable && (
              <WidthHandle
                side="left"
                onMouseDown={(e) => handleWidthResizeStart(e, 'left')}
              />
            )}

            {/* Right width resize handle — absolutely positioned */}
            {isEditable && (
              <WidthHandle
                side="right"
                onMouseDown={(e) => handleWidthResizeStart(e, 'right')}
              />
            )}

            <IframeContainer>
              {/* Overlay to block iframe mouse events during resize */}
              {isResizing && (
                <ResizeOverlay cursor={isResizingHeight ? 'ns-resize' : 'ew-resize'} />
              )}
              <IframeElement
                src={url}
                height={localHeight}
                allowFullScreen
                loading="lazy"
                title="Embedded content"
              />
              {/* Edit button */}
              {isEditable && (
                <EditButton onClick={() => setIsEditing(true)}>
                  ✏️ Edit
                </EditButton>
              )}
              {/* Height resize handle at bottom */}
              {isEditable && (
                <HeightResizeHandle onMouseDown={handleHeightResizeStart}>
                  <span />
                  {isResizing && (
                    <SizeLabel>
                      {Math.round(localWidth)}% × {Math.round(localHeight)}px
                    </SizeLabel>
                  )}
                </HeightResizeHandle>
              )}
            </IframeContainer>
          </EmbedWrapper>
        </div>
      );
    },
  }
);
