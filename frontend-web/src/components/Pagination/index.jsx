import React, { memo } from 'react'
import {
  PaginationContainer,
  PaginationButton,
  PageInfo
} from './Pagination.styles'

/**
 * Reusable Pagination Component (isLastPage-based)
 * @param {number} currentPage - Current page number
 * @param {boolean} isLastPage - Whether this is the last page
 * @param {function} onPageChange - Callback function when page changes
 * @param {boolean} isLoading - Whether data is currently loading
 * @param {string} variant - Style variant: 'default' or 'admin' (default: 'default')
 * @param {string} language - Language: 'id' or 'en' (default: 'en')
 */
const Pagination = memo(function Pagination({
  currentPage,
  isLastPage,
  onPageChange,
  isLoading,
  variant = 'default',
  language = 'en'
}) {
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

  // Text translations
  const text = {
    id: {
      previous: '← Sebelumnya',
      next: 'Selanjutnya →',
      page: 'Halaman',
      of: 'dari'
    },
    en: {
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of'
    }
  }

  const t = text[language]

  return (
    <PaginationContainer>
      <PaginationButton
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        $variant={variant}
      >
        {t.previous}
      </PaginationButton>

      <PageInfo>
        {t.page} {currentPage}
      </PageInfo>

      <PaginationButton
        onClick={handleNext}
        disabled={isLastPage || isLoading}
        $variant={variant}
      >
        {t.next}
      </PaginationButton>
    </PaginationContainer>
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.currentPage === nextProps.currentPage &&
    prevProps.isLastPage === nextProps.isLastPage &&
    prevProps.isLoading === nextProps.isLoading
  )
})

export default Pagination
