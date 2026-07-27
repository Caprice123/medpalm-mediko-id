import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminSummaryNoteDetailV2 } from '@store/summaryNotes/v2/adminAction'
import Button from '@components/common/Button'
import { useUpdateNoteV2 } from '../../hooks/useUpdateNoteV2'
import { Container, Header, HeaderLeft, Title } from '../../SummaryNotesV2.styles'
import { TabBar, Tab, TabContent } from './NoteDetailPage.styles'
import DetailTab from './components/DetailTab'
import RelatedContentTab from './components/RelatedContentTab'

function NoteDetailPage({ note, onBack }) {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('edit')

  const { loading } = useSelector(s => s.summaryNotesV2)
  const { loading: commonLoading } = useSelector(s => s.common)

  const { form, handleFileSelect, handleGenerate, handleRemoveFile, handleRemoveSourceFile, handleImageUpload } =
    useUpdateNoteV2(() => dispatch(fetchAdminSummaryNoteDetailV2(note.uniqueId)))

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Button variant="secondary" onClick={onBack}>← Kembali</Button>
          <Title>{note.title}</Title>
        </HeaderLeft>
      </Header>

      <TabBar>
        <Tab $active={activeTab === 'edit'} onClick={() => setActiveTab('edit')}>Edit</Tab>
        <Tab $active={activeTab === 'terkait'} onClick={() => setActiveTab('terkait')}>Konten Terkait</Tab>
      </TabBar>

      {activeTab === 'edit' && (
        <TabContent>
          <DetailTab
            form={form}
            handleFileSelect={handleFileSelect}
            handleGenerate={handleGenerate}
            handleRemoveFile={handleRemoveFile}
            handleRemoveSourceFile={handleRemoveSourceFile}
            handleImageUpload={handleImageUpload}
            isLoading={loading?.isNoteDetailLoading}
            isSaving={loading?.isUpdating}
            isUploading={commonLoading?.isUploading}
            loading={loading}
          />
        </TabContent>
      )}

      {activeTab === 'terkait' && (
        <TabContent>
          <RelatedContentTab noteId={note.id} />
        </TabContent>
      )}
    </Container>
  )
}

export default NoteDetailPage
