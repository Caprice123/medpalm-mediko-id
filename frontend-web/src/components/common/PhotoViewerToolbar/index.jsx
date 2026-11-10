import { FaSearchPlus, FaSearchMinus, FaRedo, FaDownload } from 'react-icons/fa'

// Saves the image bytes rather than navigating to the URL, so a blob endpoint that redirects
// to a presigned URL still lands as a file. Opening the URL is the fallback when the fetch is
// blocked (CORS, offline).
const downloadImage = async (imageUrl) => {
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
  } catch {
    window.open(imageUrl, '_blank')
  }
}

// Toolbar for react-photo-view's lightbox, shared by every viewer that opens one. Pass
// `onDownload` only to override the default save behaviour.
export function PhotoViewerToolbar({ rotate, onRotate, onScale, scale, images, index, onDownload = downloadImage }) {
  const currentSrc = images?.[index]?.src

  return (
    <>
      <div className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale + 0.5)}>
        <FaSearchPlus size={20} />
      </div>

      <div className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale - 0.5)}>
        <FaSearchMinus size={20} />
      </div>

      <div className="PhotoView-Slider__toolbarIcon" onClick={() => onRotate(rotate + 90)}>
        <FaRedo size={18} />
      </div>

      {currentSrc && (
        <div className="PhotoView-Slider__toolbarIcon" onClick={() => onDownload(currentSrc)}>
          <FaDownload size={18} />
        </div>
      )}
    </>
  )
}
