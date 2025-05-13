const express = require('express')
const multer = require('multer')
const eventAdminController = require('../controllers/eventAdminController')
const authAdminMiddleware = require('../middleware/authAdminMiddleware')

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

function multerErrorHandler(err, req, res, next) {
  console.error('Multer Error:', err)
  res.status(500).json({ message: 'Multer processing failed', error: err.message })
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
