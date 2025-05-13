const express = require('express')
const multer = require('multer')
const visitorAdminController = require('../controllers/visitorAdminController')
const authAdminMiddleware = require('../middleware/authAdminMiddleware')

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
})

router.get('/', authAdminMiddleware, visitorAdminController.getVisitorItems)
router.post('/', authAdminMiddleware, upload.any(), visitorAdminController.createVisitorItem)
router.put('/:id', authAdminMiddleware, upload.any(), visitorAdminController.updateVisitorItem)
router.delete('/:id', authAdminMiddleware, visitorAdminController.deleteVisitorItem)
router.post('/send-messages', authAdminMiddleware, visitorAdminController.sendMessage)

module.exports = router
