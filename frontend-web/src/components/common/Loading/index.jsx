import {
  Oval,
  ThreeDots,
  Circles,
  TailSpin,
  Puff,
  Rings,
  Hearts,
  Grid,
  Audio,
  BallTriangle,
  Bars,
  RevolvingDot,
  RotatingLines,
  MutatingDots,
  Watch,
  Triangle,
  ColorRing
} from 'react-loader-spinner'
import { LoadingContainer, LoadingText, LoadingOverlay } from './Loading.styles'

/**
 * Reusable Loading component using react-loader-spinner
 *
 * @param {Object} props
 * @param {string} props.type - Spinner type: 'oval', 'dots', 'circles', 'tailspin', 'puff', 'rings', 'hearts', 'grid', 'audio', 'triangle', 'bars', 'revolving', 'rotating', 'mutating', 'watch', 'color-ring', 'ball-triangle'
 * @param {string} props.size - Spinner size: 'small' (40), 'medium' (60), 'large' (80), or custom number
 * @param {string} props.color - Primary spinner color (default: #6BB9E8)
 * @param {string} props.secondaryColor - Secondary color for some spinners
 * @param {string} props.text - Loading text to display below spinner
 * @param {string} props.textSize - Text size: 'small', 'medium', 'large'
 * @param {string} props.textColor - Text color
 * @param {string} props.textWeight - Text weight (e.g., '400', '500', '600')
 * @param {boolean} props.overlay - Show as overlay (absolute positioning with background)
 * @param {string} props.overlayColor - Background color for overlay (default: rgba(255,255,255,0.9))
 * @param {boolean} props.blur - Apply backdrop blur effect when overlay is true
 * @param {string} props.height - Container height
 * @param {string} props.minHeight - Container minimum height
 * @param {string} props.width - Container width
 * @param {string} props.padding - Container padding
 * @param {string} props.gap - Gap between spinner and text
 */
function Loading({
  type = 'oval',
  size = 'medium',
  color = '#6BB9E8',
  secondaryColor,
  text,
  textSize = 'medium',
  textColor,
  textWeight,
  overlay = false,
  overlayColor,
  blur = false,
  height,
  minHeight,
  width,
  padding,
  gap,
  ...rest
}) {
  // Convert size to number
  const sizeMap = {
    small: 40,
    medium: 60,
    large: 80
  }
  const spinnerSize = typeof size === 'number' ? size : sizeMap[size] || 60

  // Determine secondary color
  const defaultSecondaryColor = secondaryColor || '#8DC63F'

  // Render appropriate spinner based on type
  const renderSpinner = () => {
    const commonProps = {
      height: spinnerSize,
      width: spinnerSize,
      color: color,
      ariaLabel: `${type}-loading`,
      wrapperStyle: {},
      wrapperClass: '',
      visible: true,
      ...rest
    }

    switch (type) {
      case 'dots':
      case 'three-dots':
        return <ThreeDots {...commonProps} />

      case 'circles':
        return <Circles {...commonProps} />

      case 'tailspin':
      case 'tail-spin':
        return <TailSpin {...commonProps} />

      case 'puff':
        return <Puff {...commonProps} />

      case 'rings':
        return <Rings {...commonProps} />

      case 'hearts':
        return <Hearts {...commonProps} />

      case 'grid':
        return <Grid {...commonProps} />

      case 'audio':
        return <Audio {...commonProps} />

      case 'triangle':
        return <Triangle {...commonProps} />

      case 'bars':
        return <Bars {...commonProps} />

      case 'revolving':
      case 'revolving-dot':
        return <RevolvingDot {...commonProps} radius={spinnerSize / 2} />

      case 'rotating':
      case 'rotating-lines':
        return <RotatingLines {...commonProps} strokeColor={color} strokeWidth="5" animationDuration="0.75" />

      case 'mutating':
      case 'mutating-dots':
        return <MutatingDots {...commonProps} secondaryColor={defaultSecondaryColor} />

      case 'watch':
        return <Watch {...commonProps} />

      case 'color-ring':
        return <ColorRing {...commonProps} />

      case 'ball-triangle':
        return <BallTriangle {...commonProps} />

      case 'oval':
      default:
        return <Oval {...commonProps} secondaryColor={defaultSecondaryColor} strokeWidth={4} strokeWidthSecondary={4} />
    }
  }

  const content = (
    <LoadingContainer
      height={height}
      minHeight={minHeight}
      width={width}
      padding={padding}
      gap={gap}
    >
      {renderSpinner()}
      {text && (
        <LoadingText
          size={textSize}
          color={textColor}
          weight={textWeight}
        >
          {text}
        </LoadingText>
      )}
    </LoadingContainer>
  )

  if (overlay) {
    return (
      <LoadingOverlay
        overlay={overlay}
        overlayColor={overlayColor}
        blur={blur}
      >
        {content}
      </LoadingOverlay>
    )
  }

  return content
}

export default Loading
