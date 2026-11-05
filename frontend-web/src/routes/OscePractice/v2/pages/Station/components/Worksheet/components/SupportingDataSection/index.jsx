import { PiFlask } from 'react-icons/pi'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import ConfirmationModal from '@components/common/ConfirmationModal'
import { Hint, EmptyEntries, SubmitRow } from '../../Worksheet.styles'
import { useSupportingData, MAX_SELECTIONS } from './hooks/useSupportingData'
import {
  Counter,
  Group,
  Choice,
  Result,
  Plate,
  Findings,
  InterpretationLabel,
} from './SupportingDataSection.styles'

function SupportingDataSection({ answers }) {
  const { observations, setObservations, interpretations, setInterpretations } = answers
  const {
    isLocked, isSaving, search, setSearch, groups, selectedIds, toggle,
    setInterpretation, isConfirmOpen, openConfirm, closeConfirm, confirmSave,
  } = useSupportingData({ observations, setObservations, setInterpretations })

  // After saving, the panel becomes the results: findings, images, and the student's reading.
  if (isLocked) {
    return (
      <>
        {observations.length === 0 ? (
          <EmptyEntries>Tidak ada pemeriksaan penunjang yang dipilih.</EmptyEntries>
        ) : (
          <PhotoProvider>
            {observations.map((observation) => (
              <Result key={observation.snapshotId}>
                <h4>{observation.name}</h4>

                {observation.attachments?.url && (
                  <PhotoView src={observation.attachments.url}>
                    <Plate type="button" title="Perbesar hasil">
                      <img
                        src={observation.attachments.url}
                        alt={observation.attachments.name || observation.name}
                      />
                    </Plate>
                  </PhotoView>
                )}

                {observation.observationText ? (
                  // The findings are authored by admins as rich text, which is why they are
                  // injected rather than rendered as markdown.
                  <Findings dangerouslySetInnerHTML={{ __html: observation.observationText }} />
                ) : (
                  <Findings>Tidak ada data.</Findings>
                )}

                {observation.requiresInterpretation && (
                  <>
                    <InterpretationLabel htmlFor={`interpretation-${observation.snapshotId}`}>
                      Interpretasi kamu <em>*</em>
                    </InterpretationLabel>
                    <Textarea
                      id={`interpretation-${observation.snapshotId}`}
                      placeholder="Apa artinya hasil ini untuk pasien kamu..."
                      value={interpretations[observation.snapshotId] || ''}
                      onChange={(event) => setInterpretation(observation.snapshotId, event.target.value)}
                      rows={3}
                    />
                  </>
                )}
              </Result>
            ))}
          </PhotoProvider>
        )}
      </>
    )
  }

  const atLimit = selectedIds.length >= MAX_SELECTIONS

  return (
    <>
      <TextInput
        placeholder="Cari pemeriksaan penunjang..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        size="small"
      />

      <Counter $atLimit={atLimit}>
        <span>{selectedIds.length} / {MAX_SELECTIONS} dipilih</span>
        {atLimit && <span>batas tercapai</span>}
      </Counter>

      {groups.length === 0 ? (
        <EmptyEntries>
          {search ? 'Tidak ada pemeriksaan yang cocok.' : 'Kasus ini tidak menyediakan pemeriksaan penunjang.'}
        </EmptyEntries>
      ) : (
        groups.map((group) => (
          <Group key={group.name}>
            <h4>{group.name}</h4>
            {group.items.map((item) => {
              const checked = selectedIds.includes(item.id)
              const disabled = !checked && atLimit

              return (
                <Choice key={item.id} $checked={checked} $disabled={disabled}>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggle(item.id)}
                  />
                  <span>{item.name}</span>
                </Choice>
              )
            })}
          </Group>
        ))
      )}

      {groups.length > 0 && (
        <>
          <SubmitRow>
            <Button
              variant="primary"
              fullWidth
              onClick={openConfirm}
              disabled={isSaving || selectedIds.length === 0}
            >
              {isSaving ? 'Menyimpan...' : 'Minta hasil pemeriksaan'}
            </Button>
          </SubmitRow>
          <Hint>Pilihan tidak bisa diubah setelah hasilnya kamu lihat.</Hint>
        </>
      )}

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onCancel={closeConfirm}
        onConfirm={confirmSave}
        icon={<PiFlask size={30} />}
        title="Minta hasil pemeriksaan?"
        message={`${selectedIds.length} pemeriksaan akan dibuka. Setelah hasilnya terlihat, pilihan tidak bisa diubah lagi.`}
        confirmText="Ya, buka hasilnya"
        cancelText="Batal"
      />
    </>
  )
}

export default SupportingDataSection
