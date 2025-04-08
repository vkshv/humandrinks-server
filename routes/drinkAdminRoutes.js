const express = require('express')
const multer = require('multer')
const drinkAdminController = require('../controllers/drinkAdminController')
const authAdminMiddleware = require('../middleware/authAdminMiddleware')

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.get('/', authAdminMiddleware, drinkAdminController.getDrinkItems)
router.post('/', authAdminMiddleware, upload.any(), drinkAdminController.createDrinkItem)
router.put('/:id', authAdminMiddleware, upload.any(), drinkAdminController.updateDrinkItem)
router.delete('/:id', authAdminMiddleware, drinkAdminController.deleteDrinkItem)
router.get('/categories', authAdminMiddleware, drinkAdminController.getDrinkCategories)
router.get('/subcategories', authAdminMiddleware, drinkAdminController.getDrinkSubcategories)
router.post('/swap-sort-weight', authAdminMiddleware, drinkAdminController.swapSortWeight)
router.post('/:id/promote-sort-weight', authAdminMiddleware, drinkAdminController.moveSortWeightOnTop)

module.exports = router
