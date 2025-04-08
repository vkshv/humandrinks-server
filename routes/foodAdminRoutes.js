const express = require('express')
const multer = require('multer')
const foodAdminController = require('../controllers/foodAdminController')
const authAdminMiddleware = require('../middleware/authAdminMiddleware')

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.get('/', authAdminMiddleware, foodAdminController.getFoodItems)
router.post('/', authAdminMiddleware, upload.any(), foodAdminController.createFoodItem)
router.put('/:id', authAdminMiddleware, upload.any(), foodAdminController.updateFoodItem)
router.delete('/:id', authAdminMiddleware, foodAdminController.deleteFoodItem)
router.get('/categories', authAdminMiddleware, foodAdminController.getFoodCategories)
router.get('/subcategories', authAdminMiddleware, foodAdminController.getFoodSubcategories)
router.post('/swap-sort-weight', authAdminMiddleware, foodAdminController.swapSortWeight)
router.post('/:id/promote-sort-weight', authAdminMiddleware, foodAdminController.moveSortWeightOnTop)

module.exports = router
