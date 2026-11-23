import { FaRegFileAlt, FaThList, FaTimes } from 'react-icons/fa'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import Loading from '@components/common/Loading'
import LoadMore from '@components/common/LoadMore'
import { CUSTOM_TEMPLATE } from '../../hooks/useCreateReport'
import { useTemplatePicker } from './hooks/useTemplatePicker'
import {
  Card, CardHeading, CardIcon, CardDescription, SectionList, CardGrid, OwnBadge, DeleteOwn,
  SearchRow, EmptyNote, LoadMoreRow,
} from './TemplatePicker.styles'

// Step 1. The cards are whatever an admin has published, followed by the
// outlines this student saved themselves. "Buat sendiri" is appended here
// rather than stored as a template, because it is the absence of one — and it
// survives a search, since it is not a row that could match a term.
const TemplatePicker = ({ selectedTemplate, onSelect, onDeleteOwn }) => {
  const {
    templates,
    search,
    pagination,
    isFetching,
    isLoadingMore,
    setSearch,
    applySearch,
    loadMore,
  } = useTemplatePicker()

  const isFirstLoad = isFetching && templates.length === 0

  return (
    <>
      <SearchRow
        onSubmit={(event) => {
          event.preventDefault()
          applySearch()
        }}
      >
        <TextInput
          placeholder="Cari template..."
          value={search}
          onChange={setSearch}
        />
        <Button variant="primary" type="submit" disabled={isFetching}>
          🔍 Cari
        </Button>
      </SearchRow>

      {isFirstLoad ? (
        <Loading text="Memuat template..." />
      ) : (
        <>
          {templates.length === 0 && search && (
            <EmptyNote>
              Tidak ada template yang cocok dengan "{search}". Kosongkan pencarian untuk
              melihat semuanya, atau mulai dari kartu "Buat sendiri" di bawah.
            </EmptyNote>
          )}

          <CardGrid>
            {templates.map(template => (
              <Card
                key={template.id}
                type="button"
                $selected={selectedTemplate === template.id}
                onClick={() => onSelect(template.id)}
              >
                <CardHeading>
                  <CardIcon><FaThList /></CardIcon>
                  {template.name}
                  {template.isOwn && <OwnBadge>Template saya</OwnBadge>}
                  {template.isOwn && (
                    <DeleteOwn
                      as="span"
                      role="button"
                      tabIndex={0}
                      title="Hapus template ini"
                      onClick={(event) => {
                        // The card itself is a button: without this the delete
                        // would also select the template it just removed.
                        event.stopPropagation()
                        onDeleteOwn(template.id)
                      }}
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter' && event.key !== ' ') return
                        event.preventDefault()
                        event.stopPropagation()
                        onDeleteOwn(template.id)
                      }}
                    >
                      <FaTimes />
                    </DeleteOwn>
                  )}
                </CardHeading>
                {template.description && <CardDescription>{template.description}</CardDescription>}
                <SectionList>
                  {template.sections.map(section => section.title).join(' · ')}
                </SectionList>
              </Card>
            ))}

            <Card
              type="button"
              $selected={selectedTemplate === CUSTOM_TEMPLATE}
              onClick={() => onSelect(CUSTOM_TEMPLATE)}
            >
              <CardHeading>
                <CardIcon><FaRegFileAlt /></CardIcon>
                Buat sendiri
              </CardHeading>
              <CardDescription>Mulai dari kosong, tambah bagian sesukamu.</CardDescription>
            </Card>
          </CardGrid>

          <LoadMoreRow>
            <LoadMore
              isLastPage={pagination.isLastPage}
              isLoading={isLoadingMore}
              itemCount={templates.length}
              onClick={loadMore}
            />
          </LoadMoreRow>
        </>
      )}
    </>
  )
}

export default TemplatePicker
