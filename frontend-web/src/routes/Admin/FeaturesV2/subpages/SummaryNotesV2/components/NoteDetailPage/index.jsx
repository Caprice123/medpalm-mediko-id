import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSummaryNoteDetail } from '@store/summaryNotes/adminAction'
import Button from '@components/common/Button'
import { useUpdateNote } from '@routes/Admin/Features/subpages/SummaryNotes/hooks/subhooks/useUpdateNote'
import { Container, Header, HeaderLeft, Title } from '../../SummaryNotesV2.styles'
import { TabBar, Tab, TabContent } from './NoteDetailPage.styles'
import DetailTab from './components/DetailTab'
import ContentTab from './components/ContentTab'
import RelatedContentTab from './components/RelatedContentTab'
import FolderTab from './components/FolderTab'

function NoteDetailPage({ note, onBack }) {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('detail')

  const { loading } = useSelector(s => s.summaryNotes)
  const { loading: commonLoading } = useSelector(s => s.common)

  const { form, handleFileSelect, handleGenerate, handleRemoveFile, handleRemoveSourceFile, handleImageUpload } =
    useUpdateNote(() => {})

  useEffect(() => {
    dispatch(fetchSummaryNoteDetail(note.uniqueId))
  }, [note.uniqueId, dispatch])

  const isSaving = loading?.isUpdating
  const isUploading = commonLoading?.isUploading
  const isLoading = loading?.isNoteDetailLoading

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Button variant="secondary" onClick={onBack}>← Kembali</Button>
          <Title>{note.title}</Title>
        </HeaderLeft>
      </Header>

      <TabBar>
        <Tab $active={activeTab === 'detail'} onClick={() => setActiveTab('detail')}>Detail</Tab>
        <Tab $active={activeTab === 'konten'} onClick={() => setActiveTab('konten')}>Konten</Tab>
        <Tab $active={activeTab === 'terkait'} onClick={() => setActiveTab('terkait')}>Konten Terkait</Tab>
        <Tab $active={activeTab === 'folder'} onClick={() => setActiveTab('folder')}>Folder</Tab>
      </TabBar>

      {activeTab === 'detail' && (
        <TabContent>
          <DetailTab form={form} isLoading={isLoading} isSaving={isSaving} />
        </TabContent>
      )}

      {activeTab === 'konten' && (
        <TabContent>
          <ContentTab
            form={form}
            handleFileSelect={handleFileSelect}
            handleGenerate={handleGenerate}
            handleRemoveFile={handleRemoveFile}
            handleRemoveSourceFile={handleRemoveSourceFile}
            handleImageUpload={handleImageUpload}
            isLoading={isLoading}
            isSaving={isSaving}
            isUploading={isUploading}
            loading={loading}
          />
        </TabContent>
      )}

      {activeTab === 'terkait' && (
        <TabContent>
          <RelatedContentTab noteId={note.id} />
        </TabContent>
      )}

      {activeTab === 'folder' && (
        <TabContent>
          <FolderTab note={note} />
        </TabContent>
      )}
    </Container>
  )
}

export default NoteDetailPage
