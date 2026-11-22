import { FaPlus } from 'react-icons/fa'
import { Divider, AddButton } from './AddSectionDivider.styles'

// The "+" on the rule between two sections. `leading` is the one above the
// first section, which has no rule of its own to sit on.
const AddSectionDivider = ({ afterPosition, onAdd, disabled, leading = false }) => (
  <Divider $leading={leading}>
    <AddButton
      type="button"
      title="Tambah bagian di sini"
      aria-label="Tambah bagian di sini"
      disabled={disabled}
      onClick={() => onAdd(afterPosition)}
    >
      <FaPlus />
    </AddButton>
  </Divider>
)

export default AddSectionDivider
