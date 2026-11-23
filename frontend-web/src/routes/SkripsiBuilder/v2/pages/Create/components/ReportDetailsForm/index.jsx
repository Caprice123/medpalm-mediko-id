import { FaPlus, FaTimes } from 'react-icons/fa'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Button from '@components/common/Button'
import { StepLabel, StepNumber, LockedHint } from '../../Create.styles'
import {
  Fields, MemberRow, MemberList, RemoveButton, FieldLabel, FieldHint,
} from './ReportDetailsForm.styles'

// The case and the group. Both are optional at this point — a student who
// only has the scenario can start writing and fill the group in later.
const ReportDetailsForm = ({
  form,
  onTitleChange,
  onCaseTextChange,
  members,
  onMemberChange,
  onAddMember,
  onRemoveMember,
  locked = false,
}) => (
  <>
    <StepLabel>
      <StepNumber>3</StepNumber> · Detail laporan
      {locked && <LockedHint>Pilih template dulu</LockedHint>}
    </StepLabel>

    <Fields>
      <TextInput
        label="Judul laporan"
        value={form.title}
        onChange={onTitleChange}
        placeholder="Mis. Laporan PBL Skenario 2 — Nyeri Dada"
        hint="Kosongkan untuk memakai nama template."
      />

      <Textarea
        label="Kasus PBL"
        value={form.caseText}
        onChange={onCaseTextChange}
        placeholder="Tempelkan skenario kasus di sini..."
        rows={6}
        hint="Teks ini otomatis mengisi bagian Skenario di editor."
      />

      <div>
        <FieldLabel>Anggota kelompok</FieldLabel>

        <MemberList>
          {members.map((member, index) => (
            <MemberRow key={index}>
              <TextInput
                value={member.name}
                onChange={onMemberChange(index, 'name')}
                placeholder="Nama anggota"
                size="small"
              />
              <TextInput
                value={member.studentNumber}
                onChange={onMemberChange(index, 'studentNumber')}
                placeholder="NIM"
                size="small"
              />
              <RemoveButton
                type="button"
                title="Hapus anggota"
                aria-label="Hapus anggota"
                onClick={() => onRemoveMember(index)}
              >
                <FaTimes />
              </RemoveButton>
            </MemberRow>
          ))}
        </MemberList>

        <FieldHint>Baris kosong diabaikan — anggota bisa ditambah lagi dari editor.</FieldHint>

        <Button variant="secondary" size="small" onClick={onAddMember}>
          <FaPlus /> Tambah anggota
        </Button>
      </div>
    </Fields>
  </>
)

export default ReportDetailsForm
