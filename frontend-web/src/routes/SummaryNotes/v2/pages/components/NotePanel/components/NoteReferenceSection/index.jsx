import FileUpload from '@components/common/FileUpload'
import Button from '@components/common/Button'
import { SectionRow, SectionLabel, SectionLine } from '../../NotePanel.styles'

export default function NoteReferenceSection({ sourceDocument }) {
  if (!sourceDocument) return null

  return (
    <>
      <SectionRow>
        <SectionLabel>📚 Referensi</SectionLabel>
        <SectionLine />
      </SectionRow>
      <FileUpload
        file={{
          name: sourceDocument.filename,
          type: sourceDocument.contentType,
          size: sourceDocument.byteSize,
        }}
        actions={
          <Button
            variant="primary"
            size="small"
            as="a"
            href={sourceDocument.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Lihat Dokumen
          </Button>
        }
      />
    </>
  )
}
