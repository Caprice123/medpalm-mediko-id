import { useState } from 'react'
import { useSelector } from 'react-redux'

export function useModulesPanel() {
  const [search, setSearch] = useState('')
  const modules = useSelector(s => s.atlasQuiz.topicModules)
  const moduleFilter = useSelector(s => s.atlasQuiz.modulesFilter.module)
  const quizzes = useSelector(s => s.atlasQuiz.topicAnatomyQuizzes)
  const quizFilter = useSelector(s => s.atlasQuiz.quizzesFilter.module)

  const filteredModules = search
    ? modules.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
    : modules

  /* The block of controls only disappears when the topic genuinely holds no
     model. An empty list the student produced themselves — by picking a module
     in the dropdown — has to keep its controls on screen, otherwise there is
     nothing left to clear the filter with. (The dropdown filters server-side;
     the search field filters the loaded list, so it cannot empty it on its own.) */
  const hasModules = modules.length > 0 || !!moduleFilter

  return {
    search,
    setSearch,
    filteredModules,
    hasModules,
    // Nothing at all under this topic — the page would otherwise be a title and
    // a back button over blank space.
    isTopicEmpty: !hasModules && quizzes.length === 0 && !quizFilter,
  }
}
