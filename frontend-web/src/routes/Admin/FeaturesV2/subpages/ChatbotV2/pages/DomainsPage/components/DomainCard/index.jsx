import Button from '@components/common/Button'
import { useDomainCard } from './hooks/useDomainCard'
import {
  DomainCard as Card,
  DomainRow,
  DomainName,
  JournalRow,
  JournalLabel,
  JournalInput,
  FieldError,
} from '../../DomainsPage.styles'

const DomainCard = ({ item, isSaving, onUpdateJournalName, onRemove }) => {
  const { draft, error, handleChange, handleBlur } = useDomainCard({ item, onUpdateJournalName })

  return (
    <Card>
      <DomainRow>
        <DomainName>{item.domain}</DomainName>
        <Button variant="danger" size="small" type="button" onClick={() => onRemove(item)}>
          ✕
        </Button>
      </DomainRow>

      <JournalRow>
        <JournalLabel>Jurnal:</JournalLabel>
        <JournalInput
          placeholder="Nama jurnal (contoh: The Lancet)"
          value={draft}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSaving}
          $invalid={Boolean(error)}
          title="Nama jurnal wajib diisi. Tekan Tab atau klik di luar untuk menyimpan."
        />
      </JournalRow>

      {error && <FieldError>{error}</FieldError>}
    </Card>
  )
}

export default DomainCard
