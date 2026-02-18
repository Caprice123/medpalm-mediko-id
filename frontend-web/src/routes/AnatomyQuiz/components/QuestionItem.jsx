import { useState } from 'react'
import {
  QuestionCard,
  QuestionLabel,
  OptionsContainer,
  OptionButton,
  OptionLabel,
  OptionText,
  AnswerInput,
  ErrorText,
} from './QuestionItem.styles'

function QuestionItem({ question, value, onChange, error }) {
  const [localValue, setLocalValue] = useState(value || '')

  const handleChoiceSelect = (choice) => {
    setLocalValue(choice)
    onChange(question.id, choice)
  }

  const handleTextChange = (e) => {
    setLocalValue(e.target.value)
  }

  const handleTextBlur = () => {
    onChange(question.id, localValue)
  }

  return (
    <QuestionCard>
      {question.question && (
        <QuestionLabel>
          {question.question}
          <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
        </QuestionLabel>
      )}
      {question.answerType === 'multiple_choice' && question.choices?.length > 0 ? (
        <OptionsContainer>
          {question.choices.map((choice, choiceIndex) => {
            const isSelected = localValue === choice
            return (
              <OptionButton
                key={choiceIndex}
                type="button"
                selected={isSelected}
                onClick={() => handleChoiceSelect(choice)}
              >
                <OptionLabel selected={isSelected}>
                  {String.fromCharCode(65 + choiceIndex)}
                </OptionLabel>
                <OptionText>{choice}</OptionText>
              </OptionButton>
            )
          })}
        </OptionsContainer>
      ) : (
        <AnswerInput
          type="text"
          value={localValue}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          placeholder="Type your answer here..."
        />
      )}
      {error && <ErrorText>{error}</ErrorText>}
    </QuestionCard>
  )
}

export default QuestionItem
