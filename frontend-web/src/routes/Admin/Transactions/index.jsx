import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Filter from '@components/common/Filter'
import {
  fetchAllTransactions,
} from '@store/credit/action'
import {
  Container,
  HeaderSection,
  SectionTitle,
  SectionSubtitle,
} from './Transactions.styles'
import TransactionList from './components/Table'

function Transactions() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAllTransactions())
    }, [dispatch])

  return (
    <Container>
      <HeaderSection>
        <SectionTitle>All Transactions</SectionTitle>
        <SectionSubtitle>View and manage all credit transactions and purchases</SectionSubtitle>
      </HeaderSection>

    <Filter />

    <TransactionList />
    </Container>
  )
}

export default Transactions
