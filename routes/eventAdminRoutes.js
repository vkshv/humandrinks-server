const express = require('express')
const multer = require('multer')
const eventAdminController = require('../controllers/eventAdminController')
const authAdminMiddleware = require('../middleware/authAdminMiddleware')

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
})

router.get('/', authAdminMiddleware, eventAdminController.getEventItems)
router.post('/', authAdminMiddleware, upload.any(), eventAdminController.createEventItem)
router.put('/:id', authAdminMiddleware, upload.any(), eventAdminController.updateEventItem)
router.delete('/:id', authAdminMiddleware, eventAdminController.deleteEventItem)
router.get('/categories', authAdminMiddleware, eventAdminController.getEventCategories)

module.exports = router
