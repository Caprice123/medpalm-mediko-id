import { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaPlus } from 'react-icons/fa'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import LoadMore from '@components/common/LoadMore'
import ConfirmationModal from '@components/common/ConfirmationModal'
import TemplateFilter from './components/TemplateFilter'
import TemplateFormModal from './components/TemplateFormModal'
import { useTemplatesPage } from './hooks/useTemplatesPage'
import {
  Header, Heading, Title, Hint, SectionChips, ActionGroup, LoadMoreRow,
} from './TemplatesPage.styles'

// The outlines a new PBL report can be started from. A student's own saved
// templates are not listed here — those belong to them, not to the admin.
const TemplatesPage = () => {
  const {
    handleLoadMore,
    pendingDeletion,
    requestDeletion,
    cancelDeletion,
    confirmDeletion,
  } = useTemplatesPage()

  // Modal visibility is the one piece of state that stays local by convention.
  // `null` is closed, `false` is "open, creating", a row is "open, editing".
  const [editing, setEditing] = useState(null)

  const templates = useSelector(state => state.skripsiV2.adminTemplates)
  const pagination = useSelector(state => state.skripsiV2.adminTemplatesPagination)
  const isFetching = useSelector(state => state.skripsiV2.loading.isFetchingAdminTemplates)
  const isDeleting = useSelector(state => state.skripsiV2.loading.isDeletingTemplate)

  // `Table` hands `render` the value at `column.key` — the whole row only when
  // the column has no key at all. A column that needs the row therefore does
  // not declare one, which is how every other admin table here is written.
  const columns = [
    { key: 'name', header: 'Nama' },
    {
      key: 'description',
      header: 'Deskripsi',
      render: (description) => description || '—',
    },
    {
      key: 'sectionCount',
      header: 'Bagian',
      // The listing carries a count rather than every heading of every
      // template; the headings themselves are read when the form opens.
      render: (sectionCount) => (
        <SectionChips>
          {sectionCount ? `${sectionCount} bagian` : '—'}
        </SectionChips>
      ),
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (template) => (
        <ActionGroup>
          <Button variant="secondary" size="small" onClick={() => setEditing(template)}>
            Ubah
          </Button>
          <Button variant="danger" size="small" onClick={() => requestDeletion(template)}>
            Hapus
          </Button>
        </ActionGroup>
      ),
    },
  ]

  return (
    <>
      <Header>
        <Heading>
          <Title>Template Laporan</Title>
          <Hint>
            Struktur bagian yang dipakai mahasiswa saat membuat laporan PBL baru. Mengubah
            template tidak mengubah laporan yang sudah dibuat.
          </Hint>
        </Heading>

        <Button variant="primary" onClick={() => setEditing(false)}>
          <FaPlus /> Tambah Template
        </Button>
      </Header>

      <TemplateFilter />

      <Table
        columns={columns}
        data={templates}
        loading={isFetching && templates.length === 0}
        emptyText="Belum ada template"
        emptySubtext="Tambahkan template agar mahasiswa punya pilihan struktur laporan."
      />

      <LoadMoreRow>
        <LoadMore
          isLastPage={pagination.isLastPage}
          isLoading={isFetching}
          itemCount={templates.length}
          onClick={handleLoadMore}
        />
      </LoadMoreRow>

      <TemplateFormModal
        isOpen={editing !== null}
        template={editing || null}
        onClose={() => setEditing(null)}
      />

      <ConfirmationModal
        isOpen={Boolean(pendingDeletion)}
        title="Hapus template"
        message={`Template "${pendingDeletion?.name || ''}" akan dihapus. Laporan yang sudah dibuat dari template ini tidak terpengaruh.`}
        icon="🗑️"
        confirmText={isDeleting ? 'Menghapus...' : 'Ya, hapus'}
        cancelText="Batalkan"
        onConfirm={confirmDeletion}
        onCancel={cancelDeletion}
      />
    </>
  )
}

export default TemplatesPage
