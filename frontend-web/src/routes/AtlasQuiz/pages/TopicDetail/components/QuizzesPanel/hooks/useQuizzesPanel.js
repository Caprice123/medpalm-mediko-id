import { useState } from 'react'
import { useSelector } from 'react-redux'

export function useQuizzesPanel() {
  const [searchQuiz, setSearchQuiz] = useState('')
  const quizzes = useSelector(s => s.atlasQuiz.topicAnatomyQuizzes)
  const quizFilter = useSelector(s => s.atlasQuiz.quizzesFilter.module)

  const filteredQuizzes = searchQuiz
    ? quizzes.filter(q => q.title.toLowerCase().includes(searchQuiz.toLowerCase()))
    : quizzes

  // See useModulesPanel: an empty list caused by the student's own module
  // filter keeps the section, so the filter can still be cleared.
  const hasQuizzes = quizzes.length > 0 || !!quizFilter

  return { searchQuiz, setSearchQuiz, filteredQuizzes, hasQuizzes }
}
