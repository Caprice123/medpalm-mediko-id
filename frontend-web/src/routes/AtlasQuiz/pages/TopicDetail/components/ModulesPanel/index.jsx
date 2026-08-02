import { PiClock, PiCube } from 'react-icons/pi'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import ClassificationIcon from '../ClassificationIcon'
import { classificationLabel, classificationType } from '../../utils/classification'
import { FilterRow, TagRow, ClassificationTag, ArrowIcon } from '../../TopicDetail.styles'
import { useModulesPanel } from './hooks/useModulesPanel'
import {
  BackButton,
  TopicSection, ClassificationLabel, TopicRow, TopicIconBox, TopicName, TopicDescription,
  ModulesCard,
  ModulesGrid, ModuleCard, ModuleCardTop, ModuleIconBox, ModuleTitle, ModuleSubtitle, ModuleCardDivider, ModuleCardBottom,
  QuizCountTag,
} from './ModulesPanel.styles'

export default function ModulesPanel({
  topic, modules, modulesPagination, moduleOptions,
  isLoadingModules, onModuleFilterChange, onLoadMoreModules,
  onModuleClick, onBack,
}) {
  const { search, setSearch, filteredModules } = useModulesPanel(modules)

  return (
    <ModulesCard>
      {topic && (
        <TopicSection>
          <div>
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
          </div>
          <BackButton onClick={onBack}>
            ← Kembali
          </BackButton>
        </TopicSection>
      )}

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
            onChange={onModuleFilterChange}
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
            <ModuleCard key={mod.uniqueId} onClick={() => onModuleClick(mod)}>
              <ModuleCardTop>
                <ModuleIconBox><PiCube size={18} /></ModuleIconBox>
                <div>
                  <ModuleTitle>{mod.title}</ModuleTitle>
                  {mod.moduleName && <ModuleSubtitle>{mod.moduleName}</ModuleSubtitle>}
                </div>
              </ModuleCardTop>
              <ModuleCardDivider />
              <ModuleCardBottom>
                <TagRow>
                  {mod.classification && (
                    <ClassificationTag $type={classificationType(mod.classification)}>
                      <ClassificationIcon type={classificationType(mod.classification)} /> {classificationLabel(mod.classification)}
                    </ClassificationTag>
                  )}
                  {mod.quizCount > 0 && (
                    <QuizCountTag><PiClock size={11} /> {mod.quizCount} quiz</QuizCountTag>
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
          onClick={onLoadMoreModules}
          disabled={isLoadingModules}
          variant="secondary"
          style={{ margin: '1rem auto 0', display: 'block' }}
        >
          {isLoadingModules ? 'Memuat...' : 'Muat Lebih Banyak'}
        </Button>
      )}
    </ModulesCard>
  )
}
