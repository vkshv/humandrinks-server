const express = require('express')
const router = express.Router()
const authUserController = require('../controllers/authUserController')

router.post('/authenticate-user', authUserController.authenticateUser)

module.exports = router
