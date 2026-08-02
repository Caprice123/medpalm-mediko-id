import Button from '@components/common/Button'
import { Header, HeaderLeft } from '../../../../FlashcardV2.styles'
import { Title, Actions } from './TopicListHeader.styles'

export default function TopicListHeader({ onBack, onViewUnlinked, onOpenSettings, onAddTopic }) {
  return (
    <Header>
      <HeaderLeft>
        <Button variant="secondary" onClick={onBack}>← Fitur</Button>
        <Title>Flashcard V2 — Topik</Title>
      </HeaderLeft>
      <Actions>
        <Button variant="secondary" onClick={onViewUnlinked}>Kartu Tidak Terhubung</Button>
        <Button variant="secondary" onClick={onOpenSettings}>Pengaturan</Button>
        <Button variant="primary" onClick={onAddTopic}>+ Tambah Topik</Button>
      </Actions>
    </Header>
  )
}
