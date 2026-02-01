import { useSelector } from "react-redux"
import Table from "../../../components/common/Table"
import Pagination from '@components/common/Pagination'
import { useUserSection } from "./hooks/useUserSection"
import {
  Container,
  TableContainer,
  EmptyState,
  StatusBadge,
  ActionButtons,
} from './Users.styles'
import { Filter } from "./components/Filter"
import UserDetailModal from "./components/UserDetailModal"
import { actions } from "@store/user/reducer"
import { formatDate } from "../../../utils/dateUtils"
import Button from '@components/common/Button'

function Users() {
  const { users, loading, pagination } = useSelector(state => state.user)
  const {
    uiState,
    useUserDetail,
  } = useUserSection()

  // Helper function to get active subscription
  const getActiveSubscription = (subscriptions) => {
    if (!subscriptions || subscriptions.length === 0) return null
    const now = new Date()
    return subscriptions.find(sub => {
      const start = new Date(sub.startDate)
      const end = new Date(sub.endDate)
      return start <= now && now <= end
    })
  }

  // Table columns
  const columns = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "email",
      header: "Email"
    },
    {
      key: "userCredits",
      header: "Credits",
      align: 'center',
      render: (userCredits) => {
        const balance = userCredits?.balance || 0
        return (
          <span style={{
            fontWeight: 500,
            color: balance > 0 ? '#059669' : '#6b7280'
          }}>
            {balance}
          </span>
        )
      }
    },
    {
      key: "userSubscriptions",
      header: "Subscription",
      align: 'center',
      render: (userSubscriptions) => {
        const activeSub = getActiveSubscription(userSubscriptions)
        if (!activeSub) {
          return (
            <StatusBadge status="inactive">
              No Subscription
            </StatusBadge>
          )
        }
        return (
          <div style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
            <StatusBadge status="active">Active</StatusBadge>
            <div style={{ marginTop: '0.25rem', color: '#6b7280' }}>
              Until {formatDate(activeSub.endDate)}
            </div>
          </div>
        )
      }
    },
    {
      key: "role",
      header: "Role",
      align: 'center',
      render: (role) => (
        <span style={{
          textTransform: 'capitalize',
          fontWeight: 500,
          color: role === 'superadmin' ? '#7c3aed' : role === 'admin' ? '#2563eb' : role === 'tutor' ? '#059669' : '#6b7280',
          fontSize: '0.875rem'
        }}>
          {role || 'user'}
        </span>
      )
    },
    {
      key: "isActive",
      header: "Status",
      align: 'center',
      render: (isActive) => (
        <StatusBadge status={isActive ? 'active' : 'inactive'}>
          {isActive ? "Active" : "Inactive"}
        </StatusBadge>
      )
    },
    {
      key: "",
      header: "Actions",
      align: 'center',
      render: (user) => (
        <ActionButtons>
          <Button variant="primary" onClick={() => useUserDetail.onOpen(user)}>
            Show Detail
          </Button>
        </ActionButtons>
      )
    }
  ]

  return (
    <Container>
      <Filter />

      <TableContainer>
        {loading.isGetUsersLoading ? (
          <Table
            loading={true}
            data={[]}
            columns={columns}
          />
        ) : !users || users.length === 0 ? (
          <EmptyState>
            <h3>No Users Found</h3>
            <p>Try adjusting your filters or check back later</p>
          </EmptyState>
        ) : (
          <>
            <Table
              loading={false}
              emptyText="No users found."
              emptySubtext="Try adjusting your search filters"
              data={users}
              columns={columns}
              hoverable
              striped
            />

            {((pagination.page == 1 && !pagination.isLastPage) || pagination.page > 1) && (
              <Pagination
                currentPage={pagination.page}
                itemsPerPage={pagination.perPage}
                onPageChange={actions.setPage}
              />
            )}
          </>
        )}
      </TableContainer>

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={uiState.isUserDetailModalOpen}
        onClose={useUserDetail.onClose}
        onAdjustCredit={useUserDetail.onAdjustCredit}
        onAddSubscription={useUserDetail.onAddSubscription}
      />
    </Container>
  )
}

export default Users