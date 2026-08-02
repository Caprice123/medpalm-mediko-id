import { useState } from 'react'

export function useQuizzesPanel(quizzes) {
  const [searchQuiz, setSearchQuiz] = useState('')

  const filteredQuizzes = searchQuiz
    ? quizzes.filter(q => q.title.toLowerCase().includes(searchQuiz.toLowerCase()))
    : quizzes

  return { searchQuiz, setSearchQuiz, filteredQuizzes }
}
