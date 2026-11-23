import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import TemplatePicker from './components/TemplatePicker'
import WorkModePicker from './components/WorkModePicker'
import ReportDetailsForm from './components/ReportDetailsForm'
import { useCreateReport } from './hooks/useCreateReport'
import { Page, Content, Title, Subtitle, StepGroup, Footer } from './Create.styles'

// V2 replaces V1's "judul + deskripsi" modal: a report is created from a
// template, carrying the PBL case and the group it belongs to, and the outline
// that template holds is what the editor opens on.
const SkripsiCreate = () => {
  const {
    selectedTemplate,
    selectTemplate,
    isTemplateChosen,
    restRef,
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
    canSubmit,
    handleSubmit,
    handleCancel,
  } = useCreateReport()

  const isCreating = useSelector(state => state.skripsiV2.loading.isCreatingSet)

  return (
    <Page>
      <Content>
        <Title>Buat laporan PBL baru</Title>
        <Subtitle>Pilih template siap pakai atau susun strukturmu sendiri.</Subtitle>

        <StepGroup>
          <TemplatePicker
            selectedTemplate={selectedTemplate}
            onSelect={selectTemplate}
            onDeleteOwn={removeOwnTemplate}
          />
        </StepGroup>

        {/* Everything after the template is dimmed and out of the tab order
            until one is picked. The steps stay on the page rather than being
            hidden, so the student can see what they are committing to; only
            step 1 is required, so one gate covers both. */}
        <StepGroup ref={restRef} $locked={!isTemplateChosen} inert={!isTemplateChosen}>
          <WorkModePicker workMode={workMode} onSelect={selectWorkMode} locked={!isTemplateChosen} />
        </StepGroup>

        <StepGroup $locked={!isTemplateChosen} inert={!isTemplateChosen}>
          <ReportDetailsForm
            locked={!isTemplateChosen}
            form={form}
            onTitleChange={setTitle}
            onCaseTextChange={setCaseText}
            members={members}
            onMemberChange={setMemberField}
            onAddMember={addMember}
            onRemoveMember={removeMember}
          />
        </StepGroup>

        <Footer>
          <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit || isCreating}>
            {isCreating ? 'Membuat...' : 'Mulai edit →'}
          </Button>
          <Button variant="secondary" onClick={handleCancel} disabled={isCreating}>
            Batal
          </Button>
        </Footer>
      </Content>
    </Page>
  )
}

export default SkripsiCreate
