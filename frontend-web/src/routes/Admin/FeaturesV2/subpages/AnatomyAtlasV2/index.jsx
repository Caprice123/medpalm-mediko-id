import Button from '@components/common/Button'
import Breadcrumb from '@components/common/Breadcrumb'
import NodeListPage from './pages/NodeListPage'
import ModuleDetailPage from './pages/ModuleDetailPage'
import SettingsModal from './components/SettingsModal'
import UnlinkedAtlasPage from './pages/UnlinkedAtlasPage'
import UnlinkedAnatomyPage from './pages/UnlinkedAnatomyPage'
import { useAnatomyAtlasV2Admin } from './hooks/useAnatomyAtlasV2Admin'
import { Container, Header, HeaderLeft, Title, PageTitle, ActionGroup } from './AnatomyAtlasV2.styles'

const LAYER_LABELS = { 1: 'Topik', 2: 'Modul' }

export default function AnatomyAtlasV2({ onBack }) {
  const {
    view, path, currentLayer, parentNode, isModuleDetail,
    navigateInto, navigateTo, navigateToRoot,
    handleViewUnlinkedAtlas, handleViewUnlinkedAnatomy, handleViewTree,
    nodeModal, setNodeModal,
    settingsOpen, setSettingsOpen,
  } = useAnatomyAtlasV2Admin()

  if (view === 'unlinkedAtlas') {
    return <UnlinkedAtlasPage onBack={handleViewTree} />
  }

  if (view === 'unlinkedAnatomy') {
    return <UnlinkedAnatomyPage onBack={handleViewTree} />
  }

  const isRoot = path.length === 0

  return (
    <Container>
      {!isRoot && (
        <Breadcrumb
          items={[
            { label: 'Anatomi & Atlas 3D', onClick: navigateToRoot },
            ...path.map((p, i) => ({
              label: p.name,
              onClick: i < path.length - 1 ? () => navigateTo(i + 1) : undefined,
            })),
          ]}
        />
      )}

      <Header>
        <HeaderLeft>
          <Button variant="secondary" onClick={isRoot ? onBack : () => navigateTo(path.length - 1)}>
            ← {isRoot ? 'Fitur' : 'Kembali'}
          </Button>
          <Title>Anatomi &amp; Atlas 3D</Title>
          {!isRoot && <PageTitle>— {isModuleDetail ? path[path.length - 1].name : LAYER_LABELS[currentLayer]}</PageTitle>}
        </HeaderLeft>

        {isRoot && (
          <ActionGroup>
            <Button variant="secondary" onClick={handleViewUnlinkedAtlas}>Atlas Tidak Terhubung</Button>
            <Button variant="secondary" onClick={handleViewUnlinkedAnatomy}>Quiz Tidak Terhubung</Button>
            <Button variant="secondary" onClick={() => setSettingsOpen(true)}>Pengaturan</Button>
            <Button variant="primary" onClick={() => setNodeModal({ open: true, node: null })}>
              + Tambah {LAYER_LABELS[currentLayer]}
            </Button>
          </ActionGroup>
        )}

        {!isRoot && !isModuleDetail && currentLayer <= 2 && (
          <Button variant="primary" onClick={() => setNodeModal({ open: true, node: null })}>
            + Tambah {LAYER_LABELS[currentLayer]}
          </Button>
        )}
      </Header>

      {isModuleDetail ? (
        <ModuleDetailPage module={path[path.length - 1]} />
      ) : (
        <NodeListPage
          currentLayer={currentLayer}
          parentNode={parentNode}
          onNavigateInto={navigateInto}
          nodeModal={nodeModal}
          setNodeModal={setNodeModal}
        />
      )}

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </Container>
  )
}
