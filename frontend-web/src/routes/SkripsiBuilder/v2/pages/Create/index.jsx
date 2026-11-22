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

        <StepGroup>
          <WorkModePicker workMode={workMode} onSelect={selectWorkMode} />
        </StepGroup>

        <StepGroup>
          <ReportDetailsForm
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
