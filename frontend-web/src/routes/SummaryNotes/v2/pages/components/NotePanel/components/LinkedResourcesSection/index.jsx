import { useNavigate, generatePath } from 'react-router-dom'
import { AtlasQuizRoute } from '@routes/AtlasQuiz/routes'
import { FlashcardRoute } from '@routes/Flashcard/routes'
import { MultipleChoiceRoute } from '@routes/MultipleChoice/routes'
import { TopicHubRoute } from '@routes/TopicHub/routes'
import { SectionRow, SectionLabel, SectionLine } from '../../NotePanel.styles'
import {
  LinkedGroup, LinkedGroupLabel, LinkedGroupHint,
  RelatedList, RelatedRow, RelatedIcon, RelatedInfo, RelatedTitle, RelatedSubtitle, RelatedBadge, RelatedArrow,
} from './LinkedResourcesSection.styles'

export default function LinkedResourcesSection({
  topicSlug, topicName, subtopicSlug, subtopicName,
  nodeStats, anatomyQuizzes,
  flashcardLabel, mcqLabel,
  hasTopic, hasFlashcards, hasMcq, hasAnatomyQuizzes,
}) {
  const navigate = useNavigate()

  const goToSubtopic = () => {
    if (topicSlug && subtopicSlug) {
      navigate(generatePath(TopicHubRoute.subtopicRoute, { topicSlug, subtopicSlug }))
    }
  }

  return (
    <>
      <SectionRow>
        <SectionLabel>📚 Terkait</SectionLabel>
        <SectionLine />
      </SectionRow>

      {hasTopic && (
        <LinkedGroup>
          <LinkedGroupLabel>Topik Terkait</LinkedGroupLabel>
          <LinkedGroupHint>Lihat materi subtopik ini di halaman Materi.</LinkedGroupHint>
          <RelatedList>
            <RelatedRow $type="topic" onClick={goToSubtopic}>
              <RelatedIcon>📁</RelatedIcon>
              <RelatedInfo>
                <RelatedTitle>{topicName}</RelatedTitle>
              </RelatedInfo>
              <RelatedBadge $type="topic">Topik</RelatedBadge>
              <RelatedArrow>→</RelatedArrow>
            </RelatedRow>
          </RelatedList>
        </LinkedGroup>
      )}

      {hasFlashcards && (
        <LinkedGroup>
          <LinkedGroupLabel>Related Flashcards</LinkedGroupLabel>
          <LinkedGroupHint>Kartu-kartu terkait untuk membantu retensi jangka panjang.</LinkedGroupHint>
          <RelatedList>
            <RelatedRow
              $type="flashcard"
              onClick={() => navigate(`${FlashcardRoute.moduleRoute}?subtopic=${encodeURIComponent(subtopicName)}`)}
            >
              <RelatedIcon>🃏</RelatedIcon>
              <RelatedInfo>
                <RelatedTitle>{subtopicName}</RelatedTitle>
                <RelatedSubtitle>{nodeStats.flashcardCards} kartu</RelatedSubtitle>
              </RelatedInfo>
              <RelatedBadge $type="flashcard">{flashcardLabel}</RelatedBadge>
              <RelatedArrow>→</RelatedArrow>
            </RelatedRow>
          </RelatedList>
        </LinkedGroup>
      )}

      {hasMcq && (
        <LinkedGroup>
          <LinkedGroupLabel>Related Preclinical Questions</LinkedGroupLabel>
          <LinkedGroupHint>Soal-soal {mcqLabel} untuk uji pemahamanmu.</LinkedGroupHint>
          <RelatedList>
            <RelatedRow
              $type="mcq"
              onClick={() => navigate(`${MultipleChoiceRoute.moduleRoute}?subtopic=${encodeURIComponent(subtopicName)}`)}
            >
              <RelatedIcon>📝</RelatedIcon>
              <RelatedInfo>
                <RelatedTitle>{subtopicName}</RelatedTitle>
                <RelatedSubtitle>{nodeStats.mcqQuestions} soal</RelatedSubtitle>
              </RelatedInfo>
              <RelatedBadge $type="mcq">{mcqLabel}</RelatedBadge>
              <RelatedArrow>→</RelatedArrow>
            </RelatedRow>
          </RelatedList>
        </LinkedGroup>
      )}

      {hasAnatomyQuizzes && (
        <LinkedGroup>
          <LinkedGroupLabel>Related 3D Anatomy Quizzes</LinkedGroupLabel>
          <LinkedGroupHint>Latihan identifikasi struktur pada model 3D anatomi.</LinkedGroupHint>
          <RelatedList>
            {anatomyQuizzes.map(quiz => (
              <RelatedRow
                key={quiz.linkedUniqueId}
                $type="anatomy"
                onClick={() => navigate(generatePath(AtlasQuizRoute.anatomyQuizRoute, { slug: topicSlug, uniqueId: quiz.linkedUniqueId }))}
              >
                <RelatedIcon>🧠</RelatedIcon>
                <RelatedInfo>
                  <RelatedTitle>{quiz.linkedTitle}</RelatedTitle>
                  {quiz.description && <RelatedSubtitle>{quiz.description}</RelatedSubtitle>}
                </RelatedInfo>
                <RelatedArrow>→</RelatedArrow>
              </RelatedRow>
            ))}
          </RelatedList>
        </LinkedGroup>
      )}
    </>
  )
}
