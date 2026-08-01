import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getUserData } from '@utils/authToken'
import { resetAllState } from '@store/globalAction'
import styled from 'styled-components'
import PricingPlans from './PricingPlans/index'
import Features from './Features/index'
import Tags from './Tags'
import Users from './Users'
import TransactionList from './Transactions/components/Table'
import Transactions from './Transactions'
import GlobalSettings from './GlobalSettings'
import EventAdmin from './Features/subpages/Event'
import BannerAdmin from './Features/subpages/Banner'
import Layanan from './Layanan'
import FeaturesV2 from './FeaturesV2'
import MateriAdmin from './MateriAdmin'

const AdminContainer = styled.div`
  min-height: 100vh;
  background: #f0fdfa;
`

const MainContent = styled.main`
  margin: 0 auto;
  padding: 2rem;
`

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid #e5e7eb;
  overflow-x: auto;
  overflow-y: hidden;
  flex-wrap: nowrap;
  padding-top: 0.5rem;
`

const Tab = styled.button`
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: ${props => props.active ? '#6BB9E8' : '#6b7280'};
  border-bottom: 3px solid ${props => props.active ? '#6BB9E8' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;
  position: relative;
  flex-shrink: 0;
  white-space: nowrap;

  ${props => props.active && `
    background: linear-gradient(180deg, rgba(107, 185, 232, 0.05), transparent);
  `}

  &:hover {
    color: #6BB9E8;
  }
`

const ContentArea = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
`

// Helper function to check if user has permission to access a tab
const hasTabPermission = (user, tab) => {
  // Superadmin always has all permissions
  if (user.role === 'superadmin') {
    return true
  }

  // If user has custom permissions, check them
  if (user.permissions && user.permissions.tabs) {
    return user.permissions.tabs.includes(tab)
  }

  // Default permissions based on role
  if (user.role === 'admin') {
    // Admins by default have access to all tabs except 'users'
    return ['features', 'layanan', 'events', 'banners', 'tags', 'pricingPlans', 'transactions', 'globalSettings', 'featuresV2', 'nodeStructure', 'materi'].includes(tab)
  }

  // Other roles don't have admin panel access
  return false
}

// Get available tabs for user
const getAvailableTabs = (user) => {
  const allTabs = [
    { key: 'features', label: 'Kelola Fitur', permission: 'features' },
    { key: 'layanan', label: 'Layanan', permission: 'layanan' },
    { key: 'events', label: 'Events', permission: 'events' },
    { key: 'banners', label: 'Banner', permission: 'banner' },
    { key: 'tags', label: 'Kelola Tag', permission: 'tags' },
    { key: 'pricingPlans', label: 'Paket Harga', permission: 'pricingPlans' },
    { key: 'transactions', label: 'Transaksi', permission: 'transactions' },
    { key: 'users', label: 'Kelola User', permission: 'users' },
    { key: 'globalSettings', label: 'Pengaturan Global', permission: 'globalSettings' },
    { key: 'featuresV2', label: 'Fitur V2', permission: 'features' },
    { key: 'materi', label: 'Materi', permission: 'features' },
  ]

  return allTabs.filter(tab => hasTabPermission(user, tab.permission))
}

function AdminPanel() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState(null)
  const [availableTabs, setAvailableTabs] = useState([])

  useEffect(() => {
    const userData = getUserData()

    // Check if user is admin or superadmin
    if (!userData || (userData.role !== 'admin' && userData.role !== 'superadmin')) {
      navigate('/dashboard')
      return
    }

    setUser(userData)

    // Get available tabs for this user
    const tabs = getAvailableTabs(userData)
    setAvailableTabs(tabs)

    // Set tab from URL param if valid, otherwise default to first tab
    const tabParam = searchParams.get('tab')
    const initialTab = tabParam && tabs.find(t => t.key === tabParam) ? tabParam : tabs[0]?.key
    if (initialTab) setActiveTab(initialTab)
  }, [navigate, searchParams])

  useEffect(() => {
    if (activeTab) dispatch(resetAllState())
  }, [activeTab])

  if (!user || !activeTab) {
    return <div>Loading...</div>
  }

  return (
    <AdminContainer>
      <MainContent>
        <TabContainer>
          {availableTabs.map(tab => (
            <Tab
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabContainer>

        <ContentArea>
          {activeTab === 'features' && <Features />}

          {activeTab === 'layanan' && <Layanan />}

          {activeTab === 'events' && <EventAdmin />}

          {activeTab === 'banners' && <BannerAdmin />}

          {activeTab === 'tags' && <Tags />}

          {activeTab === 'pricingPlans' && <PricingPlans />}

          {activeTab === 'transactions' && <Transactions />}

          {activeTab === 'users' && <Users />}

          {activeTab === 'globalSettings' && <GlobalSettings />}

          {activeTab === 'featuresV2' && <FeaturesV2 />}

          {activeTab === 'materi' && <MateriAdmin />}
        </ContentArea>
      </MainContent>
    </AdminContainer>
  )
}

export default AdminPanel
