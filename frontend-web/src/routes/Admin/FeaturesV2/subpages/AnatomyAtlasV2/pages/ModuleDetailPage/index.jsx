import Button from '@components/common/Button'
import Table from '@components/common/Table'
import AtlasCreateModal from './components/AtlasCreateModal'
import QuizCreateModal from './components/QuizCreateModal'
import MoveContentModal from './components/MoveContentModal'
import ContentSwapOrderModal from './components/ContentSwapOrderModal'
import AtlasQuizLinkModal from './components/AtlasQuizLinkModal'
import QuizAtlasLinkModal from './components/QuizAtlasLinkModal'
import { useModuleDetail } from './hooks/useModuleDetail'
import {
  SectionsContainer, SectionCard, SectionHeader, SectionTitle,
  ActionGroup, Description,
} from './ModuleDetailPage.styles'

export default function ModuleDetailPage({ module }) {
  const {
    models, atlasPagination, atlasLoading,
    quizzes, quizPagination, quizLoading,
    atlasModal, setAtlasModal,
    quizModal, setQuizModal,
    atlasEditModal, setAtlasEditModal,
    atlasMoveModal, setAtlasMoveModal,
    quizEditModal, setQuizEditModal,
    quizMoveModal, setQuizMoveModal,
    atlasOrderModal, setAtlasOrderModal,
    atlasQuizLinkModal, setAtlasQuizLinkModal,
    quizOrderModal, setQuizOrderModal,
    quizAtlasLinkModal, setQuizAtlasLinkModal,
    handleUnlinkAtlas, handleUnlinkQuiz,
    handleAtlasSuccess, handleQuizSuccess,
    handleAtlasEditSuccess, handleQuizEditSuccess,
    handleAtlasMoveConfirm, handleAtlasMoveSuccess,
    handleQuizMoveConfirm, handleQuizMoveSuccess,
    handleAtlasLoadMore, handleQuizLoadMore,
    handleAtlasSwap, handleQuizSwap,
  } = useModuleDetail(module.id)

  const atlasColumns = [
    { header: 'Judul', render: n => <span style={{ fontWeight: 600, color: '#111827' }}>{n.title}</span> },
    { header: 'Deskripsi', render: n => <Description>{n.description || '—'}</Description> },
    { header: 'Versi', width: '70px', render: n => `v${n.version ?? 1}` },
    {
      header: 'Aksi', width: '320px', align: 'right',
      render: n => (
        <ActionGroup>
          <Button size="small" variant="secondary" onClick={() => setAtlasOrderModal({ open: true, item: n })}>Tukar Posisi</Button>
          <Button size="small" variant="secondary" onClick={() => setAtlasQuizLinkModal({ open: true, item: n })}>Link Quiz</Button>
          <Button size="small" variant="secondary" onClick={() => setAtlasMoveModal({ open: true, item: n })}>Pindah</Button>
          <Button size="small" onClick={() => setAtlasEditModal({ open: true, item: n })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleUnlinkAtlas(n)}>Lepas</Button>
        </ActionGroup>
      ),
    },
  ]

  const quizColumns = [
    { header: 'Judul', render: n => <span style={{ fontWeight: 600, color: '#111827' }}>{n.title}</span> },
    { header: 'Deskripsi', render: n => <Description>{n.description || '—'}</Description> },
    { header: 'Versi', width: '70px', render: n => `v${n.version ?? 1}` },
    {
      header: 'Aksi', width: '320px', align: 'right',
      render: n => (
        <ActionGroup>
          <Button size="small" variant="secondary" onClick={() => setQuizOrderModal({ open: true, item: n })}>Tukar Posisi</Button>
          <Button size="small" variant="secondary" onClick={() => setQuizAtlasLinkModal({ open: true, item: n })}>Link Atlas</Button>
          <Button size="small" variant="secondary" onClick={() => setQuizMoveModal({ open: true, item: n })}>Pindah</Button>
          <Button size="small" onClick={() => setQuizEditModal({ open: true, item: n })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleUnlinkQuiz(n)}>Lepas</Button>
        </ActionGroup>
      ),
    },
  ]

  return (
    <SectionsContainer>
      <SectionCard>
        <SectionHeader>
          <SectionTitle>Atlas 3D</SectionTitle>
          <Button variant="primary" size="small" onClick={() => setAtlasModal(true)}>
            + Tambah Atlas 3D
          </Button>
        </SectionHeader>
        <Table
          columns={atlasColumns}
          data={models}
          loading={atlasLoading.isFetchingModels}
          emptyText="Belum ada model Atlas 3D di modul ini"
          emptySubtext='Klik "+ Tambah Atlas 3D" untuk menambahkan konten.'
        />
        {!atlasPagination.isLastPage && (
          <Button
            variant="secondary"
            onClick={handleAtlasLoadMore}
            disabled={atlasLoading.isFetchingModels}
            style={{ margin: '0.75rem auto 0', display: 'block' }}
          >
            {atlasLoading.isFetchingModels ? 'Memuat...' : 'Muat Lebih Banyak'}
          </Button>
        )}
      </SectionCard>

      <SectionCard>
        <SectionHeader>
          <SectionTitle>Quiz Anatomi</SectionTitle>
          <Button variant="primary" size="small" onClick={() => setQuizModal(true)}>
            + Tambah Quiz Anatomi
          </Button>
        </SectionHeader>
        <Table
          columns={quizColumns}
          data={quizzes}
          loading={quizLoading.isFetchingQuizzes}
          emptyText="Belum ada Quiz Anatomi di modul ini"
          emptySubtext='Klik "+ Tambah Quiz Anatomi" untuk menambahkan konten.'
        />
        {!quizPagination.isLastPage && (
          <Button
            variant="secondary"
            onClick={handleQuizLoadMore}
            disabled={quizLoading.isFetchingQuizzes}
            style={{ margin: '0.75rem auto 0', display: 'block' }}
          >
            {quizLoading.isFetchingQuizzes ? 'Memuat...' : 'Muat Lebih Banyak'}
          </Button>
        )}
      </SectionCard>

      {atlasModal && (
        <AtlasCreateModal
          nodeId={module.id}
          onSuccess={handleAtlasSuccess}
          onClose={() => setAtlasModal(false)}
        />
      )}
      {quizModal && (
        <QuizCreateModal
          nodeId={module.id}
          onSuccess={handleQuizSuccess}
          onClose={() => setQuizModal(false)}
        />
      )}

      {atlasEditModal.open && (
        <AtlasCreateModal
          atlas={atlasEditModal.item}
          nodeId={module.id}
          onSuccess={handleAtlasEditSuccess}
          onClose={() => setAtlasEditModal({ open: false, item: null })}
        />
      )}
      {atlasMoveModal.open && (
        <MoveContentModal
          currentNodeId={module.id}
          title="Pindah Atlas 3D"
          nodeTypeFilter="module"
          onMove={handleAtlasMoveConfirm}
          onClose={() => setAtlasMoveModal({ open: false, item: null })}
          onSuccess={handleAtlasMoveSuccess}
          isSaving={atlasLoading.isMovingModel}
        />
      )}
      {atlasOrderModal.open && (
        <ContentSwapOrderModal
          title={`Tukar Posisi — ${atlasOrderModal.item.title}`}
          options={models.filter(m => m.id !== atlasOrderModal.item.id).map(m => ({ value: m.id, label: m.title }))}
          onSwap={handleAtlasSwap}
          isSwapping={atlasLoading.isSwappingOrder}
          onClose={() => setAtlasOrderModal({ open: false, item: null })}
        />
      )}
      {atlasQuizLinkModal.open && (
        <AtlasQuizLinkModal
          atlas={atlasQuizLinkModal.item}
          onClose={() => setAtlasQuizLinkModal({ open: false, item: null })}
        />
      )}
      {quizOrderModal.open && (
        <ContentSwapOrderModal
          title={`Tukar Posisi — ${quizOrderModal.item.title}`}
          options={quizzes.filter(q => q.id !== quizOrderModal.item.id).map(q => ({ value: q.id, label: q.title }))}
          onSwap={handleQuizSwap}
          isSwapping={quizLoading.isSwappingOrder}
          onClose={() => setQuizOrderModal({ open: false, item: null })}
        />
      )}
      {quizAtlasLinkModal.open && (
        <QuizAtlasLinkModal
          quiz={quizAtlasLinkModal.item}
          onClose={() => setQuizAtlasLinkModal({ open: false, item: null })}
        />
      )}

      {quizEditModal.open && (
        <QuizCreateModal
          quiz={quizEditModal.item}
          nodeId={module.id}
          onSuccess={handleQuizEditSuccess}
          onClose={() => setQuizEditModal({ open: false, item: null })}
        />
      )}
      {quizMoveModal.open && (
        <MoveContentModal
          currentNodeId={module.id}
          title="Pindah Quiz Anatomi"
          nodeTypeFilter="module"
          onMove={handleQuizMoveConfirm}
          onClose={() => setQuizMoveModal({ open: false, item: null })}
          onSuccess={handleQuizMoveSuccess}
          isSaving={quizLoading.isMovingQuiz}
        />
      )}
    </SectionsContainer>
  )
}
