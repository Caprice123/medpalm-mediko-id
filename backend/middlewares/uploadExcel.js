import multer from 'multer'

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ]
    if (allowed.includes(file.mimetype) || /\.(xlsx|xls)$/i.test(file.originalname)) {
      cb(null, true)
    } else {
      cb(new Error('Hanya file Excel (.xlsx, .xls) yang diizinkan'), false)
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
})

export const uploadExcel = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) return next(err)
    if (!req.file) return res.status(400).json({ message: 'File Excel wajib diunggah' })
    next()
  })
}
