import * as Yup from 'yup'

export const createFlashcardSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required'),

  description: Yup.string(),

  cards: Yup.array()
    .of(
      Yup.object().shape({
        front: Yup.string()
          .required('Front (question) is required')
          .min(1, 'Front must not be empty'),

        back: Yup.string()
          .required('Back (answer) is required')
          .min(1, 'Back must not be empty'),

        order: Yup.number()
          .min(0, 'Order must be a positive number')
      })
    )
    .min(1, 'At least one card is required'),

  universityTags: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required(),
        name: Yup.string().required()
      })
    ),

  semesterTags: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required(),
        name: Yup.string().required()
      })
    ),

  status: Yup.string()
    .oneOf(['draft', 'published'], 'Status must be either draft or published')
    .required('Status is required')
})

export const updateFlashcardSchema = Yup.object().shape({
  cards: Yup.array()
    .of(
      Yup.object().shape({
        front: Yup.string()
          .required('Front (question) is required')
          .min(1, 'Front must not be empty'),

        back: Yup.string()
          .required('Back (answer) is required')
          .min(1, 'Back must not be empty'),

        order: Yup.number()
          .min(0, 'Order must be a positive number')
      })
    )
    .min(1, 'At least one card is required')
})
