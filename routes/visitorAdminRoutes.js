const express = require('express')
const multer = require('multer')
const visitorAdminController = require('../controllers/visitorAdminController')
const authAdminMiddleware = require('../middleware/authAdminMiddleware')

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.get('/', authAdminMiddleware, visitorAdminController.getVisitorItems)
router.post('/', authAdminMiddleware, upload.any(), visitorAdminController.createVisitorItem)
router.put('/:id', authAdminMiddleware, upload.any(), visitorAdminController.updateVisitorItem)
router.delete('/:id', authAdminMiddleware, visitorAdminController.deleteVisitorItem)

module.exports = router
