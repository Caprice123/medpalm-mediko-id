import Button from '@components/common/Button'
import Loading from '@components/common/Loading'
import { useResearchModePage } from './hooks/useResearchModePage'
import { SectionTitle, HintText, EmptyCell } from '../../ChatbotV2.styles'
import {
  OptionList,
  OptionCard,
  OptionTopRow,
  Radio,
  OptionBody,
  OptionLabel,
  OptionMeta,
  ActiveBadge,
  RetrieverTag,
  Actions,
  SavedNote,
} from './ResearchModePage.styles'

const ResearchModePage = () => {
  const {
    options,
    current,
    selected,
    setSelected,
    isDirty,
    isLoading,
    isSaving,
    savedAt,
    handleSave,
  } = useResearchModePage()

  return (
    <>
      <SectionTitle>Implementasi Mode Research</SectionTitle>
      <HintText>
        Menentukan mesin pencarian yang menjawab pesan Mode Research di <strong>Chat Assistant V2</strong>.
        Perubahan langsung berlaku untuk pesan berikutnya, tanpa deploy. Mode Normal dan Validated
        tidak terpengaruh, dan chatbot V1 tetap memakai OpenAlex V3.
      </HintText>

      {isLoading && options.length === 0 ? (
        <Loading />
      ) : options.length === 0 ? (
        <EmptyCell>Daftar implementasi tidak tersedia.</EmptyCell>
      ) : (
        <OptionList>
          {options.map((option) => {
            const isSelected = selected === option.key

            return (
              <OptionCard
                key={option.key}
                type="button"
                $selected={isSelected}
                onClick={() => setSelected(option.key)}
              >
                <Radio $selected={isSelected} />
                <OptionBody>
                  <OptionTopRow>
                    <OptionLabel $selected={isSelected}>{option.label}</OptionLabel>
                    <RetrieverTag>{option.retriever}</RetrieverTag>
                    {current === option.key && <ActiveBadge>Aktif</ActiveBadge>}
                  </OptionTopRow>
                  <OptionMeta>{option.key}</OptionMeta>
                </OptionBody>
              </OptionCard>
            )
          })}
        </OptionList>
      )}

      <Actions>
        <Button variant="primary" onClick={handleSave} disabled={!isDirty || isSaving}>
          {isSaving ? 'Menyimpan...' : 'Simpan'}
        </Button>
        {savedAt && !isDirty && <SavedNote>Tersimpan.</SavedNote>}
      </Actions>
    </>
  )
}

export default ResearchModePage
