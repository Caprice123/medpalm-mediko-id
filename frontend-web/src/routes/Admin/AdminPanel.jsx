import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserData } from '@utils/authToken'
import styled from 'styled-components'
import PricingPlans from './PricingPlans/index'
import Transactions from './Transactions'
import Features from './Features/index'
import Tags from './Tags'

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

const BackButton = styled.button`
  background: transparent;
  color: #6BB9E8;
  border: 2px solid #6BB9E8;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #6BB9E8, #8DC63F);
    color: white;
    border-color: transparent;
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
  margin-bottom: 2rem;
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
            active={activeTab === 'tags'}
            onClick={() => setActiveTab('tags')}
          >
            Kelola Tag
          </Tab>
          <Tab
            active={activeTab === 'pricingPlans'}
            onClick={() => setActiveTab('pricingPlans')}
          >
            Paket Harga
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

          {activeTab === 'tags' && <Tags />}

          {activeTab === 'pricingPlans' && <PricingPlans />}

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
