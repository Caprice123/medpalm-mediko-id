import { FaPlus, FaTimes } from 'react-icons/fa'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import { useDomainList } from './hooks/useDomainList'
import { AddRow, List, Item, Domain, RemoveButton, EmptyNote } from './DomainList.styles'

// The domains a search is allowed to draw on, added one at a time. A single
// comma-separated box hid typos until the search came back empty; a list shows
// exactly what will be sent, and lets one entry be removed without re-typing
// the rest.
const DomainList = ({ domains, onAdd, onRemove }) => {
  const { draft, setDraft, canAdd, add, handleKeyDown } = useDomainList({ domains, onAdd })

  return (
    <>
      <AddRow>
        <TextInput
          value={draft}
          onChange={setDraft}
          onKeyDown={handleKeyDown}
          placeholder="nejm.org"
          size="small"
        />
        <Button variant="secondary" size="small" onClick={add} disabled={!canAdd}>
          <FaPlus /> Tambah
        </Button>
      </AddRow>

      {domains.length === 0 ? (
        <EmptyNote>Belum ada domain — pencarian akan memakai seluruh web.</EmptyNote>
      ) : (
        <List>
          {domains.map((domain, index) => (
            <Item key={domain}>
              <Domain>{domain}</Domain>
              <RemoveButton
                type="button"
                title={`Hapus ${domain}`}
                aria-label={`Hapus ${domain}`}
                onClick={() => onRemove(index)}
              >
                <FaTimes />
              </RemoveButton>
            </Item>
          ))}
        </List>
      )}
    </>
  )
}

export default DomainList
