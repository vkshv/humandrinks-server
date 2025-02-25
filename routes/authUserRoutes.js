const express = require('express')
const router = express.Router()
const authUserController = require('../controllers/authUserController')
const authUserAuthMiddleware = require('../middleware/authUserAuthMiddleware')

router.post('/authenticate-user', authUserController.authenticateUser)
router.post('/send-code', authUserController.sendCode)
router.post('/validate-code', authUserController.validateCode)
router.post('/register', authUserAuthMiddleware, authUserController.registerUser)

module.exports = router
