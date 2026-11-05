import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import CardExtrasPanel from '@routes/Flashcard/v2-1/pages/TopicList/components/AnkiPlayer/components/CardExtrasPanel'
import RichTextViewer from '@components/common/RichTextViewer'
import { isRichTextEmpty } from '@utils/richTextUtils'
import { useQuizPlayer, RATINGS, MAX_AGAIN } from './hooks/useQuizPlayer'
import {
  PlayerScreen, PlayerHeader, HeaderBar, BackBtn, HeaderTitle, HeaderCounter, RevealAllBtn,
  ProgressBar, ProgressFill,
  PlayerBody, CasePanel, ResizeHandle, QuestionPanel,
  BreadcrumbRow, BreadcrumbChip, BreadcrumbSep, NewBadge, QuestionCountBadge,
  ImageBlock, QuestionImage, ImageCaption,
  VignetteText, QuestionBlock, QuestionHeaderRow, QuestionNumber, QuestionText,
  ChoiceList, ChoiceBtn, ChoiceLabel,
  TextAnswerWrap, TextAnswerInput,
  AnswerReveal, YourAnswerLine, ShowAnswerBtn,
  CaseExplanation, CaseExplanationLabel,
  RatingFooter, RatingBtn, RatingSubLabel,
} from './QuizPlayer.styles'

export default function QuizPlayer({ cards, onBack }) {
  const {
    card, questions, queue, index, progress, retryCount,
    hasCaseContent, answers, allRevealed,
    photoOpen, setPhotoOpen,
    bodyRef, casePanelRef, questionPanelRef,
    caseWidthPercent, startResizing,
    handleSelectChoice, handleReveal, handleTextAnswerChange, handleRevealAll,
    getChoiceState, handleRate,
  } = useQuizPlayer({ cards, onBack })

  if (!card) return null

  const topicName = card.topic?.name
  const subtopicName = card.subtopic?.name

  const hasBreadcrumb = !!(topicName || subtopicName || card.isNew || questions.length > 1)
  const breadcrumb = hasBreadcrumb && (
    <BreadcrumbRow>
      {topicName && <BreadcrumbChip>{topicName}</BreadcrumbChip>}
      {topicName && subtopicName && <BreadcrumbSep>›</BreadcrumbSep>}
      {subtopicName && <BreadcrumbChip>{subtopicName}</BreadcrumbChip>}
      {questions.length > 1 && <QuestionCountBadge>{questions.length} Soal</QuestionCountBadge>}
      {card.isNew && <NewBadge>Baru</NewBadge>}
    </BreadcrumbRow>
  )

  return (
    <PhotoProvider visible={photoOpen} onVisibleChange={setPhotoOpen}>
      {card.imageUrl && (
        <PhotoView src={card.imageUrl}>
          <span style={{ display: 'none' }} />
        </PhotoView>
      )}

      <PlayerScreen>
        <PlayerHeader>
          <HeaderBar>
            <BackBtn onClick={onBack} aria-label="Kembali">‹</BackBtn>
            <HeaderTitle>Sesi Latihan</HeaderTitle>
            {!allRevealed && questions.length > 1 && (
              <RevealAllBtn onClick={handleRevealAll}>Lihat Semua Jawaban</RevealAllBtn>
            )}
            <HeaderCounter><b>{index + 1}</b> / {queue.length}</HeaderCounter>
          </HeaderBar>
          <ProgressBar>
            <ProgressFill $progress={progress} />
          </ProgressBar>
        </PlayerHeader>

        <PlayerBody ref={bodyRef} $caseWidth={caseWidthPercent}>
          {hasCaseContent && (
            <>
              <CasePanel ref={casePanelRef}>
                {breadcrumb}

                {card.imageUrl && (
                  <>
                    <ImageBlock onClick={() => setPhotoOpen(true)}>
                      <QuestionImage src={card.imageUrl} alt={card.imageCaption || ''} />
                    </ImageBlock>
                    {card.imageCaption && <ImageCaption>{card.imageCaption}</ImageCaption>}
                  </>
                )}

                {card.vignette && <VignetteText>{card.vignette}</VignetteText>}
              </CasePanel>

              <ResizeHandle
                onMouseDown={startResizing}
                onTouchStart={startResizing}
                role="separator"
                aria-orientation="vertical"
                aria-label="Ubah lebar panel"
              />
            </>
          )}

          <QuestionPanel ref={questionPanelRef}>
            {!hasCaseContent && breadcrumb}

            {questions.map((question, questionIndex) => {
              const entry = answers[question.id]
              const revealed = !!entry?.revealed
              const textAnswer = entry?.textAnswer || ''
              const choices = question.choices || []
              const isTextAnswer = !choices.length || question.answerType === 'text'

              return (
                <QuestionBlock key={question.id}>
                  <QuestionHeaderRow>
                    {questions.length > 1 && <QuestionNumber>{questionIndex + 1}.</QuestionNumber>}
                    <QuestionText>{question.question}</QuestionText>
                  </QuestionHeaderRow>

                  {!isTextAnswer && (
                    <ChoiceList>
                      {choices.map((choice, i) => {
                        const state = getChoiceState(question.id, choice, question.answer)
                        return (
                          <ChoiceBtn
                            key={i}
                            $state={state}
                            $disabled={revealed}
                            onClick={() => handleSelectChoice(question.id, choice)}
                            disabled={revealed}
                          >
                            <ChoiceLabel $state={state}>
                              {String.fromCharCode(65 + i)}
                            </ChoiceLabel>
                            {choice}
                          </ChoiceBtn>
                        )
                      })}
                    </ChoiceList>
                  )}

                  {isTextAnswer && (
                    <TextAnswerWrap>
                      <TextAnswerInput
                        placeholder="Ketik jawaban Anda di sini..."
                        value={textAnswer}
                        onChange={e => handleTextAnswerChange(question.id, e.target.value)}
                        disabled={revealed}
                        rows={3}
                      />
                      {!revealed && (
                        <ShowAnswerBtn onClick={() => handleReveal(question.id)}>Lihat Jawaban</ShowAnswerBtn>
                      )}
                    </TextAnswerWrap>
                  )}

                  {revealed && isTextAnswer && (
                    <AnswerReveal>
                      {textAnswer.trim() && <YourAnswerLine>Jawaban Anda: {textAnswer}</YourAnswerLine>}
                      <div>Jawaban Benar: {question.answer}</div>
                    </AnswerReveal>
                  )}

                  {revealed && (
                    <CardExtrasPanel
                      explanationShort={question.explanationShort}
                      explanationLong={question.explanationLong}
                      references={question.references}
                      linkedSummaryNotes={question.linkedSummaryNotes}
                      renderHtml
                    />
                  )}
                </QuestionBlock>
              )
            })}

            {allRevealed && !isRichTextEmpty(card.explanation) && (
              <CaseExplanation>
                <CaseExplanationLabel>Pembahasan Kasus</CaseExplanationLabel>
                <RichTextViewer html={card.explanation} />
              </CaseExplanation>
            )}

            {allRevealed && card.references?.length > 0 && (
              <CardExtrasPanel references={card.references} />
            )}
          </QuestionPanel>
        </PlayerBody>

        {allRevealed && (
          <RatingFooter>
            {RATINGS.map(r => (
              <RatingBtn
                key={r.key}
                $color={r.color}
                onClick={() => handleRate(r.key)}
                disabled={r.key === 'again' && retryCount >= MAX_AGAIN}
                title={r.key === 'again' && retryCount >= MAX_AGAIN ? 'Batas ulang tercapai' : undefined}
              >
                {r.label}
                {r.key === 'again' && retryCount > 0 && retryCount < MAX_AGAIN && (
                  <RatingSubLabel>{MAX_AGAIN - retryCount}x lagi</RatingSubLabel>
                )}
              </RatingBtn>
            ))}
          </RatingFooter>
        )}
      </PlayerScreen>
    </PhotoProvider>
  )
}
