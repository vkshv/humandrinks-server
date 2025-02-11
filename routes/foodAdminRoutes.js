const express = require('express')
const router = express.Router()
const foodAdminController = require('../controllers/foodAdminController')
const authAdminMiddleware = require('../middleware/authAdminMiddleware')

router.get('/', authAdminMiddleware, foodAdminController.getFoodItems)
router.post('/', authAdminMiddleware, foodAdminController.createFoodItems)
router.put('/:id', authAdminMiddleware, foodAdminController.updateFoodItems)
router.delete('/:id', authAdminMiddleware, foodAdminController.deleteFoodItems)

module.exports = router
