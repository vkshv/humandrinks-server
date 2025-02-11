const express = require('express')
const router = express.Router()
const authAdminController = require('../controllers/authAdminController')

router.post('/sign-in', authAdminController.signIn)

module.exports = router
