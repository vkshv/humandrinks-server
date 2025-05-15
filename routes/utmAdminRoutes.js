const express = require('express')
const utmAdminController = require('../controllers/utmAdminController')
const authAdminMiddleware = require('../middleware/authAdminMiddleware')

const router = express.Router()

router.get('/statistics', authAdminMiddleware, utmAdminController.getUTMStatistics)

module.exports = router
