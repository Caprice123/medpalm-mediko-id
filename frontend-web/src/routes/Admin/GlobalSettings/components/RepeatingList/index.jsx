import { useSelector } from 'react-redux'
import {
  ItemCard,
  ItemHeader,
  ItemNumber,
  RemoveButton,
  AddButton,
} from '../../GlobalSettings.styles'

// The numbered card, the Hapus button and the Tambah button are identical in
// every list section; only the fields inside differ, so each section passes
// those as a render function and writes nothing else.
//
// The last row cannot be removed: a section with zero rows gives the admin no
// input to type into and no way back.
function RepeatingList({ items, label, addLabel, onAdd, onRemove, children }) {
  const loading = useSelector((state) => state.constant.loading.isGetListConstantsLoading)

  return (
    <>
      {items.map((item, index) => (
        <ItemCard key={index}>
          <ItemHeader>
            <ItemNumber>
              {label} {index + 1}
            </ItemNumber>
            {items.length > 1 && (
              <RemoveButton onClick={() => onRemove(index)}>Hapus</RemoveButton>
            )}
          </ItemHeader>

          {children(item, index)}
        </ItemCard>
      ))}

      <AddButton onClick={onAdd} disabled={loading}>
        + {addLabel}
      </AddButton>
    </>
  )
}

export default RepeatingList
