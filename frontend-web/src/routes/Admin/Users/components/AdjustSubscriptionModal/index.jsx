import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import { formatLocalDateLong } from '@utils/dateUtils'
import Button from '@components/common/Button'
import {
  FormGroup,
  Label,
  ErrorText,
  HintText,
  UserInfo,
  UserInfoLabel,
  UserInfoValue,
  DateInput,
  ModalFooter
} from './AdjustSubscriptionModal.styles'

function AdjustSubscriptionModal({ isOpen, onClose, formik, user }) {
  const { loading } = useSelector(state => state.user)

  const handleSubmit = (e) => {
    e.preventDefault()
    formik.handleSubmit()
  }

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

  // Helper function to format date
  const formatDate = (dateString) => formatLocalDateLong(dateString)

  const activeSub = user ? getActiveSubscription(user.userSubscriptions) : null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust User Subscription"
      size="small"
    >
      <form onSubmit={handleSubmit}>
        {user && (
          <UserInfo>
            <UserInfoLabel>User</UserInfoLabel>
            <UserInfoValue>{user.name || user.email}</UserInfoValue>
            <UserInfoLabel style={{ marginTop: '0.5rem' }}>Email</UserInfoLabel>
            <UserInfoValue>{user.email}</UserInfoValue>

            {activeSub ? (
              <>
                <UserInfoLabel style={{ marginTop: '0.75rem' }}>Current Subscription</UserInfoLabel>
                <UserInfoValue style={{
                  color: '#059669',
                  fontWeight: 600,
                  marginBottom: '0.25rem'
                }}>
                  Active
                </UserInfoValue>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: '1.5'
                }}>
                  <div>Start: {formatDate(activeSub.startDate)}</div>
                  <div>End: {formatDate(activeSub.endDate)}</div>
                </div>
              </>
            ) : (
              <>
                <UserInfoLabel style={{ marginTop: '0.75rem' }}>Current Subscription</UserInfoLabel>
                <UserInfoValue style={{
                  color: '#dc2626',
                  fontWeight: 600
                }}>
                  No Active Subscription
                </UserInfoValue>
              </>
            )}
          </UserInfo>
        )}

        <FormGroup>
          <Label>Start Date</Label>
          <DateInput
            type="date"
            name="startDate"
            value={formik.values.startDate || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            hasError={formik.touched.startDate && formik.errors.startDate}
          />
          {formik.touched.startDate && formik.errors.startDate ? (
            <ErrorText>{formik.errors.startDate}</ErrorText>
          ) : (
            <HintText>Select subscription start date</HintText>
          )}
        </FormGroup>

        <FormGroup>
          <Label>End Date</Label>
          <DateInput
            type="date"
            name="endDate"
            value={formik.values.endDate || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            hasError={formik.touched.endDate && formik.errors.endDate}
          />
          {formik.touched.endDate && formik.errors.endDate ? (
            <ErrorText>{formik.errors.endDate}</ErrorText>
          ) : (
            <HintText>Select subscription end date</HintText>
          )}
        </FormGroup>

        <ModalFooter>
          <Button type="button" onClick={onClose} disabled={loading.isAdjustSubscriptionLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading.isAdjustSubscriptionLoading}
          >
            {loading.isAdjustSubscriptionLoading ? 'Adjusting...' : 'Adjust Subscription'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default AdjustSubscriptionModal
