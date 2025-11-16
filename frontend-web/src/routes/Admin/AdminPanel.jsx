import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserData } from '@utils/authToken'
import styled from 'styled-components'
import CreditPlans from './CreditPlans/index'
import Transactions from './Transactions'
import Features from './Features/index'

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
  color: #0891b2;
`

const BackButton = styled.button`
  background: transparent;
  color: #0891b2;
  border: 2px solid #0891b2;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #0891b2;
    color: white;
    transform: translateY(-2px);
  }
`

const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
`

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0891b2;
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
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
`

const Tab = styled.button`
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: ${props => props.active ? '#0891b2' : '#6b7280'};
  border-bottom: 3px solid ${props => props.active ? '#0891b2' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;

  &:hover {
    color: #0891b2;
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

function AdminPanel() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('features')

  useEffect(() => {
    const userData = getUserData()

    // Check if user is admin
    if (!userData || userData.role !== 'admin') {
      navigate('/dashboard')
      return
    }

    setUser(userData)
  }, [navigate])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <AdminContainer>
      <MainContent>
        <TabContainer>
          <Tab
            active={activeTab === 'features'}
            onClick={() => setActiveTab('features')}
          >
            Kelola Fitur
          </Tab>
          <Tab
            active={activeTab === 'creditPlans'}
            onClick={() => setActiveTab('creditPlans')}
          >
            Paket Kredit
          </Tab>
          <Tab
            active={activeTab === 'transactions'}
            onClick={() => setActiveTab('transactions')}
          >
            Transaksi
          </Tab>
          <Tab
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          >
            Kelola User
          </Tab>
        </TabContainer>

        <ContentArea>
          {activeTab === 'features' && <Features />}

          {activeTab === 'creditPlans' && <CreditPlans />}

          {activeTab === 'transactions' && <Transactions />}

          {activeTab === 'users' && (
            <EmptyState>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
              <div>Manajemen User</div>
              <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Fitur ini akan segera hadir
              </div>
            </EmptyState>
          )}
        </ContentArea>
      </MainContent>
    </AdminContainer>
  )
}

export default AdminPanel
