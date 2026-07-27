import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadsDir = path.join(process.cwd(), 'uploads', 'temp')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'video-' + suffix + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true)
  } else {
    cb(new Error('Hanya file video yang diperbolehkan'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2 GB
})

export const uploadSingleVideo = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) return next(err)
    if (!req.file) return res.status(400).json({ message: 'Tidak ada file yang diunggah' })
    next()
  })
}
