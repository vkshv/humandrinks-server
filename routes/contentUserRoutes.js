const express = require('express')
const router = express.Router()
const authUserController = require('../controllers/contentUserController')
const authUserMiddleware = require('../middleware/authUserMiddleware')

router.get('/food-items', authUserMiddleware, authUserController.getFoodItems)
router.get('/food-categories', authUserMiddleware, authUserController.getFoodCategories)
router.get('/drink-items', authUserMiddleware, authUserController.getDrinkItems)
router.get('/drink-categories', authUserMiddleware, authUserController.getDrinkCategories)
router.get('/event-items', authUserMiddleware, authUserController.getEventItems)
router.get('/event-categories', authUserMiddleware, authUserController.getEventCategories)
router.get('/merch-items', authUserMiddleware, authUserController.getMerchItems)

module.exports = router
