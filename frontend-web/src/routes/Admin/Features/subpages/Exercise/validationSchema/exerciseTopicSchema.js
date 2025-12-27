import * as Yup from 'yup'

export const createTopicSchema = Yup.object().shape({
  title: Yup.string().required('Judul topik harus diisi'),
  description: Yup.string(),
  universityTags: Yup.array().min(1, 'Minimal satu universitas harus dipilih'),
  semesterTags: Yup.array().min(1, 'Minimal satu semester harus dipilih'),
  questions: Yup.array().min(1, 'Minimal satu soal harus ada')
})

export const updateTopicSchema = Yup.object().shape({
  title: Yup.string().required('Judul topik harus diisi'),
  description: Yup.string(),
  universityTags: Yup.array().min(1, 'Minimal satu universitas harus dipilih'),
  semesterTags: Yup.array().min(1, 'Minimal satu semester harus dipilih'),
  questions: Yup.array().min(1, 'Minimal satu soal harus ada')
})
