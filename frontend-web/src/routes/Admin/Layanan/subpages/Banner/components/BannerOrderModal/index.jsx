import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { fetchAdminBanners, reorderBanners } from '@store/banner/adminAction'

function SortableRow({ banner }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: banner.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    background: isDragging ? '#f0f9ff' : 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    cursor: 'grab',
    userSelect: 'none',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span style={{ color: '#9ca3af', fontSize: '1.1rem' }}>⠿</span>
      <div
        style={{
          width: 40,
          height: 28,
          borderRadius: 6,
          flexShrink: 0,
          background: banner.gradientStart && banner.gradientEnd
            ? `linear-gradient(135deg, ${banner.gradientStart}, ${banner.gradientEnd})`
            : 'linear-gradient(135deg, #0369a1, #15803d)',
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, color: '#111827', fontSize: '0.9rem' }}>{banner.title}</div>
        {banner.description && (
          <div style={{ fontSize: '0.75rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>
            {banner.description}
          </div>
        )}
      </div>
    </div>
  )
}

function BannerOrderModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    dispatch(fetchAdminBanners())
      .then(result => {
        if (result?.data) {
          const sorted = [...result.data]
            .filter(b => b.isActive)
            .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
          setItems(sorted)
        }
      })
      .finally(() => setLoading(false))
  }, [isOpen])

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    setItems(prev => {
      const oldIndex = prev.findIndex(b => b.id === active.id)
      const newIndex = prev.findIndex(b => b.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const orders = items.map((banner, index) => ({ id: banner.id, order: index + 1 }))
      await dispatch(reorderBanners(orders))
      dispatch(fetchAdminBanners())
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Atur Urutan Banner">
      <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
        Drag dan drop untuk mengatur urutan tampilan banner aktif di dashboard.
      </div>

      {loading ? (
        <div style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>Memuat data...</div>
      ) : items.length === 0 ? (
        <div style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>Tidak ada banner yang aktif.</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div>
              {items.map(banner => (
                <SortableRow key={banner.id} banner={banner} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Button variant="outline" onClick={onClose} disabled={saving}>Batal</Button>
        <Button variant="primary" onClick={handleSave} disabled={saving || loading || items.length === 0}>
          {saving ? 'Menyimpan...' : 'Simpan Urutan'}
        </Button>
      </div>
    </Modal>
  )
}

export default BannerOrderModal
