import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserData } from '@utils/authToken'
import styled from 'styled-components'
import PricingPlans from './PricingPlans/index'
import Features from './Features/index'
import Tags from './Tags'
import Users from './Users'
import TransactionList from './Transactions/components/Table'
import Transactions from './Transactions'

const AdminContainer = styled.div`
  min-height: 100vh;
  background: #f0fdfa;
`

const Header = styled.header`
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6BB9E8, #8DC63F);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`


const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
`

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6BB9E8, #8DC63F);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`

const PageSubtitle = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 1.05rem;
`

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid #e5e7eb;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
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
    return ['features', 'tags', 'pricingPlans', 'transactions'].includes(tab)
  }

  // Other roles don't have admin panel access
  return false
}

// Get available tabs for user
const getAvailableTabs = (user) => {
  const allTabs = [
    { key: 'features', label: 'Kelola Fitur' },
    { key: 'tags', label: 'Kelola Tag' },
    { key: 'pricingPlans', label: 'Paket Harga' },
    { key: 'transactions', label: 'Transaksi' },
    { key: 'users', label: 'Kelola User' }
  ]

  return allTabs.filter(tab => hasTabPermission(user, tab.key))
}

function AdminPanel() {
  const navigate = useNavigate()
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

    // Set first available tab as active
    if (tabs.length > 0) {
      setActiveTab(tabs[0].key)
    }
  }, [navigate])

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

          {activeTab === 'tags' && <Tags />}

          {activeTab === 'pricingPlans' && <PricingPlans />}

          {activeTab === 'transactions' && <Transactions />}

          {activeTab === 'users' && <Users />}
        </ContentArea>
      </MainContent>
    </AdminContainer>
  )
}

export default AdminPanel
