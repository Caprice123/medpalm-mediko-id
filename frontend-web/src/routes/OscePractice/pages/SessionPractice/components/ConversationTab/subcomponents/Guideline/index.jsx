import { useState } from 'react'
import { useSelector } from 'react-redux'
import { GuideSection, GuideText, GuideTitle } from '../../../../SessionPractice.styles'

const Guideline = () => {
  const [isGuideVisible, setIsGuideVisible] = useState(true)
  const {sessionDetail} = useSelector(state => state.oscePractice)

  return (
    <>
        {sessionDetail?.topic.guide && (
            <GuideSection>
                <GuideTitle onClick={() => setIsGuideVisible(!isGuideVisible)}>
                <span>{isGuideVisible ? '▼' : '▶'}</span>
                    Panduan
                </GuideTitle>
                {isGuideVisible && (
                    <GuideText>
                        {sessionDetail.topic.guide}
                    </GuideText>
                )}
            </GuideSection>
        )}
    </>

  )
}

export default Guideline