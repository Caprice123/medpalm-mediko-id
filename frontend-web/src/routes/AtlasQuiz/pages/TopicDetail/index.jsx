import { useState } from 'react'
import { useNavigate, useParams, generatePath } from 'react-router-dom'
import { PiCube, PiMedal } from 'react-icons/pi'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { AtlasQuizRoute } from '@routes/AtlasQuiz/routes'
import { useTopicDetail } from './hooks/useTopicDetail'
import {
  PageWrapper, Inner,
  PageTopBar, PageBrand, PageBrandIcon, PageBrandText, PageBrandTitle, PageBrandSubtitle, BackButton,
  TopicCard, ClassificationLabel, TopicRow, TopicIconBox, TopicName, TopicDescription,
  ModulesCard, FilterRow,
  ModulesGrid, ModuleCard, ModuleCardTop, ModuleIconBox, ModuleTitle, ModuleSubtitle, ModuleCardBottom,
  TagRow, ClassificationTag, QuizCountTag, ArrowIcon,
  QuizSection, QuizSectionHeader, QuizSectionTitle, QuizSectionSubtitle,
  QuizGrid, QuizCard, QuizCardTop, QuizIconBox, QuizTitle, QuizModuleName, QuizCardBottom, QuizMeta,
  DifficultyTag,
} from './TopicDetail.styles'

const CLASSIFICATION_LABELS = {
  fisiologi: 'Fisiologi',
  patologi: 'Patologi',
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
}

const DIFFICULTY_LABELS = { easy: 'Mudah', medium: 'Sedang', hard: 'Sulit' }

function classificationLabel(val) {
  if (!val) return null
  return CLASSIFICATION_LABELS[val.toLowerCase()] ?? val
}

function classificationType(val) {
  if (!val) return 'default'
  return val.toLowerCase() === 'patologi' ? 'patologi' : 'fisiologi'
}

function TopicDetailPage() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const {
    topic, modules, modulesPagination,
    quizzes, quizzesPagination,
    moduleOptions,
    isLoadingTopic, isLoadingModules, isLoadingQuizzes,
    handleModuleFilterChange, handleLoadMoreModules,
    handleQuizModuleFilterChange, handleLoadMoreQuizzes,
  } = useTopicDetail(slug)

  const [search, setSearch] = useState('')
  const [searchQuiz, setSearchQuiz] = useState('')

  const filteredModules = search
    ? modules.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
    : modules

  const filteredQuizzes = searchQuiz
    ? quizzes.filter(q => q.title.toLowerCase().includes(searchQuiz.toLowerCase()))
    : quizzes

  const handleModuleClick = (mod) => {
    navigate(generatePath(AtlasQuizRoute.atlasModelRoute, { slug, uniqueId: mod.uniqueId }))
  }

  if (isLoadingTopic) return <Loading />

  return (
    <PageWrapper>
      <Inner>
        <PageTopBar>
          <PageBrand>
            <PageBrandIcon>🧬</PageBrandIcon>
            <PageBrandText>
              <PageBrandTitle>Atlas 3D &amp; Quiz Anatomi</PageBrandTitle>
              <PageBrandSubtitle>Eksplorasi atlas 3D dan latihan quiz anatomi interaktif.</PageBrandSubtitle>
            </PageBrandText>
          </PageBrand>
          <BackButton onClick={() => navigate(AtlasQuizRoute.moduleRoute)}>
            ← Kembali
          </BackButton>
        </PageTopBar>

        {topic && (
          <TopicCard>
            {topic.classification && (
              <ClassificationLabel>{classificationLabel(topic.classification)}</ClassificationLabel>
            )}
            <TopicRow>
              <TopicIconBox>{topic.icon || '🧠'}</TopicIconBox>
              <div>
                <TopicName>{topic.name}</TopicName>
                {topic.description && <TopicDescription>{topic.description}</TopicDescription>}
              </div>
            </TopicRow>
          </TopicCard>
        )}

        {/* Modules */}
        <ModulesCard>
          <FilterRow>
            <div style={{ flex: 1 }}>
              <TextInput
                placeholder="Cari model 3D pada topik ini..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ width: '200px', flexShrink: 0 }}>
              <Dropdown
                options={moduleOptions.map(m => ({ value: m.name, label: m.name }))}
                onChange={handleModuleFilterChange}
                placeholder="Semua modul"
                isClearable
              />
            </div>
          </FilterRow>

          {isLoadingModules ? (
            <Loading />
          ) : filteredModules.length === 0 ? (
            <EmptyState icon="🧬" title="Belum ada modul" />
          ) : (
            <ModulesGrid>
              {filteredModules.map(mod => (
                <ModuleCard key={mod.uniqueId} onClick={() => handleModuleClick(mod)}>
                  <ModuleCardTop>
                    <ModuleIconBox><PiCube size={18} /></ModuleIconBox>
                    <div>
                      <ModuleTitle>{mod.title}</ModuleTitle>
                      {mod.moduleName && <ModuleSubtitle>{mod.moduleName}</ModuleSubtitle>}
                    </div>
                  </ModuleCardTop>
                  <ModuleCardBottom>
                    <TagRow>
                      {mod.classification && (
                        <ClassificationTag $type={classificationType(mod.classification)}>
                          {classificationLabel(mod.classification)}
                        </ClassificationTag>
                      )}
                      {mod.quizCount > 0 && (
                        <QuizCountTag>⊙ {mod.quizCount} quiz</QuizCountTag>
                      )}
                    </TagRow>
                    <ArrowIcon>→</ArrowIcon>
                  </ModuleCardBottom>
                </ModuleCard>
              ))}
            </ModulesGrid>
          )}

          {!modulesPagination.isLastPage && (
            <Button
              onClick={handleLoadMoreModules}
              disabled={isLoadingModules}
              variant="secondary"
              style={{ margin: '1rem auto 0', display: 'block' }}
            >
              {isLoadingModules ? 'Memuat...' : 'Muat Lebih Banyak'}
            </Button>
          )}
        </ModulesCard>

        {/* Quizzes */}
        <QuizSection>
          <QuizSectionHeader>
            <QuizSectionTitle>
              <PiMedal size={20} /> Quiz 3D Anatomi Terkait
            </QuizSectionTitle>
            <QuizSectionSubtitle>
              Latihan berbasis model 3D — identifikasi struktur langsung pada model, bukan pilihan ganda.
            </QuizSectionSubtitle>
          </QuizSectionHeader>

          <FilterRow>
            <div style={{ flex: 1 }}>
              <TextInput
                placeholder="Cari quiz..."
                value={searchQuiz}
                onChange={e => setSearchQuiz(e.target.value)}
              />
            </div>
            <div style={{ width: '200px', flexShrink: 0 }}>
              <Dropdown
                options={moduleOptions.map(m => ({ value: m.name, label: m.name }))}
                onChange={handleQuizModuleFilterChange}
                placeholder="Semua modul"
                isClearable
              />
            </div>
          </FilterRow>

          {isLoadingQuizzes ? (
            <Loading />
          ) : filteredQuizzes.length === 0 ? (
            <EmptyState icon="📝" title="Belum ada quiz tersedia" />
          ) : (
            <QuizGrid>
              {filteredQuizzes.map(quiz => (
                <QuizCard
                  key={quiz.uniqueId}
                  onClick={() => navigate(generatePath(AtlasQuizRoute.anatomyQuizRoute, { slug, uniqueId: quiz.uniqueId }))}
                >
                  <QuizCardTop>
                    <QuizIconBox><PiMedal size={18} /></QuizIconBox>
                    <div>
                      <QuizTitle>{quiz.title}</QuizTitle>
                      <QuizModuleName>Model: {quiz.module.name}</QuizModuleName>
                    </div>
                  </QuizCardTop>
                  <QuizCardBottom>
                    <TagRow>
                      {quiz.module.classification && (
                        <ClassificationTag $type={classificationType(quiz.module.classification)}>
                          {classificationLabel(quiz.module.classification)}
                        </ClassificationTag>
                      )}
                      {quiz.difficulty && (
                        <DifficultyTag $level={quiz.difficulty}>
                          {DIFFICULTY_LABELS[quiz.difficulty] ?? quiz.difficulty}
                        </DifficultyTag>
                      )}
                      {quiz.questionCount > 0 && (
                        <QuizMeta>{quiz.questionCount} struktur</QuizMeta>
                      )}
                      {quiz.estimatedMinutes > 0 && (
                        <QuizMeta>⏱ {quiz.estimatedMinutes}m</QuizMeta>
                      )}
                    </TagRow>
                    <ArrowIcon>→</ArrowIcon>
                  </QuizCardBottom>
                </QuizCard>
              ))}
            </QuizGrid>
          )}

          {!quizzesPagination.isLastPage && (
            <Button
              onClick={handleLoadMoreQuizzes}
              disabled={isLoadingQuizzes}
              variant="secondary"
              style={{ margin: '1rem auto 0', display: 'block' }}
            >
              {isLoadingQuizzes ? 'Memuat...' : 'Muat Lebih Banyak'}
            </Button>
          )}
        </QuizSection>
      </Inner>
    </PageWrapper>
  )
}

export default TopicDetailPage
