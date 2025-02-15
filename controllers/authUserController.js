const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { JWT_USER_SECRET, BOT_TOKEN } = require('../config/config')
const { STATUS_CODE, STATUS_TEXT } = require('../const/http')
const http = require('../services/http/strapiClient')

function verifyTelegramAuth(data) {
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest()
  const params = new URLSearchParams(data)
  const hash = params.get('hash')
  params.delete('hash')

  const sortedParams = [...params.entries()]
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n')

  const computedHash = crypto.createHmac('sha256', secretKey).update(sortedParams).digest('hex')

  return computedHash === hash
}

exports.authenticateUser = async (req, res) => {
  try {
    const initData = req.body.initData
    if (!initData || !verifyTelegramAuth(initData)) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ message: STATUS_TEXT[STATUS_CODE.BAD_REQUEST] })
    }
    const params = new URLSearchParams(initData)
    const user = JSON.parse(params.get('user'))
    const response = await http.get(`/visitors?filters[telegramId]=${user.id}`)
    if (response.data.data.length) {
      const userRegData = response.data.data[0]
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_USER_SECRET, { expiresIn: '8h' })
      res.json({
        token,
        name: userRegData.name,
        surname: userRegData.surname,
        patronymic: userRegData.patronymic,
        address: userRegData.address,
        phone: userRegData.phone,
        birth: userRegData.birth,
        bonus: userRegData.bonus
      })
    } else {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: STATUS_TEXT[STATUS_CODE.UNAUTHORIZED] })
    }
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: STATUS_TEXT[STATUS_CODE.INTERNAL_SERVER_ERROR] })
  }
}
