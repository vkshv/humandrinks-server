const jwt = require('jsonwebtoken')
const { JWT_ADMIN_SECRET } = require('../config/config')
const { STATUS_CODE, STATUS_TEXT } = require('../const/http')

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(STATUS_CODE.NOT_FOUND).json({ message: STATUS_TEXT[STATUS_CODE.NOT_FOUND] }) // 404 for security
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET)
    req.admin = decoded
    next()
  } catch (error) {
    return res.status(STATUS_CODE.NOT_FOUND).json({ message: STATUS_TEXT[STATUS_CODE.NOT_FOUND] }) // 404 for security
  }
}

module.exports = authMiddleware
