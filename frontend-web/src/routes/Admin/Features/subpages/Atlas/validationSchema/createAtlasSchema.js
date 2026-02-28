import * as Yup from 'yup'

export const createAtlasSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  embedUrl: Yup.string().required('Embed URL is required'),
  structures: Yup.array().of(
    Yup.object({
      name: Yup.string().required('Structure name is required'),
      description: Yup.string(),
      system: Yup.string()
    })
  ),
  status: Yup.string().oneOf(['draft', 'published']).required()
})
