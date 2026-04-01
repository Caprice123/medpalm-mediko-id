import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { reorderPricingPlans } from '@store/pricing/adminAction'

function SortableRow({ plan }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: plan.id })

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
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, color: '#111827', fontSize: '0.9rem' }}>{plan.name}</div>
        {plan.code && <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{plan.code}</div>}
      </div>
      <span style={{
        fontSize: '0.75rem',
        padding: '2px 8px',
        borderRadius: '9999px',
        background: '#f3f4f6',
        color: '#374151',
      }}>
        #{plan.order ?? '-'}
      </span>
    </div>
  )
}

function PlanOrderModal({ isOpen, onClose, plans }) {
  const dispatch = useDispatch()
  const [items, setItems] = useState([])
  const [saving, setSaving] = useState(false)

  // Sync items when modal opens or plans change
  useEffect(() => {
    if (isOpen) {
      const activePlans = plans.filter(p => p.isActive).sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      setItems(activePlans)
    }
  }, [isOpen])

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    setItems(prev => {
      const oldIndex = prev.findIndex(p => p.id === active.id)
      const newIndex = prev.findIndex(p => p.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const orders = items.map((plan, index) => ({ id: plan.id, order: index + 1 }))
      await dispatch(reorderPricingPlans(orders))
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Atur Urutan Pricing Plans"
    >
      <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
        Drag dan drop untuk mengatur urutan tampilan pricing plans yang aktif.
      </div>

      {items.length === 0 ? (
        <div style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>
          Tidak ada pricing plan yang aktif.
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div>
              {items.map(plan => (
                <SortableRow key={plan.id} plan={plan} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Button variant="secondary" onClick={onClose} disabled={saving}>Batal</Button>
        <Button variant="primary" onClick={handleSave} disabled={saving || items.length === 0}>
          {saving ? 'Menyimpan...' : 'Simpan Urutan'}
        </Button>
      </div>
    </Modal>
  )
}

export default PlanOrderModal
