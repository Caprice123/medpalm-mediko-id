import {
  Container,
  SelectButton,
  SelectedList,
  SelectedItem,
  ItemInfo,
  ItemTitle,
  ItemMeta,
  RemoveButton,
  Footer,
  Count,
  ChangeButton
} from './SelectedResourcesDisplay.styles'

const SelectedResourcesDisplay = ({
  selectedItems = [],
  onOpenSelector,
  onRemove,
  emptyText = 'Klik untuk memilih',
  icon = '➕',
  getItemMeta
}) => {
  if (selectedItems.length === 0) {
    return (
      <Container onClick={onOpenSelector}>
        <SelectButton>
          <span>{icon}</span>
          <span>{emptyText}</span>
        </SelectButton>
      </Container>
    )
  }
  console.log(selectedItems)

  return (
    <Container>
      <SelectedList>
        {selectedItems.map((item) => (
          <SelectedItem key={item.id}>
            <ItemInfo>
              <ItemTitle>{item.title}</ItemTitle>
              {getItemMeta && (
                <ItemMeta>{getItemMeta(item)}</ItemMeta>
              )}
            </ItemInfo>
            <RemoveButton onClick={() => onRemove(item.id)}>
              Hapus
            </RemoveButton>
          </SelectedItem>
        ))}
      </SelectedList>
      <Footer>
        <Count>{selectedItems.length} item dipilih</Count>
        <ChangeButton onClick={onOpenSelector}>
          Ubah Pilihan
        </ChangeButton>
      </Footer>
    </Container>
  )
}

export default SelectedResourcesDisplay
