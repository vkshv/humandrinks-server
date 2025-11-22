const express = require('express')
const router = express.Router()
const authUserController = require('../controllers/contentUserController')
const authUserMiddleware = require('../middleware/authUserMiddleware')

router.post('/food-items', authUserMiddleware, authUserController.getFoodItems)
router.post('/food-categories', authUserMiddleware, authUserController.getFoodCategories)
// router.get('/drink-items', authUserMiddleware, authUserController.getDrinkItems)
// router.get('/drink-categories', authUserMiddleware, authUserController.getDrinkCategories)
router.post('/event-items', authUserMiddleware, authUserController.getEventItems)
// router.get('/event-categories', authUserMiddleware, authUserController.getEventCategories)
router.post('/merch-items', authUserMiddleware, authUserController.getMerchItems)
// router.get('/whats-new-items', authUserMiddleware, authUserController.getWhatsnewItems)
router.post('/send', authUserMiddleware, authUserController.sendBotMessage)

module.exports = router
