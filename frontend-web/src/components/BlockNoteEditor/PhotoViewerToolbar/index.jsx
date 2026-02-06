import { FaSearchPlus, FaSearchMinus, FaRedo, FaDownload } from 'react-icons/fa'

export function PhotoViewerToolbar({ rotate, onRotate, onScale, scale, images, index, onDownload }) {
  return (
    <>
      {/* Zoom In */}
      <div className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale + 0.5)}>
        <FaSearchPlus size={20} />
      </div>

      {/* Zoom Out */}
      <div className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale - 0.5)}>
        <FaSearchMinus size={20} />
      </div>

      {/* Rotate */}
      <div className="PhotoView-Slider__toolbarIcon" onClick={() => onRotate(rotate + 90)}>
        <FaRedo size={18} />
      </div>

      {/* Download */}
      <div className="PhotoView-Slider__toolbarIcon" onClick={() => onDownload(images[index].src)}>
        <FaDownload size={18} />
      </div>
    </>
  )
}
