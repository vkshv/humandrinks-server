const express = require('express')
const multer = require('multer')
const eventAdminController = require('../controllers/eventAdminController')
const authAdminMiddleware = require('../middleware/authAdminMiddleware')

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }
})

function multerErrorHandler(err, req, res, next) {
  console.error('Multer Error Caught:', err)

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Multer error: ${err.message}` })
  } else if (err) {
    return res.status(500).json({ message: `Unexpected error: ${err.message}` })
  }

  next()
}

router.get('/', authAdminMiddleware, eventAdminController.getEventItems)
router.post(
  '/',
  (req, res, next) => {
    console.log('ROUTE POST / triggered')
    next()
  },
  authAdminMiddleware,
  upload.any(),
  multerErrorHandler,
  (req, res, next) => {
    console.log('Multer passed:', req.files)
    next()
  },
  eventAdminController.createEventItem
)
router.put('/:id', authAdminMiddleware, upload.any(), eventAdminController.updateEventItem)
router.delete('/:id', authAdminMiddleware, eventAdminController.deleteEventItem)
router.get('/categories', authAdminMiddleware, eventAdminController.getEventCategories)

module.exports = router
