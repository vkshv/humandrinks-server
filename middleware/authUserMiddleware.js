const jwt = require('jsonwebtoken')
const { JWT_USER_SECRET } = require('../config/config')
const { STATUS_CODE, STATUS_TEXT } = require('../const/http')
const { verifyTelegramAuth } = require('../helpers/telegram')

// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: STATUS_TEXT[STATUS_CODE.UNAUTHORIZED] })
//   }

//   const token = authHeader.split(' ')[1]

//   try {
//     const decoded = jwt.verify(token, JWT_USER_SECRET)
//     req.user = decoded
//     next()
//   } catch (error) {
//     return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: STATUS_TEXT[STATUS_CODE.UNAUTHORIZED] })
//   }
// }

const authMiddleware = (req, res, next) => {
  try {
    // I have no idea what could throw an error here but... :D
    const initData = req.body.initData
    if (!initData || !verifyTelegramAuth(initData)) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ message: STATUS_TEXT[STATUS_CODE.BAD_REQUEST] })
    }
    next()
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: STATUS_TEXT[STATUS_CODE.INTERNAL_SERVER_ERROR] })
  }
}

module.exports = authMiddleware
