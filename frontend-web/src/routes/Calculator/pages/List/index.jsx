import { useEffect } from 'react'
import {
  Container,
  CalculatorSelectionContainer
} from './Calculator.styles'
import { getCalculatorTopics } from '../../../../store/calculator/action'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTags } from '../../../../store/tags/action'
import { actions as tagActions } from '@store/tags/reducer'
import { actions } from '@store/calculator/reducer'
import { Filter } from './components/Filter'
import CalculatorList from './components/CalculatorList'
import Pagination from '@components/Pagination'

function CalculatorPage() {
  const dispatch = useDispatch()
  const { pagination, loading } = useSelector(state => state.calculator)

  // Fetch calculators on mount
  useEffect(() => {
    dispatch(getCalculatorTopics())
    dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["kategori"] }))
    dispatch(fetchTags())
  }, [dispatch])

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(getCalculatorTopics())
  }

  return (
    <Container>
      <CalculatorSelectionContainer>
        <Filter />

        <CalculatorList />

        <Pagination
          currentPage={pagination.page}
          isLastPage={pagination.isLastPage}
          onPageChange={handlePageChange}
          isLoading={loading.isGetListCalculatorsLoading}
          variant="user"
          language="id"
        />
      </CalculatorSelectionContainer>
    </Container>
  )
}

export default CalculatorPage
