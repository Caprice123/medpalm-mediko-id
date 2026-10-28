import styled from 'styled-components'
import { colors, fonts, gradients, media } from '../../theme'

export const SectionWrapper = styled.section`
  background: ${colors.pageBackground};
  padding-block: 31px;
`

export const Banner = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 32px;
  background: ${gradients.ctaBanner};
  min-height: 274px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${media.mobile} {
    border-radius: 24px;
  }
`

export const Decoration = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  user-select: none;
  overflow: hidden;
`

// Both doodle plates are crops of a single exported image, offset inside their
// own clipping frame the way the design slices them.
const DoodleFrame = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  overflow: hidden;
`

export const DoodleLeftFrame = styled(DoodleFrame)`
  left: 0;
  width: 425px;
`

export const DoodleLeftImage = styled.img`
  position: absolute;
  top: -29.93%;
  left: -5.41%;
  width: 308.71%;
  height: 159.61%;
  max-width: none;
`

export const DoodleRightFrame = styled(DoodleFrame)`
  right: 0;
  width: 309px;
`

export const DoodleRightImage = styled.img`
  position: absolute;
  top: -41.97%;
  left: -325.24%;
  width: 425.24%;
  height: 159.85%;
  max-width: none;
`

export const FrameLeft = styled.img`
  position: absolute;
  left: 0;
  top: 50%;
  width: 614.8px;
  height: 274px;
  transform: translateY(-50%) rotate(90deg);
  transform-origin: center;
  object-fit: cover;
`

export const FrameRight = styled.img`
  position: absolute;
  right: -7px;
  top: 50%;
  width: 232px;
  height: 282px;
  transform: translateY(-50%) rotate(180deg);
`

export const BannerMascot = styled.img`
  position: absolute;
  left: 11px;
  top: 31px;
  width: 316px;
  height: 316px;
  object-fit: contain;
  pointer-events: none;
  user-select: none;

  ${media.tablet} {
    display: none;
  }
`

export const BannerContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 30px 24px 34px;
  max-width: 520px;
`

export const Eyebrow = styled.p`
  font-family: ${fonts.body};
  font-weight: 700;
  font-size: 13.63px;
  line-height: 1.7;
  letter-spacing: 1.91px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.86);
  margin: 0;
`

export const Heading = styled.h2`
  font-family: ${fonts.heading};
  font-weight: 800;
  font-size: 39.46px;
  line-height: 1.18;
  letter-spacing: -0.39px;
  color: #fff;
  margin: 14px 0 0;

  ${media.mobile} {
    font-size: 30px;
  }
`

export const Description = styled.p`
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 14px;
  line-height: 1.43;
  color: rgba(255, 255, 255, 0.86);
  margin: 16px 0 0;
`

export const BannerButton = styled.button`
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 15px;
  color: #25749e;
  background: #fff;
  border: 1px solid transparent;
  border-radius: 30px;
  height: 48px;
  padding: 0 30px;
  margin-top: 22px;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 22px -12px rgba(0, 0, 0, 0.45);
  }
`
