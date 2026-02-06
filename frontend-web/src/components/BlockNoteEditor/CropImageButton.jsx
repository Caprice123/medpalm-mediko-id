import { useBlockNoteEditor, useComponentsContext, useSelectedBlocks } from "@blocknote/react"

export function CropImageButton({ onCropClick }) {
  const editor = useBlockNoteEditor()
  const Components = useComponentsContext()
  const selectedBlocks = useSelectedBlocks()

  // Only show button if exactly one image block is selected
  const selectedImageBlock = selectedBlocks.length === 1 && selectedBlocks[0].type === "image"
    ? selectedBlocks[0]
    : null

  if (!selectedImageBlock || !selectedImageBlock.props.url) {
    return null
  }

  const handleClick = () => {
    onCropClick(selectedImageBlock)
  }

  return (
    <Components.FormattingToolbar.Button
      mainTooltip="Crop Image"
      onClick={handleClick}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="16"
          height="16"
        >
          <path d="M6 2v14a2 2 0 0 0 2 2h14" />
          <path d="M18 22V8a2 2 0 0 0-2-2H2" />
        </svg>
      }
    />
  )
}
