import { PiX } from 'react-icons/pi'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import { useDiagnosisSection } from './hooks/useDiagnosisSection'
import {
  Hint,
  EntryRow,
  RemoveEntry,
  EmptyEntries,
  AddRow,
  FieldGroup,
} from '../../Worksheet.styles'

function DiagnosisSection({ isPsikiatri, answers }) {
  const {
    diagnosisUtama, setDiagnosisUtama,
    diagnosisPembanding, setDiagnosisPembanding,
  } = answers

  const {
    draftPrimary, setDraftPrimary,
    draftDifferential, setDraftDifferential,
    addPrimary, removePrimary,
    addDifferential, removeDifferential,
    onEnter,
  } = useDiagnosisSection({ isPsikiatri, setDiagnosisUtama, setDiagnosisPembanding })

  return (
    <>
      <FieldGroup>
        <h3>Diagnosis utama</h3>

        {isPsikiatri ? (
          <>
            <AddRow>
              <TextInput
                placeholder="Tambah diagnosis utama..."
                value={draftPrimary}
                onChange={(event) => setDraftPrimary(event.target.value)}
                onKeyDown={onEnter(addPrimary)}
                size="small"
              />
              <Button variant="primary" size="small" onClick={addPrimary} disabled={!draftPrimary.trim()}>
                Tambah
              </Button>
            </AddRow>

            {diagnosisUtama.length > 0 ? (
              diagnosisUtama.map((entry, index) => (
                <EntryRow key={`${entry}-${index}`}>
                  <span>{index + 1}. {entry}</span>
                  <RemoveEntry type="button" onClick={() => removePrimary(index)} title="Hapus">
                    <PiX size={13} />
                  </RemoveEntry>
                </EntryRow>
              ))
            ) : (
              <EmptyEntries>Belum ada diagnosis utama.</EmptyEntries>
            )}
            <Hint>Kasus psikiatri dinilai multiaksial, jadi boleh lebih dari satu.</Hint>
          </>
        ) : (
          <>
            <TextInput
              placeholder="Mis. Angina Pektoris Stabil"
              value={diagnosisUtama}
              onChange={(event) => setDiagnosisUtama(event.target.value)}
              size="small"
            />
            <Hint>Satu diagnosis kerja. Yang lain masuk ke diagnosis pembanding.</Hint>
          </>
        )}
      </FieldGroup>

      <FieldGroup>
        <h3>Diagnosis pembanding</h3>

        <AddRow>
          <TextInput
            placeholder="Tambah pembanding..."
            value={draftDifferential}
            onChange={(event) => setDraftDifferential(event.target.value)}
            onKeyDown={onEnter(addDifferential)}
            size="small"
          />
          <Button
            variant="primary"
            size="small"
            onClick={addDifferential}
            disabled={!draftDifferential.trim()}
          >
            Tambah
          </Button>
        </AddRow>

        {diagnosisPembanding.length > 0 ? (
          diagnosisPembanding.map((entry, index) => (
            <EntryRow key={`${entry}-${index}`}>
              <span>{index + 1}. {entry}</span>
              <RemoveEntry type="button" onClick={() => removeDifferential(index)} title="Hapus">
                <PiX size={13} />
              </RemoveEntry>
            </EntryRow>
          ))
        ) : (
          <EmptyEntries>Belum ada diagnosis pembanding.</EmptyEntries>
        )}
      </FieldGroup>
    </>
  )
}

export default DiagnosisSection
