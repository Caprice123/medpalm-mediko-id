import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  useCreateBlockNote,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  FormattingToolbarController,
  getFormattingToolbarItems,
  FormattingToolbar,
} from "@blocknote/react";
import { useEffect, useRef, useState } from 'react'
import { PhotoProvider } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { EditorContainer, EditorWrapper, ModeToggle, ModeButton } from './BlockNoteEditor.styles'
import { createEmbedBlock } from './customBlocks/EmbedBlock'
import { insertEmbed } from './customBlocks/EmbedSlashMenu'
import { CropImageButton } from './CropImageButton'
import ImageCropModal from './ImageCropModal'
import { PhotoViewerToolbar } from './PhotoViewerToolbar'
import { filterSuggestionItems } from "@blocknote/core/extensions";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";


function BlockNoteEditor({ initialContent, onChange, editable = true, placeholder, showModeToggle = false, onImageUpload }) {
  const [viewMode, setViewMode] = useState('structured') // 'structured' or 'aesthetic'
  const [cropModalData, setCropModalData] = useState(null) // { imageUrl, blockId }
  const [photoIndex, setPhotoIndex] = useState(0)
  const [photoVisible, setPhotoVisible] = useState(false)
  const [images, setImages] = useState([])

  const schema = BlockNoteSchema.create({
    blockSpecs: {
        ...defaultBlockSpecs,
        embed: createEmbedBlock(),
    },
  });
  const editor = useCreateBlockNote({
    initialContent: initialContent || [
      {
        type: "paragraph",
        content: "",
      },
    ],
    schema: schema,
    uploadFile: onImageUpload ? async (file) => {
      try {
        const url = await onImageUpload(file)
        return url
      } catch (error) {
        console.error('Failed to upload image:', error)
        throw error
      }
    } : undefined,
  });

  const slashItems = [
    ...getDefaultReactSlashMenuItems(editor),
    {
      title: "Embed",
      subtext: "Embed any website, video, or interactive content",
      aliases: ["iframe", "video", "figma", "youtube", "reactflow"],
      group: "Embeds",
      icon: '🔗',
      onItemClick: () => {
        insertEmbed(editor); // you already wrote this helper
      },
    },
  ];

  const previousContentRef = useRef(null)
  const isInternalUpdateRef = useRef(false) // Track if update is from user typing

  // Handle crop click for existing images
  const handleCropClick = async (imageBlock) => {
    if (!imageBlock || !imageBlock.props.url || !onImageUpload) return

    setCropModalData({
      imageUrl: imageBlock.props.url,
      blockId: imageBlock.id,
      onSave: async (croppedFile) => {
        try {
          // Upload the cropped image
          const newUrl = await onImageUpload(croppedFile)

          // Update the block with the new URL
          editor.updateBlock(imageBlock.id, {
            type: "image",
            props: {
              ...imageBlock.props,
              url: newUrl
            }
          })

          setCropModalData(null)
        } catch (error) {
          console.error('Failed to upload cropped image:', error)
          alert('Failed to upload cropped image. Please try again.')
        }
      },
      onCancel: () => {
        setCropModalData(null)
      }
    })
  }

  // Handle image click for preview (view-only mode)
  const handleEditorClick = (e) => {
    if (!editable && e.target.tagName === 'IMG') {
      const clickedSrc = e.target.src

      // Get all images from editor
      const allImages = editor.document
        .filter(block => block.type === 'image' && block.props.url)
        .map(block => block.props.url)

      setImages(allImages)
      const clickedIndex = allImages.indexOf(clickedSrc)
      setPhotoIndex(clickedIndex >= 0 ? clickedIndex : 0)
      setPhotoVisible(true)
    }
  }

  // Handle image download
  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `image-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download image:', error)
      // Fallback to opening in new tab
      window.open(imageUrl, '_blank')
    }
  }

  // Update editor content when initialContent changes externally
  useEffect(() => {
    if (!editor || !initialContent) return

    // Check if content actually changed (avoid unnecessary updates)
    const newContentStr = JSON.stringify(initialContent)
    if (previousContentRef.current === newContentStr) {
      return
    }

    // Skip if this update is coming from the editor itself (user typing)
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false
      previousContentRef.current = newContentStr
      return
    }

    try {
      console.log('External update detected - replacing editor content')

      // Get all current blocks
      const currentBlocks = editor.document

      // Replace all blocks at once with new content (only for external updates like AI generation)
      if (currentBlocks.length > 0) {
        editor.replaceBlocks(currentBlocks, initialContent)
      } else {
        // If no blocks exist, insert the new ones
        editor.insertBlocks(initialContent)
      }

      previousContentRef.current = newContentStr
      console.log('Editor content updated successfully')
    } catch (error) {
      console.error('Failed to update editor content:', error)
    }
  }, [initialContent, editor])

  // Listen to editor changes and call onChange
  useEffect(() => {
    if (!editor || !onChange) return

    const handleUpdate = () => {
      // Mark this as an internal update (from user typing)
      isInternalUpdateRef.current = true

      const blocks = editor.document
      onChange(blocks)
    }

    editor.onChange(handleUpdate)
  }, [editor, onChange])

  if (!editor) {
    return <div style={{ padding: '1rem', color: '#9ca3af' }}>Loading editor...</div>
  }

  return (
    <>
      <PhotoProvider
        visible={photoVisible}
        onVisibleChange={setPhotoVisible}
        images={images.map(src => ({ src }))}
        index={photoIndex}
        onIndexChange={setPhotoIndex}
        maskOpacity={0.9}
        toolbarRender={(props) => (
          <PhotoViewerToolbar {...props} onDownload={handleDownload} />
        )}
      >
        <EditorContainer>
          {showModeToggle && (
            <ModeToggle>
              <ModeButton
                $active={viewMode === 'structured'}
                onClick={() => setViewMode('structured')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Structured
              </ModeButton>
              <ModeButton
                $active={viewMode === 'aesthetic'}
                onClick={() => setViewMode('aesthetic')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                Aesthetic
              </ModeButton>
            </ModeToggle>
          )}

          <EditorWrapper
            $isStructured={viewMode === 'structured'}
            onClick={handleEditorClick}
            data-editable={editable}
          >
            <BlockNoteView
                editor={editor}
                theme={"black"}
                editable={editable}
                formattingToolbar={false}
                onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                    e.stopPropagation()
                    }
                }}
                >
                <SuggestionMenuController
                    triggerCharacter="/"
                    getItems={async (query) =>
                    filterSuggestionItems(slashItems, query)
                    }
                />

                <FormattingToolbarController
                  formattingToolbar={() => (
                    <FormattingToolbar>
                      {getFormattingToolbarItems()}
                      {editable && onImageUpload && <CropImageButton onCropClick={handleCropClick} />}
                    </FormattingToolbar>
                  )}
                />
                </BlockNoteView>

          </EditorWrapper>
        </EditorContainer>
      </PhotoProvider>

      {cropModalData && (
        <ImageCropModal
          imageUrl={cropModalData.imageUrl}
          onSave={cropModalData.onSave}
          onCancel={cropModalData.onCancel}
        />
      )}
    </>
  )
}

export default BlockNoteEditor
