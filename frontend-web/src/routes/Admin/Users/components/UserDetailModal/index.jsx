import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatLocalDate } from '@utils/dateUtils'
import Modal from '@components/common/Modal'
import Pagination from '@components/common/Pagination'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './DatePicker.styles.css'
import { formatDate } from '../../../../../utils/dateUtils'
import { fetchUserCreditBuckets, updateUserRole, updateUserPermissions, updateCreditBucket, deleteCreditBucket, fetchUserFeatureSubscriptions, addUserFeatureSubscription, updateUserFeatureSubscriptionById, deleteUserFeatureSubscriptionById } from '@store/user/action'
import { fetchAdminFeatures } from '@store/feature/action'
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

function UserDetailModal({ isOpen, onClose, onAdjustCredit }) {
  const dispatch = useDispatch()
  const currentUser = getUserData()
  const { loading, detail: user, creditBuckets, featureSubscriptions, featureSubscriptionPagination } = useSelector(state => state.user)
  console.log(featureSubscriptions)
  const appFeatures = useSelector(state => state.feature.features)
  const [showCreditForm, setShowCreditForm] = useState(false)
  const [showRoleForm, setShowRoleForm] = useState(false)
  const [showPermissionForm, setShowPermissionForm] = useState(false)
  const [creditAmount, setCreditAmount] = useState('')
  const [creditType, setCreditType] = useState('permanent')
  const [creditExpiryDays, setCreditExpiryDays] = useState('')
  const [creditError, setCreditError] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [roleError, setRoleError] = useState('')
  const [creditBucketFilter, setCreditBucketFilter] = useState('all') // 'all' | 'expiring'
  const [editingBucket, setEditingBucket] = useState(null) // { id, balance, expiresAt }
  const [editBucketError, setEditBucketError] = useState('')
  const [editingFeatureSub, setEditingFeatureSub] = useState(null) // { id, feature, startDate, endDate }
  const [editFeatureError, setEditFeatureError] = useState('')
  const [showAddFeatureForm, setShowAddFeatureForm] = useState(false)
  const [addFeatureData, setAddFeatureData] = useState({ feature: null, startDate: null, endDate: null })
  const [addFeatureError, setAddFeatureError] = useState('')
  const [featureTabFilter, setFeatureTabFilter] = useState(null)

  // On open: fetch credit buckets, ensure features are loaded, then fetch the first tab's subscriptions
  useEffect(() => {
    if (isOpen && user?.id) {
      dispatch(fetchUserCreditBuckets(user.id))
      if (appFeatures.length === 0) {
        dispatch(fetchAdminFeatures())
      } else {
        const firstTab = appFeatures[0].sessionType
        setFeatureTabFilter(firstTab)
        dispatch(fetchUserFeatureSubscriptions(user.id, firstTab))
      }
    }
  }, [isOpen, user?.id, dispatch])

  // If features were not yet loaded when modal opened, fetch the first tab once they arrive
  useEffect(() => {
    if (isOpen && user?.id && appFeatures.length > 0 && !featureTabFilter) {
      const firstTab = appFeatures[0].sessionType
      setFeatureTabFilter(firstTab)
      dispatch(fetchUserFeatureSubscriptions(user.id, firstTab))
    }
  }, [appFeatures])

  // Reset forms when modal closes
  const handleClose = () => {
    setShowCreditForm(false)
    setShowRoleForm(false)
    setShowPermissionForm(false)
    setCreditAmount('')
    setCreditType('permanent')
    setCreditExpiryDays('')
    setCreditError('')
    setSelectedRole(null)
    setRoleError('')
    setEditingBucket(null)
    setEditBucketError('')
    setCreditBucketFilter('all')
    setEditingFeatureSub(null)
    setEditFeatureError('')
    setShowAddFeatureForm(false)
    setAddFeatureData({ feature: null, startDate: null, endDate: null })
    setAddFeatureError('')
    setFeatureTabFilter(null)
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

  const featureLabels = Object.fromEntries(appFeatures.map(f => [f.sessionType, f.name]))
  const featureOptions = appFeatures.map(f => ({ value: f.sessionType, label: f.name }))

  const handleEditFeatureSub = (sub) => {
    setEditingFeatureSub({
      id: sub.id,
      feature: sub.feature,
      startDate: sub.startDate ? new Date(sub.startDate) : null,
      endDate: sub.endDate ? new Date(sub.endDate) : null,
    })
    setEditFeatureError('')
  }

  const handleEditFeatureSubmit = (e) => {
    e.preventDefault()
    setEditFeatureError('')
    if (!editingFeatureSub.startDate) {
      setEditFeatureError('Start date is required')
      return
    }
    if (!editingFeatureSub.endDate) {
      setEditFeatureError('End date is required')
      return
    }
    if (editingFeatureSub.endDate <= editingFeatureSub.startDate) {
      setEditFeatureError('End date must be after start date')
      return
    }
    dispatch(updateUserFeatureSubscriptionById(
      user.id,
      editingFeatureSub.id,
      {
        startDate: editingFeatureSub.startDate.toISOString(),
        endDate: editingFeatureSub.endDate.toISOString(),
      },
      editingFeatureSub.feature,
      () => setEditingFeatureSub(null)
    ))
  }

  const handleDeleteFeatureSub = (id, feature) => {
    if (!window.confirm(`Remove ${featureLabels[feature] || feature} access for this user?`)) return
    dispatch(deleteUserFeatureSubscriptionById(user.id, id, feature))
  }

  const handleAddFeatureSubmit = (e) => {
    e.preventDefault()
    setAddFeatureError('')
    if (!addFeatureData.feature) {
      setAddFeatureError('Please select a feature')
      return
    }
    if (!addFeatureData.startDate) {
      setAddFeatureError('Please select a start date')
      return
    }
    if (!addFeatureData.endDate) {
      setAddFeatureError('Please select an end date')
      return
    }
    if (addFeatureData.endDate <= addFeatureData.startDate) {
      setAddFeatureError('End date must be after start date')
      return
    }
    dispatch(addUserFeatureSubscription(
      user.id,
      {
        feature: addFeatureData.feature,
        startDate: addFeatureData.startDate.toISOString(),
        endDate: addFeatureData.endDate.toISOString(),
      },
      () => {
        setShowAddFeatureForm(false)
        setAddFeatureData({ feature: null, startDate: null, endDate: null })
      }
    ))
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

      {/* Feature Subscriptions Section */}
        <SubscriptionSection>
          <SubscriptionHeader>
            <SectionTitle style={{ margin: 0 }}>Feature Access</SectionTitle>
            {!showAddFeatureForm && (
              <Button onClick={() => setShowAddFeatureForm(true)} variant="primary" size="small">
                Add Feature Access
              </Button>
            )}
          </SubscriptionHeader>

          {showAddFeatureForm && (
            <SubscriptionForm onSubmit={handleAddFeatureSubmit}>
              <FormRow style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <FormGroup>
                  <Label>Feature</Label>
                  <Dropdown
                    options={featureOptions}
                    value={featureOptions.find(o => o.value === addFeatureData.feature) || null}
                    onChange={(opt) => setAddFeatureData({ ...addFeatureData, feature: opt.value })}
                    placeholder="Select feature..."
                    hasError={!!addFeatureError && !addFeatureData.feature}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Start Date</Label>
                  <div className="custom-datepicker-wrapper">
                    <DatePicker
                      selected={addFeatureData.startDate}
                      onChange={(date) => setAddFeatureData({ ...addFeatureData, startDate: date })}
                      dateFormat="dd MMM yyyy"
                      placeholderText="Select start date"
                      dropdownMode="select"
                      popperPlacement="top"
                      className={`custom-datepicker-input ${addFeatureError ? 'error' : ''}`}
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label>End Date</Label>
                  <div className="custom-datepicker-wrapper">
                    <DatePicker
                      selected={addFeatureData.endDate}
                      onChange={(date) => setAddFeatureData({ ...addFeatureData, endDate: date })}
                      dateFormat="dd MMM yyyy"
                      placeholderText="Select end date"
                      minDate={addFeatureData.startDate}
                      dropdownMode="select"
                      popperPlacement="top"
                      className={`custom-datepicker-input ${addFeatureError ? 'error' : ''}`}
                    />
                  </div>
                </FormGroup>
              </FormRow>
              {addFeatureError && <ErrorText>{addFeatureError}</ErrorText>}
              <FormActions>
                <Button
                  type="button"
                  onClick={() => { setShowAddFeatureForm(false); setAddFeatureData({ feature: null, startDate: null, endDate: null }); setAddFeatureError('') }}
                  disabled={loading.isUpdateFeatureSubscriptionsLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading.isUpdateFeatureSubscriptionsLoading}>
                  {loading.isUpdateFeatureSubscriptionsLoading ? 'Adding...' : 'Add'}
                </Button>
              </FormActions>
            </SubscriptionForm>
          )}

          {/* Feature tabs */}
          <div style={{ overflowX: 'auto', borderBottom: '2px solid #e5e7eb', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>
              {Object.entries(featureLabels).map(([key, label]) => (
                <button key={key} onClick={() => { setFeatureTabFilter(key); dispatch(fetchUserFeatureSubscriptions(user.id, key, 1)) }} style={{
                  padding: '0.5rem 1rem', background: 'none', border: 'none',
                  borderBottom: featureTabFilter === key ? '2px solid #3b82f6' : '2px solid transparent',
                  color: featureTabFilter === key ? '#3b82f6' : '#6b7280',
                  fontWeight: featureTabFilter === key ? 600 : 400,
                  cursor: 'pointer', fontSize: '0.8rem', marginBottom: '-2px', transition: 'all 0.2s',
                  flexShrink: 0,
                }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Per-feature summary */}
          {!loading.isFetchFeatureSubscriptionsLoading && (() => {
            const activeSub = featureSubscriptions.find(f => f.isActive)
            if (!activeSub) return null

            // Chain forward through consecutive future rows to get effective end date
            const sorted = [...featureSubscriptions].sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            let effectiveEnd = new Date(activeSub.endDate)
            for (const row of sorted) {
              const rowStart = new Date(row.startDate)
              if (rowStart <= effectiveEnd) continue
              const gapDays = (rowStart - effectiveEnd) / (1000 * 60 * 60 * 24)
              if (gapDays <= 1) effectiveEnd = new Date(row.endDate)
              else break
            }

            return (
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1rem', padding: '0.75rem 1rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Status</div>
                  <StatusBadge status="active">Active</StatusBadge>
                </div>
                <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '1.5rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Active Period</div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>
                    {formatDate(activeSub.startDate)} – {formatDate(effectiveEnd.toISOString())}
                  </div>
                </div>
              </div>
            )
          })()}

          {loading.isFetchFeatureSubscriptionsLoading ? (
            <EmptyState>Loading features...</EmptyState>
          ) : (
            <SubscriptionTable>
              <TableRow header $hasActions $template="1.5fr 90px 1fr 1fr 140px">
                <div>Feature</div>
                <div>Status</div>
                <div>Start Date</div>
                <div>End Date</div>
                <div>Actions</div>
              </TableRow>
              {featureSubscriptions
                .filter(f => !featureTabFilter || f.feature === featureTabFilter)
                .map(({ id, feature, isActive, startDate, endDate }) => (
                <>
                  <TableRow key={feature} $hasActions $template="1.5fr 90px 1fr 1fr 140px">
                    <div style={{ fontWeight: 500 }}>{featureLabels[feature] || feature}</div>
                    <div>
                      <StatusBadge status={isActive ? 'active' : 'expired'}>
                        {isActive ? 'Active' : 'Inactive'}
                      </StatusBadge>
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>{startDate ? formatDate(startDate) : 'â€”'}</div>
                    <div style={{ fontSize: '0.8rem' }}>{formatDate(endDate)}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {id && (
                        <>
                          <Button
                            variant="outline"
                            size="small"
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                            onClick={() => handleEditFeatureSub({ id, feature, startDate, endDate })}
                            disabled={loading.isUpdateFeatureSubscriptionsLoading}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="small"
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                            onClick={() => handleDeleteFeatureSub(id, feature)}
                            disabled={loading.isUpdateFeatureSubscriptionsLoading}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </TableRow>
                  {editingFeatureSub?.id === id && (
                    <TableRow key={`edit-${feature}`} $template="1.5fr 90px 1fr 1fr 140px" style={{ backgroundColor: '#f0f9ff' }}>
                      <div style={{ gridColumn: '1 / -1', padding: '0.75rem 0' }}>
                        <form onSubmit={handleEditFeatureSubmit}>
                          <FormRow>
                            <FormGroup>
                              <Label>Start Date</Label>
                              <div className="custom-datepicker-wrapper">
                                <DatePicker
                                  selected={editingFeatureSub.startDate}
                                  onChange={(date) => setEditingFeatureSub({ ...editingFeatureSub, startDate: date })}
                                  dateFormat="dd MMM yyyy"
                                  placeholderText="Select start date"
                                  dropdownMode="select"
                                  popperPlacement="top"
                                  className={`custom-datepicker-input ${editFeatureError ? 'error' : ''}`}
                                />
                              </div>
                            </FormGroup>
                            <FormGroup>
                              <Label>End Date</Label>
                              <div className="custom-datepicker-wrapper">
                                <DatePicker
                                  selected={editingFeatureSub.endDate}
                                  onChange={(date) => setEditingFeatureSub({ ...editingFeatureSub, endDate: date })}
                                  dateFormat="dd MMM yyyy"
                                  placeholderText="Select end date"
                                  minDate={editingFeatureSub.startDate}
                                  dropdownMode="select"
                                  popperPlacement="top"
                                  className={`custom-datepicker-input ${editFeatureError ? 'error' : ''}`}
                                />
                              </div>
                            </FormGroup>
                          </FormRow>
                          {editFeatureError && <ErrorText>{editFeatureError}</ErrorText>}
                          <FormActions style={{ marginTop: '0.75rem' }}>
                            <Button
                              type="button"
                              size="small"
                              onClick={() => { setEditingFeatureSub(null); setEditFeatureError('') }}
                              disabled={loading.isUpdateFeatureSubscriptionsLoading}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              variant="primary"
                              size="small"
                              disabled={loading.isUpdateFeatureSubscriptionsLoading}
                            >
                              {loading.isUpdateFeatureSubscriptionsLoading ? 'Saving...' : 'Save'}
                            </Button>
                          </FormActions>
                        </form>
                      </div>
                    </TableRow>
                  )}
                </>
              ))}
            </SubscriptionTable>
          )}

          {(!featureSubscriptionPagination.isLastPage || featureSubscriptionPagination.page > 1) && (
            <Pagination
              currentPage={featureSubscriptionPagination.page}
              isLastPage={featureSubscriptionPagination.isLastPage}
              onPageChange={(page) => dispatch(fetchUserFeatureSubscriptions(user.id, featureTabFilter, page))}
              isLoading={loading.isFetchFeatureSubscriptionsLoading}
              variant="admin"
              language="id"
            />
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
