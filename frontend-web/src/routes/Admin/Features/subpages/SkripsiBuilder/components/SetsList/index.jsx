import { useSelector } from 'react-redux'
import {
  LoadingOverlay,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  SetsGrid,
  SetCard,
  SetHeader,
  SetTitle,
  SetDescription,
  UserInfo,
  UserName,
  UserEmail,
  SetStats,
  StatItem,
  StatLabel,
  StatValue,
  CardActions,
  ViewButton,
  DeleteButton
} from './SetsList.styles'

function SetsList({ onView, onDelete }) {
  const { sets, loading } = useSelector((state) => state.skripsi)

  // Loading state
  if (loading?.isSetsLoading) {
    return <LoadingOverlay>Memuat skripsi sets...</LoadingOverlay>
  }

  // Empty state
  if (sets.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>📚</EmptyStateIcon>
        <EmptyStateText>Belum ada skripsi set</EmptyStateText>
      </EmptyState>
    )
  }

  // Data state - render sets grid
  return (
    <SetsGrid>
      {sets.map(set => (
        <SetCard key={set.id}>
          <SetHeader>
            <SetTitle>{set.title || 'Untitled Set'}</SetTitle>
          </SetHeader>

          {set.description && (
            <SetDescription>{set.description}</SetDescription>
          )}

          {/* User Info */}
          <UserInfo>
            <UserName>{set.user?.name || 'Unknown User'}</UserName>
            <UserEmail>{set.user?.email || 'No email'}</UserEmail>
          </UserInfo>

          <div style={{ flex: "1" }}></div>

          <SetStats>
            <StatItem>
              <StatLabel>Tabs</StatLabel>
              <StatValue>{set.tabCount || 0}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Dibuat</StatLabel>
              <StatValue>
                {new Date(set.created_at).toLocaleDateString("id-ID")}
              </StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Diupdate</StatLabel>
              <StatValue>
                {new Date(set.updated_at).toLocaleDateString("id-ID")}
              </StatValue>
            </StatItem>
          </SetStats>

          <CardActions>
            <ViewButton onClick={() => onView(set)}>
              Lihat Detail
            </ViewButton>
            <DeleteButton onClick={() => onDelete(set)}>
              Hapus
            </DeleteButton>
          </CardActions>
        </SetCard>
      ))}
    </SetsGrid>
  )
}

export default SetsList
