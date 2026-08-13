import { useBasicPreview } from './hooks/useBasicPreview'
import { Wrapper, ContentContainer, FrontText, CardImage, BackBox, RevealButton } from './BasicPreview.styles'

export default function BasicPreview({ front, back, imageUrl }) {
  const { revealed, reveal } = useBasicPreview()

  return (
    <Wrapper>
      <ContentContainer>
        <FrontText>{front}</FrontText>
        {imageUrl && <CardImage src={imageUrl} alt="" />}
        {revealed && <BackBox>{back}</BackBox>}
      </ContentContainer>

      {!revealed && <RevealButton onClick={reveal}>Buka Semua</RevealButton>}
    </Wrapper>
  )
}
