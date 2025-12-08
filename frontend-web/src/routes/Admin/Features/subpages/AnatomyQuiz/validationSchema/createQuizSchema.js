import * as Yup from 'yup'

export const createQuizSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
//   image: Yup.mixed()
//     .test('fileSize', 'Ukuran file terlalu besar. Maksimum ukuran file adalah 5MB', (value) => {
//         if (!value) return true; // Require file
//         const file = value;
//         return file.size <= 5 * 1024 * 1024; // 20MB limit
//     })
//     .test('fileType', 'Tipe file tidak didukung. Silakan upload file PDF', (value) => {
//         if (!value) return true; // Require file
//         const file = value;
//         const supportedTypes = [
//             'application/pdf',
//         ];
//         return supportedTypes.includes(file.type);
//     })
//     .required('Image is required'),
  image_url: Yup.string().url('Invalid image URL').required('Image URL is required'),
  image_key: Yup.string().required('Image key is required'),
  image_filename: Yup.string().required('Image filename is required'),
  tags: Yup.array().min(1, 'At least one tag is required'),
  questions: Yup.array().min(1, 'At least one question is required'),
  status: Yup.string().required('Status is required'),
})
