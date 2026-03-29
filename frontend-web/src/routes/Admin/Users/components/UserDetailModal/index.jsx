import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatLocalDate } from '@utils/dateUtils'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Pagination from '@components/common/Pagination'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './DatePicker.styles.css'
import { formatDate } from '../../../../../utils/dateUtils'
import { fetchUserSubscriptions, fetchUserCreditBuckets, updateUserRole, updateUserPermissions, updateSubscription, deleteSubscription, updateCreditBucket, deleteCreditBucket } from '@store/user/action'
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
  const { loading, detail: user, subscriptions, subscriptionPagination, subscriptionFilter, creditBuckets } = useSelector(state => state.user)
  const [showCreditForm, setShowCreditForm] = useState(false)
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false)
  const [showRoleForm, setShowRoleForm] = useState(false)
  const [showPermissionForm, setShowPermissionForm] = useState(false)
  const [creditAmount, setCreditAmount] = useState('')
  const [creditType, setCreditType] = useState('permanent')
  const [creditExpiryDays, setCreditExpiryDays] = useState('')
  const [creditError, setCreditError] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [roleError, setRoleError] = useState('')
  const [subscriptionData, setSubscriptionData] = useState({
    startDate: null,
    endDate: null
  })
  const [subscriptionError, setSubscriptionError] = useState('')
  const [editingSubscription, setEditingSubscription] = useState(null) // { id, startDate, endDate }
  const [editError, setEditError] = useState('')
  const [creditBucketFilter, setCreditBucketFilter] = useState('all') // 'all' | 'expiring'
  const [editingBucket, setEditingBucket] = useState(null) // { id, balance, expiresAt }
  const [editBucketError, setEditBucketError] = useState('')

  // Fetch subscriptions and credit buckets when modal opens or relevant state changes
  useEffect(() => {
    if (isOpen && user?.id) {
      dispatch(fetchUserSubscriptions(user.id))
      dispatch(fetchUserCreditBuckets(user.id))
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
    setCreditType('permanent')
    setCreditExpiryDays('')
    setCreditError('')
    setSelectedRole(null)
    setRoleError('')
    setSubscriptionData({ startDate: null, endDate: null })
    setSubscriptionError('')
    setEditingSubscription(null)
    setEditError('')
    setEditingBucket(null)
    setEditBucketError('')
    setCreditBucketFilter('all')
    dispatch(actions.setSubscriptionPage(1))
    onClose()
  }

  const handleEditSubscription = (sub) => {
    setEditingSubscription({
      id: sub.id,
      startDate: new Date(sub.startDate),
      endDate: new Date(sub.endDate),
    })
    setEditError('')
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    setEditError('')

    if (!editingSubscription.startDate || !editingSubscription.endDate) {
      setEditError('Both dates are required')
      return
    }
    if (editingSubscription.endDate <= editingSubscription.startDate) {
      setEditError('End date must be after start date')
      return
    }

    dispatch(updateSubscription(
      editingSubscription.id,
      user.id,
      editingSubscription.startDate.toISOString(),
      editingSubscription.endDate.toISOString(),
      () => setEditingSubscription(null)
    ))
  }

  const handleDeleteSubscription = (sub) => {
    if (!window.confirm(`Delete subscription (${formatDate(sub.startDate)} – ${formatDate(sub.endDate)})?`)) return
    dispatch(deleteSubscription(sub.id, user.id))
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

    if (creditType === 'expiring' && amount > 0) {
      const days = parseInt(creditExpiryDays)
      if (!days || days < 1) {
        setCreditError('Please enter a valid expiry duration in days')
        return
      }
    }

    onAdjustCredit(user.id, amount, {
      creditType: amount > 0 ? creditType : 'permanent',
      creditExpiryDays: creditType === 'expiring' && amount > 0 ? parseInt(creditExpiryDays) : null
    })
    setCreditAmount('')
    setCreditType('permanent')
    setCreditExpiryDays('')
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

  const handleEditBucket = (bucket) => {
    setEditingBucket({
      id: bucket.id,
      balance: parseFloat(bucket.balance).toFixed(2),
      expiresAt: bucket.expiresAt ? new Date(bucket.expiresAt) : null
    })
    setEditBucketError('')
  }

  const handleEditBucketSubmit = (e) => {
    e.preventDefault()
    setEditBucketError('')
    const balance = parseFloat(editingBucket.balance)
    if (isNaN(balance) || balance < 0) {
      setEditBucketError('Please enter a valid balance')
      return
    }
    dispatch(updateCreditBucket(user.id, editingBucket.id, {
      balance,
      expiresAt: editingBucket.expiresAt ? editingBucket.expiresAt.toISOString() : null
    }, () => setEditingBucket(null)))
  }

  const handleDeleteBucket = (bucket) => {
    if (!window.confirm(`Delete this credit bucket (${parseFloat(bucket.balance).toFixed(2)} credits)?`)) return
    dispatch(deleteCreditBucket(user.id, bucket.id))
  }

  const roleOptions = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' },
    { label: 'Superadmin', value: 'superadmin' },
    { label: 'Tutor', value: 'tutor' }
  ]

  const isSuperAdmin = currentUser?.role === 'superadmin'

  if (!user) return null

  const permanentBalance = creditBuckets?.permanentBalance ?? 0
  const expiringBuckets = creditBuckets?.expiringBuckets ?? []
  const totalBalance = creditBuckets?.totalBalance ?? 0

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
        <SubscriptionHeader>
          <SectionTitle style={{ margin: 0 }}>Credit Balance</SectionTitle>
          {!showCreditForm && (
            <Button onClick={() => setShowCreditForm(true)} variant="primary" size="small">
              Adjust Credit
            </Button>
          )}
        </SubscriptionHeader>

        {/* Balance summary row */}
        {loading.isFetchCreditBucketsLoading ? (
          <EmptyState>Loading credits...</EmptyState>
        ) : (
          <CreditBalance style={{ marginBottom: '1rem' }}>
            <BalanceDisplay>
              <BalanceLabel>Total Balance</BalanceLabel>
              <BalanceValue value={totalBalance}>
                {parseFloat(totalBalance).toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: 400 }}>credits</span>
              </BalanceValue>
            </BalanceDisplay>
            <BalanceDisplay>
              <BalanceLabel>Permanent</BalanceLabel>
              <BalanceValue value={permanentBalance} style={{ fontSize: '1.25rem' }}>
                {parseFloat(permanentBalance).toFixed(2)}
              </BalanceValue>
            </BalanceDisplay>
            <BalanceDisplay>
              <BalanceLabel>Expiring</BalanceLabel>
              <BalanceValue value={expiringBuckets.reduce((s, b) => s + parseFloat(b.balance), 0)} style={{ fontSize: '1.25rem' }}>
                {parseFloat(expiringBuckets.reduce((s, b) => s + parseFloat(b.balance), 0)).toFixed(2)}
              </BalanceValue>
            </BalanceDisplay>
          </CreditBalance>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e5e7eb', marginBottom: '1.5rem' }}>
          {['all', 'expiring'].map(tab => (
            <button key={tab} onClick={() => setCreditBucketFilter(tab)} style={{
              padding: '0.75rem 1.5rem', background: 'none', border: 'none',
              borderBottom: creditBucketFilter === tab ? '2px solid #3b82f6' : '2px solid transparent',
              color: creditBucketFilter === tab ? '#3b82f6' : '#6b7280',
              fontWeight: creditBucketFilter === tab ? 600 : 400,
              cursor: 'pointer', fontSize: '0.875rem', marginBottom: '-2px', transition: 'all 0.2s'
            }}>
              {tab === 'all' ? 'All Buckets' : 'Expiring Only'}
            </button>
          ))}
        </div>

        {/* Credit buckets table */}
        {expiringBuckets.filter(b => creditBucketFilter === 'all' || !b.isExpired).length > 0 ? (
          <>
            <SubscriptionTable style={{ marginBottom: '1rem' }}>
              <TableRow header $hasActions>
                <div>Credits</div>
                <div>Expires On</div>
                <div>Days Left</div>
                <div>Actions</div>
              </TableRow>
              {expiringBuckets
                .filter(b => creditBucketFilter === 'all' || !b.isExpired)
                .map((bucket) => (
                  <>
                    <TableRow key={bucket.id} $hasActions>
                      <div style={{ fontWeight: 600 }}>{parseFloat(bucket.balance).toFixed(2)}</div>
                      <div style={{ fontSize: '0.8rem' }}>{formatLocalDate(bucket.expiresAt)}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <StatusBadge status={bucket.isExpired ? 'expired' : bucket.daysRemaining <= 7 ? 'expired' : 'active'}>
                          {bucket.isExpired ? 'Expired' : `${bucket.daysRemaining} days`}
                        </StatusBadge>
                        {!bucket.isExpired && bucket.daysRemaining <= 7 && (
                          <span style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 600 }}>Expiring soon</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button variant="outline" size="small"
                          style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => handleEditBucket(bucket)}
                          disabled={loading.isDeleteCreditBucketLoading}>
                          Edit
                        </Button>
                        <Button variant="danger" size="small"
                          style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => handleDeleteBucket(bucket)}
                          disabled={loading.isDeleteCreditBucketLoading}>
                          Delete
                        </Button>
                      </div>
                    </TableRow>

                    {editingBucket?.id === bucket.id && (
                      <TableRow key={`edit-${bucket.id}`} style={{ backgroundColor: '#f0f9ff' }}>
                        <div style={{ gridColumn: '1 / -1', padding: '0.75rem 0' }}>
                          <form onSubmit={handleEditBucketSubmit}>
                            <FormRow>
                              <FormGroup style={{ flex: 1 }}>
                                <Label>Balance</Label>
                                <TextInput
                                  type="number"
                                  value={editingBucket.balance}
                                  onChange={(e) => setEditingBucket({ ...editingBucket, balance: e.target.value })}
                                  step="0.01" min="0"
                                  hasError={!!editBucketError}
                                />
                              </FormGroup>
                              <FormGroup style={{ flex: 1 }}>
                                <Label>Expiry Date</Label>
                                <div className="custom-datepicker-wrapper">
                                  <DatePicker
                                    selected={editingBucket.expiresAt}
                                    onChange={(date) => setEditingBucket({ ...editingBucket, expiresAt: date })}
                                    dateFormat="dd MMM yyyy"
                                    placeholderText="Select expiry date"
                                    dropdownMode="select"
                                    popperPlacement="top"
                                    className={`custom-datepicker-input ${editBucketError ? 'error' : ''}`}
                                  />
                                </div>
                              </FormGroup>
                            </FormRow>
                            {editBucketError && <ErrorText>{editBucketError}</ErrorText>}
                            <FormActions style={{ marginTop: '0.75rem' }}>
                              <Button type="button" size="small"
                                onClick={() => { setEditingBucket(null); setEditBucketError('') }}
                                disabled={loading.isUpdateCreditBucketLoading}>
                                Cancel
                              </Button>
                              <Button type="submit" variant="primary" size="small"
                                disabled={loading.isUpdateCreditBucketLoading}>
                                {loading.isUpdateCreditBucketLoading ? 'Saving...' : 'Save'}
                              </Button>
                            </FormActions>
                          </form>
                        </div>
                      </TableRow>
                    )}
                  </>
                ))}
            </SubscriptionTable>
          </>
        ) : (
          <EmptyState style={{ marginBottom: '1rem' }}>No expiring credit buckets</EmptyState>
        )}

        {showCreditForm && (
          <CreditForm onSubmit={handleCreditSubmit}>
            <FormRow>
              <FormGroup style={{ flex: 1 }}>
                <Label>Credit Amount</Label>
                <TextInput
                  type="number"
                  placeholder="Positive to add, negative to deduct"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  hasError={!!creditError}
                  autoFocus
                />
              </FormGroup>
              <FormGroup style={{ flex: 1 }}>
                <Label>Credit Type</Label>
                <Dropdown
                  options={[
                    { value: 'permanent', label: 'Permanent' },
                    { value: 'expiring', label: 'Expiring' }
                  ]}
                  value={{ value: creditType, label: creditType === 'permanent' ? 'Permanent' : 'Expiring' }}
                  onChange={(opt) => { setCreditType(opt.value); setCreditExpiryDays('') }}
                  placeholder="Select type..."
                />
              </FormGroup>
              {creditType === 'expiring' && (
                <FormGroup style={{ flex: 1 }}>
                  <Label>Expires After (Days)</Label>
                  <TextInput
                    type="number"
                    placeholder="e.g. 30"
                    value={creditExpiryDays}
                    onChange={(e) => setCreditExpiryDays(e.target.value)}
                    min={1}
                  />
                </FormGroup>
              )}
            </FormRow>
            {creditError ? (
              <ErrorText>{creditError}</ErrorText>
            ) : (
              <HintText>
                {creditType === 'expiring'
                  ? 'Expiring credits will be deducted before permanent credits'
                  : 'Permanent credits never expire'}
              </HintText>
            )}
            <FormActions style={{ marginTop: '1rem' }}>
              <Button
                type="button"
                onClick={() => { setShowCreditForm(false); setCreditAmount(''); setCreditType('permanent'); setCreditExpiryDays(''); setCreditError('') }}
                disabled={loading.isAdjustCreditLoading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading.isAdjustCreditLoading}>
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
              <TableRow header $hasActions={isSuperAdmin}>
                <div>Start Date</div>
                <div>End Date</div>
                <div>Status</div>
                <div>Created</div>
                {isSuperAdmin && <div>Actions</div>}
              </TableRow>
              {subscriptions.map((sub, index) => (
                <>
                  <TableRow key={sub.id || index} $hasActions={isSuperAdmin}>
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
                      {formatLocalDate(sub.createdAt)}
                    </div>
                    {isSuperAdmin && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          variant="outline"
                          size="small"
                          style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => handleEditSubscription(sub)}
                          disabled={loading.isDeleteSubscriptionLoading}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => handleDeleteSubscription(sub)}
                          disabled={loading.isDeleteSubscriptionLoading}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </TableRow>

                  {/* Inline edit form for this subscription */}
                  {isSuperAdmin && editingSubscription?.id === sub.id && (
                    <TableRow key={`edit-${sub.id}`} style={{ backgroundColor: '#f0f9ff' }}>
                      <div style={{ gridColumn: '1 / -1', padding: '0.75rem 0' }}>
                        <form onSubmit={handleEditSubmit}>
                          <FormRow>
                            <FormGroup style={{ flex: 1 }}>
                              <Label>Start Date</Label>
                              <div className="custom-datepicker-wrapper">
                                <DatePicker
                                  selected={editingSubscription.startDate}
                                  onChange={(date) => setEditingSubscription({ ...editingSubscription, startDate: date })}
                                  dateFormat="dd MMM yyyy"
                                  placeholderText="Select start date"
                                  dropdownMode="select"
                                  popperPlacement="top"
                                  className={`custom-datepicker-input ${editError ? 'error' : ''}`}
                                />
                              </div>
                            </FormGroup>
                            <FormGroup style={{ flex: 1 }}>
                              <Label>End Date</Label>
                              <div className="custom-datepicker-wrapper">
                                <DatePicker
                                  selected={editingSubscription.endDate}
                                  onChange={(date) => setEditingSubscription({ ...editingSubscription, endDate: date })}
                                  dateFormat="dd MMM yyyy"
                                  placeholderText="Select end date"
                                  minDate={editingSubscription.startDate}
                                  dropdownMode="select"
                                  popperPlacement="top"
                                  className={`custom-datepicker-input ${editError ? 'error' : ''}`}
                                />
                              </div>
                            </FormGroup>
                          </FormRow>
                          {editError && <ErrorText>{editError}</ErrorText>}
                          <FormActions style={{ marginTop: '0.75rem' }}>
                            <Button
                              type="button"
                              size="small"
                              onClick={() => { setEditingSubscription(null); setEditError('') }}
                              disabled={loading.isUpdateSubscriptionLoading}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              variant="primary"
                              size="small"
                              disabled={loading.isUpdateSubscriptionLoading}
                            >
                              {loading.isUpdateSubscriptionLoading ? 'Saving...' : 'Save'}
                            </Button>
                          </FormActions>
                        </form>
                      </div>
                    </TableRow>
                  )}
                </>
              ))}
            </SubscriptionTable>

            {((subscriptionPagination.page === 1 && !subscriptionPagination.isLastPage) || subscriptionPagination.page > 1) && (
              <div style={{ marginTop: '1rem' }}>
                <Pagination
                  currentPage={subscriptionPagination.page}
                  isLastPage={subscriptionPagination.isLastPage}
                  onPageChange={(page) => dispatch(actions.setSubscriptionPage(page))}
                  isLoading={loading.isFetchUserSubscriptionsLoading}
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
