import { useSelector } from 'react-redux'
import { FaRegFileAlt, FaThList, FaTimes } from 'react-icons/fa'
import Loading from '@components/common/Loading'
import { CUSTOM_TEMPLATE } from '../../hooks/useCreateReport'
import { StepLabel, StepNumber } from '../../Create.styles'
import {
  Card, CardHeading, CardIcon, CardDescription, SectionList, CardGrid, OwnBadge, DeleteOwn,
} from './TemplatePicker.styles'

// The cards are whatever an admin has published, followed by the outlines this
// student saved themselves. "Buat sendiri" is appended here rather than stored
// as a template, because it is the absence of one.
const TemplatePicker = ({ selectedTemplate, onSelect, onDeleteOwn }) => {
  const templates = useSelector(state => state.skripsiV2.templates)
  const isLoading = useSelector(state => state.skripsiV2.loading.isFetchingTemplates)

  return (
    <>
      <StepLabel><StepNumber>1</StepNumber> · Pilih template</StepLabel>

      {isLoading && templates.length === 0 ? (
        <Loading text="Memuat template..." />
      ) : (
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
      )}
    </>
  )
}

export default TemplatePicker
