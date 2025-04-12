const express = require('express')
const router = express.Router()
const authUserController = require('../controllers/authUserController')
const authUserMiddleware = require('../middleware/authUserMiddleware')
const authUserAuthMiddleware = require('../middleware/authUserAuthMiddleware')

router.post('/authenticate-user', authUserController.authenticateUser)
// router.post('/send-code', authUserController.sendCode)
router.post('/call-password', authUserController.callPassword)
router.post('/validate-code', authUserController.validateCode)
router.post('/register', authUserAuthMiddleware, authUserController.registerUser)
router.get('/check-reg-promocode', authUserAuthMiddleware, authUserController.checkRegPromocode)
router.post('/suggest-address', authUserAuthMiddleware, authUserController.suggestAddress)
router.post('/redeem-promocode', authUserMiddleware, authUserController.redeemPromocode)
router.post('/get-user', authUserMiddleware, authUserController.getUser)
router.post('/sync-visitor', authUserMiddleware, authUserController.syncVisitor)

module.exports = router
