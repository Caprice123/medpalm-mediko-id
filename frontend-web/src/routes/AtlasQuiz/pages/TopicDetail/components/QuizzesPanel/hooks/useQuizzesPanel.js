import { useState } from 'react'
import { useSelector } from 'react-redux'

export function useQuizzesPanel() {
  const [searchQuiz, setSearchQuiz] = useState('')
  const quizzes = useSelector(s => s.atlasQuiz.topicAnatomyQuizzes)

  const filteredQuizzes = searchQuiz
    ? quizzes.filter(q => q.title.toLowerCase().includes(searchQuiz.toLowerCase()))
    : quizzes

  return { searchQuiz, setSearchQuiz, filteredQuizzes }
}
