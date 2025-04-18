const express = require('express')
const multer = require('multer')
const merchAdminController = require('../controllers/merchAdminController')
const authAdminMiddleware = require('../middleware/authAdminMiddleware')

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.get('/', authAdminMiddleware, merchAdminController.getMerchItems)
router.post('/', authAdminMiddleware, upload.any(), merchAdminController.createMerchItem)
router.put('/:id', authAdminMiddleware, upload.any(), merchAdminController.updateMerchItem)
router.delete('/:id', authAdminMiddleware, merchAdminController.deleteMerchItem)
router.post('/swap-sort-weight', authAdminMiddleware, merchAdminController.swapSortWeight)
router.post('/:id/promote-sort-weight', authAdminMiddleware, merchAdminController.moveSortWeightOnTop)

module.exports = router
