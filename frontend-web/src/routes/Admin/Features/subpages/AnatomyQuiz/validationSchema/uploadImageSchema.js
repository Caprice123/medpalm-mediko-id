import * as Yup from 'yup'

export const uploadImageSchema = Yup.object({
  file: Yup.mixed()
    .test('fileSize', 'Ukuran file terlalu besar. Maksimum ukuran file adalah 5MB', (value) => {
        if (!value) return true; // Require file
        const file = value;
        return file.size <= 5 * 1024 * 1024; // 5MB limit
    })
    .test('fileType', 'Tipe file tidak didukung. Silakan upload file gambar (JPEG, PNG)', (value) => {
        if (!value) return true; // Require file
        const file = value;
        const supportedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
        ];
        return supportedTypes.includes(file.type);
    })
    .required('Image is required'),
})