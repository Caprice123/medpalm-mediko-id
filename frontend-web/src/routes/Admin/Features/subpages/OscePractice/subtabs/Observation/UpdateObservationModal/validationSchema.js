
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  groupId: Yup.number()
    .required('Grup observasi harus dipilih')
    .positive('Pilih grup yang valid'),
  name: Yup.string()
    .required('Nama observasi harus diisi')
    .min(2, 'Nama observasi harus minimal 2 karakter'),
  order: Yup.number()
    .integer('Urutan harus berupa angka')
    .min(0, 'Urutan tidak boleh negatif')
})
