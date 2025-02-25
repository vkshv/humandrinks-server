const jwt = require('jsonwebtoken')
const { JWT_USER_AUTH_SECRET } = require('../config/config')
const { STATUS_CODE, STATUS_TEXT } = require('../const/http')

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: STATUS_TEXT[STATUS_CODE.UNAUTHORIZED] })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_USER_AUTH_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: STATUS_TEXT[STATUS_CODE.UNAUTHORIZED] })
  }
}

module.exports = authMiddleware
