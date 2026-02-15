import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Pagination from '@components/common/Pagination'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './DatePicker.styles.css'
import { formatDate } from '../../../../../utils/dateUtils'
import { fetchUserSubscriptions, updateUserRole, updateUserPermissions } from '@store/user/action'
import { actions } from '@store/user/reducer'
import { getUserData } from '../../../../../utils/authToken'
import PermissionManager from '../PermissionManager'
import {
  UserSection,
  UserInfo,
  UserInfoRow,
  UserInfoLabel,
  UserInfoValue,
  CreditSection,
  SectionTitle,
  CreditBalance,
  BalanceDisplay,
  BalanceLabel,
  BalanceValue,
  CreditActions,
  CreditForm,
  FormGroup,
  Label,
  ErrorText,
  HintText,
  SubscriptionSection,
  SubscriptionHeader,
  SubscriptionTable,
  TableRow,
  StatusBadge,
  EmptyState,
  SubscriptionForm,
  FormRow,
  FormActions,
  ModalFooter
} from './UserDetailModal.styles'

function UserDetailModal({ isOpen, onClose, onAdjustCredit, onAddSubscription }) {
  const dispatch = useDispatch()
  const currentUser = getUserData()
  const { loading, detail: user, subscriptions, subscriptionPagination, subscriptionFilter } = useSelector(state => state.user)
  const [showCreditForm, setShowCreditForm] = useState(false)
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false)
  const [showRoleForm, setShowRoleForm] = useState(false)
  const [showPermissionForm, setShowPermissionForm] = useState(false)
  const [creditAmount, setCreditAmount] = useState('')
  const [creditError, setCreditError] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [roleError, setRoleError] = useState('')
  const [subscriptionData, setSubscriptionData] = useState({
    startDate: null,
    endDate: null
  })
  const [subscriptionError, setSubscriptionError] = useState('')

  // Fetch subscriptions when modal opens, page changes, or filter changes
  useEffect(() => {
    if (isOpen && user?.id) {
      dispatch(fetchUserSubscriptions(user.id))
    }
  }, [isOpen, user?.id, subscriptionPagination.page, subscriptionFilter, dispatch])

  // Handle tab change
  const handleTabChange = (newFilter) => {
    dispatch(actions.setSubscriptionFilter(newFilter))
  }

  // Reset forms when modal closes
  const handleClose = () => {
    setShowCreditForm(false)
    setShowSubscriptionForm(false)
    setShowRoleForm(false)
    setShowPermissionForm(false)
    setCreditAmount('')
    setCreditError('')
    setSelectedRole(null)
    setRoleError('')
    setSubscriptionData({ startDate: null, endDate: null })
    setSubscriptionError('')
    dispatch(actions.setSubscriptionPage(1))
    onClose()
  }

  // Credit form handlers
  const handleCreditSubmit = (e) => {
    e.preventDefault()
    setCreditError('')

    const amount = parseFloat(creditAmount)
    if (isNaN(amount) || amount === 0) {
      setCreditError('Please enter a valid non-zero number')
      return
    }

    // Call the action
    onAdjustCredit(user.id, amount)
    setCreditAmount('')
    setShowCreditForm(false)
  }

  // Subscription form handlers
  const handleSubscriptionSubmit = (e) => {
    e.preventDefault()
    setSubscriptionError('')

    if (!subscriptionData.startDate) {
      setSubscriptionError('Please select a start date')
      return
    }

    if (!subscriptionData.endDate) {
      setSubscriptionError('Please select an end date')
      return
    }

    if (subscriptionData.endDate <= subscriptionData.startDate) {
      setSubscriptionError('End date must be after start date')
      return
    }

    // Convert Date objects to ISO strings for the API
    const startDateISO = subscriptionData.startDate.toISOString()
    const endDateISO = subscriptionData.endDate.toISOString()

    // Call the action
    onAddSubscription(user.id, startDateISO, endDateISO)
    setSubscriptionData({ startDate: null, endDate: null })
    setShowSubscriptionForm(false)
  }

  // Role form handlers
  const handleRoleSubmit = (e) => {
    e.preventDefault()
    setRoleError('')

    if (!selectedRole) {
      setRoleError('Please select a role')
      return
    }

    // Call the action
    dispatch(updateUserRole(user.id, selectedRole.value, () => {
      setSelectedRole(null)
      setShowRoleForm(false)
    }))
  }

  // Permission form handlers
  const handlePermissionSave = (permissions) => {
    dispatch(updateUserPermissions(user.id, permissions, () => {
      setShowPermissionForm(false)
    }))
  }

  const handlePermissionCancel = () => {
    setShowPermissionForm(false)
  }

  const roleOptions = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' },
    { label: 'Superadmin', value: 'superadmin' },
    { label: 'Tutor', value: 'tutor' }
  ]

  const isSuperAdmin = currentUser?.role === 'superadmin'

  if (!user) return null

  const currentBalance = user.userCredits?.balance || 0

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="User Details"
      size="large"
    >
      {/* User Info Section */}
      <UserSection>
        <SectionTitle>User Information</SectionTitle>
        <UserInfo>
          <UserInfoRow>
            <UserInfoLabel>Name:</UserInfoLabel>
            <UserInfoValue>{user.name || '-'}</UserInfoValue>
          </UserInfoRow>
          <UserInfoRow>
            <UserInfoLabel>Email:</UserInfoLabel>
            <UserInfoValue>{user.email}</UserInfoValue>
          </UserInfoRow>
          <UserInfoRow>
            <UserInfoLabel>Status:</UserInfoLabel>
            <UserInfoValue>
              <StatusBadge status={user.isActive ? 'active' : 'expired'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </StatusBadge>
            </UserInfoValue>
          </UserInfoRow>
          <UserInfoRow>
            <UserInfoLabel>Role:</UserInfoLabel>
            <UserInfoValue style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>
                {user.role || 'user'}
              </span>
              {isSuperAdmin && !showRoleForm && (
                <Button
                  onClick={() => setShowRoleForm(true)}
                  variant="outline"
                  size="small"
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                >
                  Change Role
                </Button>
              )}
            </UserInfoValue>
          </UserInfoRow>
        </UserInfo>

        {showRoleForm && isSuperAdmin && (
          <CreditForm onSubmit={handleRoleSubmit} style={{ marginTop: '1rem' }}>
            <FormGroup>
              <Label>Select New Role</Label>
              <Dropdown
                options={roleOptions}
                value={selectedRole}
                onChange={setSelectedRole}
                placeholder="Select role..."
                hasError={!!roleError}
              />
              {roleError && <ErrorText>{roleError}</ErrorText>}
            </FormGroup>
            <FormActions style={{ marginTop: '1.75rem' }}>
              <Button
                type="button"
                onClick={() => {
                  setShowRoleForm(false)
                  setSelectedRole(null)
                  setRoleError('')
                }}
                disabled={loading.isUpdateUserRoleLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading.isUpdateUserRoleLoading}
              >
                {loading.isUpdateUserRoleLoading ? 'Updating...' : 'Update Role'}
              </Button>
            </FormActions>
          </CreditForm>
        )}

        {/* Permission Management Section - Only for superadmin managing admin users */}
        {isSuperAdmin && user.role === 'admin' && user.id !== currentUser?.id && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                  User Permissions
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  {user.permissions ? 'Custom permissions configured' : 'Using default permissions based on role'}
                </div>
              </div>
              {!showPermissionForm && (
                <Button
                  onClick={() => setShowPermissionForm(true)}
                  variant="outline"
                  size="small"
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                >
                  Manage Permissions
                </Button>
              )}
            </div>

            {showPermissionForm && (
              <PermissionManager
                currentPermissions={user.permissions}
                onSave={handlePermissionSave}
                onCancel={handlePermissionCancel}
                isLoading={loading.isUpdateUserPermissionsLoading}
              />
            )}
          </div>
        )}
      </UserSection>

      {/* Credit Section */}
      <CreditSection>
        <SectionTitle>Credit Balance</SectionTitle>
        <CreditBalance>
          <BalanceDisplay>
            <BalanceLabel>Current Balance</BalanceLabel>
            <BalanceValue value={currentBalance}>
              {currentBalance} <span style={{ fontSize: '1rem', fontWeight: 400 }}>credits</span>
            </BalanceValue>
          </BalanceDisplay>
          {!showCreditForm && (
            <CreditActions>
              <Button
                onClick={() => setShowCreditForm(true)}
                variant="primary"
                size="small"
              >
                Adjust Credit
              </Button>
            </CreditActions>
          )}
        </CreditBalance>

        {showCreditForm && (
          <CreditForm onSubmit={handleCreditSubmit}>
            <FormGroup>
              <Label>Credit Amount</Label>
              <TextInput
                type="number"
                placeholder="Enter amount (positive to add, negative to deduct)"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                hasError={!!creditError}
                autoFocus
              />
              {creditError ? (
                <ErrorText>{creditError}</ErrorText>
              ) : (
                <HintText>Use positive number to add credits, negative to deduct</HintText>
              )}
            </FormGroup>
            <FormActions style={{ marginTop: '1.75rem' }}>
              <Button
                type="button"
                onClick={() => {
                  setShowCreditForm(false)
                  setCreditAmount('')
                  setCreditError('')
                }}
                disabled={loading.isAdjustCreditLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading.isAdjustCreditLoading}
              >
                {loading.isAdjustCreditLoading ? 'Adjusting...' : 'Adjust'}
              </Button>
            </FormActions>
          </CreditForm>
        )}
      </CreditSection>

      {/* Subscription Section */}
      <SubscriptionSection>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid #e5e7eb',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={() => handleTabChange('all')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: subscriptionFilter === 'all' ? '2px solid #3b82f6' : '2px solid transparent',
              color: subscriptionFilter === 'all' ? '#3b82f6' : '#6b7280',
              fontWeight: subscriptionFilter === 'all' ? 600 : 400,
              cursor: 'pointer',
              fontSize: '0.875rem',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            All Subscriptions
          </button>
          <button
            onClick={() => handleTabChange('active')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: subscriptionFilter === 'active' ? '2px solid #3b82f6' : '2px solid transparent',
              color: subscriptionFilter === 'active' ? '#3b82f6' : '#6b7280',
              fontWeight: subscriptionFilter === 'active' ? 600 : 400,
              cursor: 'pointer',
              fontSize: '0.875rem',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            Active Only
          </button>
        </div>

        <SubscriptionHeader>
          <SectionTitle style={{ margin: 0 }}>
            {subscriptionFilter === 'active' ? 'Active Subscriptions' : 'All Subscriptions'}
          </SectionTitle>
          {!showSubscriptionForm && (
            <Button
              onClick={() => setShowSubscriptionForm(true)}
              variant="primary"
              size="small"
            >
              Add Subscription
            </Button>
          )}
        </SubscriptionHeader>

        {showSubscriptionForm && (
          <SubscriptionForm onSubmit={handleSubscriptionSubmit}>
            <FormRow>
              <FormGroup style={{ flex: 1 }}>
                <Label>Start Date</Label>
                <div className="custom-datepicker-wrapper">
                  <DatePicker
                    selected={subscriptionData.startDate}
                    onChange={(date) => setSubscriptionData({ ...subscriptionData, startDate: date })}
                    dateFormat="dd MMM yyyy"
                    placeholderText="Select start date"
                    isClearable
                    dropdownMode="select"
                    popperPlacement="top"
                    className={`custom-datepicker-input ${subscriptionError ? 'error' : ''}`}
                  />
                </div>
              </FormGroup>
              <FormGroup style={{ flex: 1 }}>
                <Label>End Date</Label>
                <div className="custom-datepicker-wrapper">
                  <DatePicker
                    selected={subscriptionData.endDate}
                    onChange={(date) => setSubscriptionData({ ...subscriptionData, endDate: date })}
                    dateFormat="dd MMM yyyy"
                    placeholderText="Select end date"
                    minDate={subscriptionData.startDate}
                    isClearable
                    dropdownMode="select"
                    popperPlacement="top"
                    className={`custom-datepicker-input ${subscriptionError ? 'error' : ''}`}
                  />
                </div>
              </FormGroup>
            </FormRow>
            {subscriptionError ? (
              <ErrorText>{subscriptionError}</ErrorText>
            ) : (
              <HintText>Select the start and end dates for the subscription period</HintText>
            )}
            <FormActions>
              <Button
                type="button"
                onClick={() => {
                  setShowSubscriptionForm(false)
                  setSubscriptionData({ startDate: null, endDate: null })
                  setSubscriptionError('')
                }}
                disabled={loading.isAddSubscriptionLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading.isAddSubscriptionLoading}
              >
                {loading.isAddSubscriptionLoading ? 'Adding...' : 'Add Subscription'}
              </Button>
            </FormActions>
          </SubscriptionForm>
        )}

        {loading.isFetchUserSubscriptionsLoading ? (
          <EmptyState>Loading subscriptions...</EmptyState>
        ) : subscriptions.length === 0 ? (
          <EmptyState>No subscriptions found</EmptyState>
        ) : (
          <>
            <SubscriptionTable>
              <TableRow header>
                <div>Start Date</div>
                <div>End Date</div>
                <div>Status</div>
                <div>Created</div>
              </TableRow>
              {subscriptions.map((sub, index) => (
                <TableRow key={sub.id || index}>
                  <div>{formatDate(sub.startDate)}</div>
                  <div>{formatDate(sub.endDate)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StatusBadge status={sub.status}>
                      {sub.status === 'active' ? 'Active' :
                       sub.status === 'not_active' ? 'Pending' :
                       'Expired'}
                    </StatusBadge>
                    {sub.isCurrentlyActive && (
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#059669',
                        fontWeight: 600,
                        backgroundColor: '#d1fae5',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px'
                      }}>
                        ● Current
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {formatDate(sub.createdAt)}
                  </div>
                </TableRow>
              ))}
            </SubscriptionTable>

            {((subscriptionPagination.page === 1 && !subscriptionPagination.isLastPage) || subscriptionPagination.page > 1) && (
              <div style={{ marginTop: '1rem' }}>
                <Pagination
                  currentPage={subscriptionPagination.page}
                  itemsPerPage={subscriptionPagination.perPage}
                  onPageChange={actions.setSubscriptionPage}
                />
              </div>
            )}
          </>
        )}
      </SubscriptionSection>

      <ModalFooter>
        <Button onClick={handleClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default UserDetailModal
