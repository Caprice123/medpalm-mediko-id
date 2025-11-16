import React from 'react'
import {
  PaginationContainer,
  PaginationButton,
  PageInfo
} from './Pagination.styles'

function Pagination({ currentPage, isLastPage, onPageChange, isLoading }) {
  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (!isLastPage && !isLoading) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <PaginationContainer>
      <PaginationButton
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
      >
        ← Sebelumnya
      </PaginationButton>

      <PageInfo>
        Halaman {currentPage}
      </PageInfo>

      <PaginationButton
        onClick={handleNext}
        disabled={isLastPage || isLoading}
      >
        Selanjutnya →
      </PaginationButton>
    </PaginationContainer>
  )
}

export default Pagination
