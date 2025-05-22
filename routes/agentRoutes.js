const express = require('express')
const router = express.Router()
const agentController = require('../controllers/agentController')
const authUserMiddleware = require('../middleware/authUserMiddleware')

router.post('/activate-referral-program', authUserMiddleware, agentController.activateReferralProgram)

module.exports = router
