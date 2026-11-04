import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, generatePath } from 'react-router-dom'
import { fetchPublicConstants } from '@store/constant/userAction'
import { AtlasQuizRoute } from '@routes/AtlasQuiz/routes'
import { FlashcardRoute } from '@routes/Flashcard/routes'
import { MultipleChoiceRoute } from '@routes/MultipleChoice/routes'
import { TopicHubRoute } from '@routes/TopicHub/routes'

// Builds one flat list of everything a reader can go to next. The previous layout
// gave each kind its own heading and explanatory paragraph to wrap a single row,
// which cost four headings and four paragraphs to show four links.
export function useLinkedResourcesSection({ topicSlug, topicName, subtopicSlug, subtopicName }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const nodeStats = useSelector(s => s.summaryNotesV2.nodeStats)
  const anatomyQuizzes = useSelector(s => s.summaryNotesV2.anatomyQuizzes)
  const constants = useSelector(s => s.constant.constants)

  useEffect(() => {
    dispatch(fetchPublicConstants(['flashcard_feature_title', 'mcq_feature_title']))
  }, [dispatch])

  const flashcardLabel = constants?.flashcard_feature_title || 'Flashcard'
  const mcqLabel = constants?.mcq_feature_title || 'MCQ'

  const resources = useMemo(() => {
    const items = []

    if (topicName && topicSlug && subtopicSlug) {
      items.push({
        key: 'topic',
        type: 'topic',
        kind: 'Materi',
        title: subtopicName || topicName,
        meta: topicName,
        onClick: () => navigate(generatePath(TopicHubRoute.subtopicRoute, { topicSlug, subtopicSlug })),
      })
    }

    if ((nodeStats?.flashcardCards ?? 0) > 0 && subtopicName) {
      items.push({
        key: 'flashcard',
        type: 'flashcard',
        kind: flashcardLabel,
        title: subtopicName,
        meta: `${nodeStats.flashcardCards} kartu`,
        onClick: () => navigate(`${FlashcardRoute.moduleRoute}?subtopic=${encodeURIComponent(subtopicName)}`),
      })
    }

    if ((nodeStats?.mcqQuestions ?? 0) > 0 && subtopicName) {
      items.push({
        key: 'mcq',
        type: 'mcq',
        kind: mcqLabel,
        title: subtopicName,
        meta: `${nodeStats.mcqQuestions} soal`,
        onClick: () => navigate(`${MultipleChoiceRoute.moduleRoute}?subtopic=${encodeURIComponent(subtopicName)}`),
      })
    }

    for (const quiz of anatomyQuizzes) {
      items.push({
        key: `anatomy-${quiz.uniqueId}`,
        type: 'anatomy',
        kind: 'Kuis Anatomi 3D',
        title: quiz.title,
        meta: quiz.description || null,
        onClick: () => navigate(generatePath(AtlasQuizRoute.anatomyQuizRoute, {
          slug: topicSlug, uniqueId: quiz.uniqueId,
        })),
      })
    }

    return items
  }, [
    topicName, topicSlug, subtopicSlug, subtopicName,
    nodeStats, anatomyQuizzes, flashcardLabel, mcqLabel, navigate,
  ])

  return { resources }
}
