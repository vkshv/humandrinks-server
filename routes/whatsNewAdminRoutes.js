const express = require('express')
const multer = require('multer')
const whatsNewAdminController = require('../controllers/whatsNewAdminController')
const authAdminMiddleware = require('../middleware/authAdminMiddleware')

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.get('/', authAdminMiddleware, whatsNewAdminController.getWhatsNewItems)
router.post('/', authAdminMiddleware, upload.any(), whatsNewAdminController.createWhatsNewItem)
router.put('/:id', authAdminMiddleware, upload.any(), whatsNewAdminController.updateWhatsNewItem)
router.delete('/:id', authAdminMiddleware, whatsNewAdminController.deleteWhatsNewItem)

module.exports = router
