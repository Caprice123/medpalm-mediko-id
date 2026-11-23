import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import StepNav from './components/StepNav'
import TemplatePicker from './components/TemplatePicker'
import WorkModePicker from './components/WorkModePicker'
import ReportDetailsForm from './components/ReportDetailsForm'
import { useCreateReport } from './hooks/useCreateReport'
import { Page, Content, Title, Subtitle, Footer, FooterSpacer } from './Create.styles'

// V2 replaces V1's "judul + deskripsi" modal: a report is created from a
// template, carrying the PBL case and the group it belongs to, and the outline
// that template holds is what the editor opens on.
//
// Two steps. Choosing the template is its own screen because the catalogue is
// searched and paged and has no upper bound; everything after it is optional
// and fits one form, so it shares the second.
const SkripsiCreate = () => {
  const {
    stepIndex,
    goNext,
    goBack,
    selectedTemplate,
    selectTemplate,
    removeOwnTemplate,
    workMode,
    selectWorkMode,
    form,
    setTitle,
    setCaseText,
    members,
    setMemberField,
    addMember,
    removeMember,
    handleSubmit,
    handleCancel,
  } = useCreateReport()

  const isCreating = useSelector(state => state.skripsiV2.loading.isCreatingSet)
  const isTemplateStep = stepIndex === 0

  return (
    <Page>
      <Content>
        <Title>Buat laporan PBL baru</Title>
        <Subtitle>
          {isTemplateStep
            ? 'Pilih template siap pakai atau susun strukturmu sendiri.'
            : 'Semua di bawah ini opsional — bisa dilengkapi dari editor nanti.'}
        </Subtitle>

        <StepNav stepIndex={stepIndex} onStepClick={goBack} />

        {isTemplateStep ? (
          <TemplatePicker
            selectedTemplate={selectedTemplate}
            onSelect={selectTemplate}
            onDeleteOwn={removeOwnTemplate}
          />
        ) : (
          <>
            <WorkModePicker workMode={workMode} onSelect={selectWorkMode} />

            <ReportDetailsForm
              form={form}
              onTitleChange={setTitle}
              onCaseTextChange={setCaseText}
              members={members}
              onMemberChange={setMemberField}
              onAddMember={addMember}
              onRemoveMember={removeMember}
            />
          </>
        )}

        <Footer>
          {isTemplateStep ? (
            <>
              <Button variant="secondary" onClick={handleCancel}>Batal</Button>
              <FooterSpacer />
              <Button variant="primary" onClick={goNext}>Lanjut →</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={goBack} disabled={isCreating}>
                ← Kembali
              </Button>
              <FooterSpacer />
              <Button variant="primary" onClick={handleSubmit} disabled={isCreating}>
                {isCreating ? 'Membuat...' : 'Mulai edit →'}
              </Button>
            </>
          )}
        </Footer>
      </Content>
    </Page>
  )
}

export default SkripsiCreate
