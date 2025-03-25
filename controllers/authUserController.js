const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { JWT_USER_SECRET, JWT_USER_AUTH_SECRET, BOT_TOKEN } = require('../config/config')
const { STATUS_CODE, STATUS_TEXT } = require('../const/http')
const { setCode, getCode } = require('../stores/authCodes')
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
      return res.json({
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

exports.sendCode = async (req, res) => {
  const phone = req.body.phone
  if (!/^\+7 \(\d\d\d\) \d\d\d \d\d \d\d$/.test(phone)) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({ message: STATUS_TEXT[STATUS_CODE.BAD_REQUEST] })
  }
  // Проверка стоимости СМС
  const code = crypto.randomInt(1000, 1001)
  // Отправка СМС
  setCode(phone, code.toString())
  return res.json({})
}

exports.validateCode = async (req, res) => {
  const phone = req.body.phone
  const code = req.body.code
  const initData = req.body.initData
  if (
    !/^\+7 \(\d\d\d\) \d\d\d \d\d \d\d$/.test(phone)
    || !/^\d\d\d\d$/.test(code)
    || !initData
    || !verifyTelegramAuth(initData)
  ) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({ message: STATUS_TEXT[STATUS_CODE.BAD_REQUEST] })
  }
  if (getCode(phone) === code) {
    const params = new URLSearchParams(initData)
    const user = JSON.parse(params.get('user'))
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_USER_AUTH_SECRET, { expiresIn: '8h' })
    try {
      const response = await http.get(`/visitors?filters[phone]=${encodeURIComponent(phone)}`)
      if (response.data.data.length) {
        const userRegData = response.data.data[0]
        return res.json({
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
        return res.json({ token })
      }
    } catch (error) {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: STATUS_TEXT[STATUS_CODE.INTERNAL_SERVER_ERROR] })
    }
  }
  return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: 'Неверный СМС-код' })
}

exports.registerUser = async (req, res) => {
  const name = req.body.name
  const surname = req.body.surname
  const patronymic = req.body.patronymic
  const address = req.body.address
  const phone = req.body.phone
  const birth = req.body.birth
  const telegramId = req.user.id
  const promocode = req.body.promocode
  const data = { name, surname, patronymic, address, phone, birth, telegramId, bonus: 0 }

  if (promocode) {
    try {
      const response_promo = await http.get('/promo?fields=Promocodes')
      const _promo = response_promo.data.data.Promocodes.find((e) => e.code === promocode)
      if (_promo && _promo.register) {
        data.bonus = _promo.bonus
      }
    } catch (error) {}
  }

  if (!name || !surname || !patronymic || !address || !phone || !birth) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({ message: STATUS_TEXT[STATUS_CODE.BAD_REQUEST] })
  }

  try {
    const response = await http.get(`/visitors?filters[phone]=${encodeURIComponent(phone)}`)
    if (response.data.data.length) {
      await http.put(`/visitors/${response.data.data[0].documentId}`, { data })
      return res.json({})
    } else {
      await http.post('/visitors', { data })
      return res.json({})
    }
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: STATUS_TEXT[STATUS_CODE.INTERNAL_SERVER_ERROR] })
  }
}

exports.checkRegPromocode = async (req, res) => {
  const promocode = req.query.promocode
  if (promocode) {
    try {
      const response = await http.get('/promo?fields=Promocodes')
      const _promo = response.data.data.Promocodes.find((e) => e.code === promocode)
      if (_promo && _promo.register) return res.json(_promo)
      return res.status(STATUS_CODE.NOT_FOUND).json({ message: STATUS_TEXT[STATUS_CODE.NOT_FOUND] })
    } catch (error) {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: STATUS_TEXT[STATUS_CODE.INTERNAL_SERVER_ERROR] })
    }
  }
  return res.status(STATUS_CODE.BAD_REQUEST).json({ message: STATUS_TEXT[STATUS_CODE.BAD_REQUEST] })
}

exports.redeemPromocode = async (req, res) => {
  const req_promocode = req.body.promocode
  const telegramId = req.user.id
  try {
    const response_promocodes = await http.get('/promo?fields=Promocodes')
    const current_promo = response_promocodes.data.data.Promocodes.find((e) => e.code === req_promocode)
    if (!current_promo || current_promo.register) return res.status(STATUS_CODE.NOT_FOUND).json({ message: STATUS_TEXT[STATUS_CODE.NOT_FOUND] })
    // промокод валиден

    const response_user = await http.get(`/visitors?filters[telegramId]=${telegramId}`)
    if (!response_user.data.data.length) return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: STATUS_TEXT[STATUS_CODE.INTERNAL_SERVER_ERROR] })
    const user = response_user.data.data[0]
    // пользователь найден

    if (user.redeemedPromocodes?.includes(current_promo.code)) return res.status(STATUS_CODE.BAD_REQUEST).json({ message: STATUS_TEXT[STATUS_CODE.BAD_REQUEST] })
    // промокод еще не был погашен

    const new_data = { redeemedPromocodes: [...(user.redeemedPromocodes ?? []), current_promo.code] }
    if (current_promo.bonus) {
      new_data.bonus = user.bonus + current_promo.bonus
    }
    // payload для PUT-запроса сформирован

    await http.put(`/visitors/${user.documentId}`, { data: new_data })
    return res.json(current_promo)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: STATUS_TEXT[STATUS_CODE.INTERNAL_SERVER_ERROR] })
  }
}
