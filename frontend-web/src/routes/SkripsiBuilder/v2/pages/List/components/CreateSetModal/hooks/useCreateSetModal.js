import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generatePath, useNavigate } from 'react-router-dom'
import { createSet } from '@store/skripsi/v2'
import { actions as commonActions } from '@store/common/reducer'
import { SkripsiRoute } from '../../../../../../routes'

const emptyForm = { title: '', description: '' }

export const useCreateSetModal = ({ onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isCreating = useSelector(state => state.skripsiV2.loading.isCreatingSet)

  const [form, setForm] = useState(emptyForm)

  const setField = (key) => (event) => setForm(prev => ({ ...prev, [key]: event.target.value }))

  const reset = () => setForm(emptyForm)

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      dispatch(commonActions.setError('Judul set tidak boleh kosong'))
      return
    }

    const set = await dispatch(createSet(form.title.trim(), form.description.trim()))
    reset()
    onClose()

    // The response is serialized, so `uniqueId` is camelCase here. V1 read
    // `set.unique_id` off an unserialized row, and its own list then rendered
    // that row's `uniqueId` as undefined — so the new card's "Buka Set" went
    // to /sets/undefined.
    if (set?.uniqueId) {
      navigate(generatePath(SkripsiRoute.editorRoute, { setId: set.uniqueId }))
    }
  }

  return {
    form,
    setTitle: setField('title'),
    setDescription: setField('description'),
    canSubmit: Boolean(form.title.trim()),
    isCreating,
    handleSubmit,
    handleClose,
  }
}
