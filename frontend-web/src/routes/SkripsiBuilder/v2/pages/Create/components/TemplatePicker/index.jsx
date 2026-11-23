import { FaCheck, FaRegFileAlt, FaThList, FaTimes } from 'react-icons/fa'
import Button from '@components/common/Button'
import Loading from '@components/common/Loading'
import { CUSTOM_TEMPLATE } from '../../hooks/useCreateReport'
import { StepLabel, StepNumber } from '../../Create.styles'
import { useTemplatePicker } from './hooks/useTemplatePicker'
import {
  Card, CardHeading, CardIcon, CardDescription, SectionList, CardGrid, OwnBadge, DeleteOwn,
  ChosenRow, ChosenIcon, ChosenName,
} from './TemplatePicker.styles'

// The cards are whatever an admin has published, followed by the outlines this
// student saved themselves. "Buat sendiri" is appended here rather than stored
// as a template, because it is the absence of one.
//
// An admin can publish any number of templates, so this is the one part of the
// page that grows without bound. Once a template is chosen the grid folds to a
// single row naming it, which is what lets the two steps below stay on the
// same page instead of becoming screens of their own.
const TemplatePicker = ({ selectedTemplate, onSelect, onDeleteOwn }) => {
  const {
    templates,
    isLoading,
    isExpanded,
    selectedName,
    expand,
    collapse,
  } = useTemplatePicker(selectedTemplate)

  const handleSelect = (templateId) => {
    onSelect(templateId)
    collapse()
  }

  if (!isExpanded) {
    return (
      <>
        <StepLabel><StepNumber>1</StepNumber> · Pilih template</StepLabel>

        <ChosenRow>
          <ChosenIcon><FaCheck /></ChosenIcon>
          <ChosenName>{selectedName}</ChosenName>
          <Button variant="secondary" size="small" onClick={expand}>Ganti</Button>
        </ChosenRow>
      </>
    )
  }

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
              onClick={() => handleSelect(template.id)}
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
            onClick={() => handleSelect(CUSTOM_TEMPLATE)}
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
